"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { logoutUser } from "@/lib/api-service"

export default function LogoutPage() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Log out the user
    const logout = async () => {
      try {
        logoutUser()
      } catch (error) {
        console.error("Logout error:", error)
      }
    }

    logout()

    // toast({
    //   title: "Logged Out Successfully",
    //   description: "You have been logged out of your account.",
    // })
  }, [toast])

  const handleLoginAgain = () => {
    // Clear any client-side auth state to ensure user is logged out
    localStorage.removeItem("auth_token")

    // Redirect to login page
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <span className="text-4xl font-bold text-blue-600 opacity-70">
              Poké<span className="text-yellow-500">Trade</span>
            </span>
          </div>
          <h1 className="text-3xl font-bold text-yellow-500 drop-shadow-md">
            {/* <span className="text-blue-500">Poké</span>Trade */}
          </h1>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-blue-600">See You Soon!</CardTitle>
            <CardDescription className="text-center">You have been successfully logged out</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <p className="text-center text-gray-600">
              Thank you for visiting PokéTrade. We hope to see you again soon!
            </p>
            <Button onClick={handleLoginAgain} className="bg-blue-600 hover:bg-blue-700 text-white">
              Log In Again
            </Button>
            {/* <Button onClick={() => (window.location.href = "/explore")} variant="link" className="mt-2 text-blue-500">
              Browse cards
            </Button> */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
