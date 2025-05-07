"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PokemonCard } from "@/components/pokemon-card"
import { Navbar } from "@/components/navbar"
import type { ListingType } from "@/types/listing"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, HeartOff } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getWishlist, callRemoveFromWishlist } from "@/lib/api-service"

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<ListingType[]>([])
  const [loading, setLoading] = useState(true)
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false)
  const [listingToRemove, setListingToRemove] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch wishlist items on component mount
  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true)
      try {
        const wishlistItems = await getWishlist()
        setWishlist(wishlistItems)
        console.log("wishlist items", wishlistItems)
      } catch (error) {
        console.error("Failed to fetch wishlist:", error)
        toast({
          title: "Error",
          description: "Failed to load your wishlist. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [toast])

  const handleRemoveFromWishlist = (listingId: string) => {
    setListingToRemove(listingId)
    setRemoveConfirmOpen(true)
  }

  const confirmRemoveFromWishlist = async () => {
    if (!listingToRemove) return

    try {
      // Call the API to remove from wishlist
      await callRemoveFromWishlist(listingToRemove)

      // Remove the listing from state
      setWishlist((prev) => prev.filter((listing) => listing.id !== listingToRemove))

      toast({
        title: "Removed from Wishlist",
        description: "The card has been removed from your wishlist.",
      })
    } catch (error) {
      console.error("Failed to remove from wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to remove from wishlist. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRemoveConfirmOpen(false)
      setListingToRemove(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-blue-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center text-blue-600">
            My <span className="text-yellow-500">Wishlist</span>
          </h1>
          <p className="text-center text-gray-600 mt-2">Cards you've saved for later</p>
        </div>

        <Card className="shadow-md">
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-500">Loading your wishlist...</p>
              </div>
            ) : wishlist.length > 0 ? (
              <div>
                <h2 className="text-xl font-semibold text-blue-600 mb-4">
                  {wishlist.length} {wishlist.length === 1 ? "Card" : "Cards"} in Wishlist
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {wishlist.map((card) => (
                    <div key={card.id} className="relative group">
                      <PokemonCard
                        card={card}
                        onClick={() => {}} // No action on click
                        // isSold={card.listingStatus === "Sold"}
                      />
                      {/* Overlay with unheart icon */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-full bg-white/90 hover:bg-white text-red-600"
                          onClick={() => handleRemoveFromWishlist(card.id)}
                        >
                          <HeartOff className="h-5 w-5 fill-current" />
                          <span className="sr-only">Remove from Wishlist</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Your wishlist is empty.</p>
                <Button
                  onClick={() => (window.location.href = "/explore")}
                  variant="link"
                  className="mt-2 text-blue-500"
                >
                  Browse cards
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Remove from Wishlist Confirmation Dialog */}
      <AlertDialog open={removeConfirmOpen} onOpenChange={setRemoveConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Wishlist?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this card from your wishlist?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveFromWishlist} className="bg-red-600 hover:bg-red-700 text-white">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
