"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import ExploreClient from "./explore-client"
import { getAllListings } from "@/lib/api-service"
import type { ListingType } from "@/types/listing"
import { Loader2 } from "lucide-react"

export default function ExplorePage() {
  const [listings, setListings] = useState<ListingType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      try {
        // Check if user is authenticated
        const token = localStorage.getItem("auth_token")
        if (!token) {
          router.push("/login")
          return
        }

        // Fetch all active listings
        const fetchedListings = await getAllListings({ excludeUser: true})
        setListings(fetchedListings)
      } catch (error) {
        console.error("Failed to fetch listings:", error)
        setError("Failed to load listings. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load listings. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [router, toast])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-blue-600">Loading marketplace...</h2>
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

  return <ExploreClient initialListings={listings} />
}
