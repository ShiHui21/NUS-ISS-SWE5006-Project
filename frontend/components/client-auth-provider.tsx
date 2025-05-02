"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
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
    const checkAuth = () => {
      try {
        // This would be replaced with actual API call to Spring Boot backend
        const storedUser = localStorage.getItem("user")

        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Auth check error:", error)
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

  const login = async (email: string, password: string) => {
    setLoading(true)

    try {
      // This would be replaced with actual API call to Spring Boot backend
      // For now, we'll simulate a successful login with mock data
      const mockUser = {
        id: "user-123",
        name: "Demo User",
        email,
      }

      // Store user in state and localStorage
      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))

      // Return success
      // return true
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
      // This would be replaced with actual API call to Spring Boot backend
      setUser(null)
      localStorage.removeItem("user")
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}
