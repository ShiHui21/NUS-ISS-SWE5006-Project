"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import ProfileClient from "./profile-client"
import { getUserDetails, getAllListings } from "@/lib/api-service"
import type { UserType } from "@/types/user"
import type { ListingType } from "@/types/listing"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserType | null>(null)
  const [listings, setListings] = useState<ListingType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true)
      try {
        // Check if user is authenticated
        const token = localStorage.getItem("auth_token")
        if (!token) {
          router.push("/login")
          return
        }

        // Fetch user details
        const userDetails = await getUserDetails()
        setProfile(userDetails)

        // Fetch user's listings
        const userListings = await getAllListings({ username: userDetails.username })

        setListings(userListings)
      } catch (error) {
        console.error("Failed to fetch profile data:", error)
        setError("Failed to load profile data. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [router, toast])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-blue-600">Loading your profile...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-blue-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-blue-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-yellow-600 mb-4">Session Expired</h2>
          <p className="text-gray-600 mb-4">Please log in again to view your profile.</p>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return <ProfileClient profile={profile} initialListings={listings} />
}
