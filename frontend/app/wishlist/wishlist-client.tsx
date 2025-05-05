"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PokemonCard } from "@/components/pokemon-card"
import { PokemonCardDetail } from "@/components/pokemon-card-detail"
import { Navbar } from "@/components/navbar"
import type { ListingType } from "@/types/listing"
import { useToast } from "@/components/ui/use-toast"
import { Heart } from "lucide-react"
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

interface WishlistClientProps {
  initialWishlist: ListingType[]
}

export default function WishlistClient({ initialWishlist }: WishlistClientProps) {
  const [wishlist, setWishlist] = useState(initialWishlist)
  const [selectedCard, setSelectedCard] = useState<ListingType | null>(null)
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false)
  const [listingToRemove, setListingToRemove] = useState<string | null>(null)
  const { toast } = useToast()

  const handleRemoveFromWishlist = (listingId: string) => {
    setListingToRemove(listingId)
    setRemoveConfirmOpen(true)
  }

  const confirmRemoveFromWishlist = async () => {
    if (!listingToRemove) return

    try {
      // This would be replaced with actual API call to Spring Boot backend
      const response = await fetch(`/api/wishlist/${listingToRemove}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove from wishlist")
      }

      // Remove the listing from state
      setWishlist((prev) => prev.filter((listing) => listing.id !== listingToRemove))

      // If the card being removed is currently selected, close the detail view
      if (selectedCard && selectedCard.id === listingToRemove) {
        setSelectedCard(null)
      }

      toast({
        title: "Removed from Wishlist",
        description: "The card has been removed from your wishlist.",
      })
    } catch (error) {
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
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {wishlist.map((card) => (
                  <div key={card.id} className="relative group">
                    <PokemonCard card={card} onClick={() => setSelectedCard(card)} isSold={card.sold} />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full bg-white/90 hover:bg-white text-red-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveFromWishlist(card.id)
                        }}
                      >
                        <Heart className="h-5 w-5 text-red-600" />
                        <span className="sr-only">Remove from Wishlist</span>
                      </Button>
                    </div>
                  </div>
                ))}
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

      {/* Card Detail Modal */}
      {selectedCard && (
        <PokemonCardDetail
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          showRemoveFromWishlist
          onRemoveFromWishlist={() => handleRemoveFromWishlist(selectedCard.id)}
        />
      )}

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
