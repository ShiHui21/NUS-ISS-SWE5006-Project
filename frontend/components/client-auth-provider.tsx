"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { loginUser, logoutUser, getUserDetails } from "@/lib/api-service"

interface User {
  id: string
  name: string
  email: string
  username: string
  mobile: string
  region: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface ClientAuthProviderProps {
  children: ReactNode
}

export default function ClientAuthProvider({ children }: ClientAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token")

        if (token) {
          // Fetch user details from the backend
          const userDetails = await getUserDetails()
          setUser({
            id: userDetails.id,
            name: userDetails.name,
            email: userDetails.email,
            username: userDetails.username,
            mobile: userDetails.mobile,
            region: userDetails.region,
          })
        }
      } catch (error) {
        console.error("Auth check error:", error)
        // Clear token if it's invalid
        localStorage.removeItem("auth_token")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading) {
      const publicPaths = ["/login", "/register", "/logout"]
      const isPublicPath = publicPaths.includes(pathname)

      if (!user && !isPublicPath && pathname !== "/") {
        router.push("/login")
      } else if (user && isPublicPath && pathname !== "/logout") {
        router.push("/explore")
      } else if (pathname === "/" && !loading) {
        if (user) {
          router.push("/explore")
        } else {
          router.push("/login")
        }
      }
    }
  }, [user, loading, pathname, router])

  // Handle browser back button and ensure unauthenticated users are redirected to login
  useEffect(() => {
    const publicPaths = ["/login", "/register", "/logout"]
    const handlePopState = () => {
      if (!user && !loading) {
        router.replace("/login")
      }
    }

    window.addEventListener("popstate", handlePopState)

    // Also check on initial load
    if (!user && !loading && !publicPaths.includes(pathname) && pathname !== "/") {
      router.replace("/login")
    }

    return () => window.removeEventListener("popstate", handlePopState)
  }, [user, loading, pathname, router])

  const login = async (username: string, password: string) => {
    setLoading(true)

    try {
      // Call the login API
      await loginUser(username, password)

      // Fetch user details after successful login
      const userDetails = await getUserDetails()

      // Set user in state
      setUser({
        id: userDetails.id,
        name: userDetails.name,
        email: userDetails.email,
        username: userDetails.username,
        mobile: userDetails.mobile,
        region: userDetails.region,
      })

      return true
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)

    try {
      // Call the logout function
      logoutUser()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}
