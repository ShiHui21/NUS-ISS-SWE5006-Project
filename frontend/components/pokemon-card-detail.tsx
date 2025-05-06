"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ListingType } from "@/types/listing"
import { useToast } from "@/components/ui/use-toast"
import { PlaceholderImage } from "@/components/placeholder-image"

interface PokemonCardDetailProps {
  card: ListingType
  onClose: () => void
  showRemoveFromWishlist?: boolean
  onRemoveFromWishlist?: () => void
}

export function PokemonCardDetail({
  card,
  onClose,
  showRemoveFromWishlist = false,
  onRemoveFromWishlist,
}: PokemonCardDetailProps) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { toast } = useToast()

  // Combine main image with additional images for the gallery
  const allImages = [card.imageUrl, ...(card.additionalImages || [])].filter(Boolean)

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "bg-gray-200 text-gray-800"
      case "Uncommon":
        return "bg-green-200 text-green-800"
      case "Rare":
        return "bg-blue-200 text-blue-800"
      case "Double Rare":
        return "bg-purple-200 text-purple-800"
      case "Illustration Rare":
        return "bg-pink-200 text-pink-800"
      case "Special Illustration Rare":
        return "bg-yellow-200 text-yellow-800"
      case "Hyper Rare":
        return "bg-red-200 text-red-800"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Brand New":
        return "bg-emerald-200 text-emerald-800"
      case "Like New":
        return "bg-green-200 text-green-800"
      case "Lightly Used":
        return "bg-blue-200 text-blue-800"
      case "Well Used":
        return "bg-yellow-200 text-yellow-800"
      case "Heavily Used":
        return "bg-orange-200 text-orange-800"
      case "Damage":
        return "bg-red-200 text-red-800"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  const rarityColor = getRarityColor(card.rarity)
  const conditionColor = getConditionColor(card.condition)

  const addToWishlist = async () => {
    try {
      // This would be replaced with actual API call to Spring Boot backend
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listingId: card.id }),
      })

      if (!response.ok) {
        throw new Error("Failed to add to wishlist")
      }

      setIsInWishlist(true)

      toast({
        title: "Added to Wishlist",
        description: "The card has been added to your wishlist.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to wishlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10" onClick={onClose}>
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="flex flex-col">
            <div className="relative rounded-lg overflow-hidden shadow-md">
              {allImages.length > 0 ? (
                <>
                  {/* {imageError ? (
                    <PlaceholderImage
                      width={500}
                      height={500}
                      text={`Pokémon Card: ${card.title}`}
                      className="w-full aspect-square object-cover"
                    />
                  ) : (
                    <Image
                      src={allImages[currentImageIndex]}
                      alt={card.title}
                      width={500}
                      height={500}
                      className="w-full aspect-square object-cover"
                      onError={() => setImageError(true)}
                    />
                  )} */}
                  <Image
                      src={allImages[currentImageIndex]}
                      alt={card.title}
                      width={500}
                      height={500}
                      className="w-full aspect-square object-cover"
                      onError={() => setImageError(true)}
                    />
                  {card.listingStatus==="Sold" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <Badge className="text-lg px-3 py-1 bg-red-500 text-white">SOLD</Badge>
                    </div>
                  )}

                  {/* Image navigation buttons */}
                  {allImages.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          goToPrevImage()
                        }}
                        disabled={currentImageIndex === 0}
                        style={{ opacity: currentImageIndex === 0 ? 0.5 : 1 }}
                      >
                        <ChevronLeft className="h-6 w-6" />
                        <span className="sr-only">Previous image</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          goToNextImage()
                        }}
                        disabled={currentImageIndex === allImages.length - 1}
                        style={{ opacity: currentImageIndex === allImages.length - 1 ? 0.5 : 1 }}
                      >
                        <ChevronRight className="h-6 w-6" />
                        <span className="sr-only">Next image</span>
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <PlaceholderImage
                  width={500}
                  height={500}
                  text={`Pokémon Card: ${card.title}`}
                  className="w-full aspect-square object-cover"
                />
              )}
            </div>

            {allImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2 mt-4">
                {allImages.map((image, index) => (
                  <div
                    key={index}
                    className={`rounded-md overflow-hidden shadow cursor-pointer ${currentImageIndex === index ? "ring-2 ring-blue-500" : ""}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    {image ? (
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${card.title} - Image ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full aspect-square object-cover"
                        onError={(e) => {
                          // Replace with placeholder on error
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          const parent = target.parentElement
                          if (parent) {
                            const placeholder = document.createElement("div")
                            placeholder.className = "w-full aspect-square bg-gray-200 flex items-center justify-center"
                            placeholder.innerHTML = `<span class="text-xs text-gray-500">Image ${index + 1}</span>`
                            parent.appendChild(placeholder)
                          }
                        }}
                      />
                    ) : (
                      <PlaceholderImage
                        width={100}
                        height={100}
                        text={`Image ${index + 1}`}
                        className="w-full aspect-square object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-blue-700 mb-2">{card.title}</h2>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={rarityColor}>{card.rarity}</Badge>
              <Badge className={conditionColor}>{card.condition}</Badge>
            </div>

            <div className="text-3xl font-bold text-yellow-600 mb-4">${card.price}</div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Description</h3>
              <p className="text-gray-700">{card.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Seller Information</h3>
              <Link href={`/seller/${card.sellerId}`} className="text-blue-500 hover:underline font-medium">
                {card.sellerName}
              </Link>
              {/* <p className="text-gray-600 mt-1">Region: {card.region}</p> */}
            </div>

            {card.listingStatus!=="Sold" && !showRemoveFromWishlist && (
              <Button
                onClick={addToWishlist}
                disabled={isInWishlist}
                className={`mt-auto ${isInWishlist ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700"} text-white`}
              >
                <Heart className="mr-2 h-4 w-4" />
                {isInWishlist ? "Added to Wishlist" : "Add to Wishlist"}
              </Button>
            )}

            {showRemoveFromWishlist && onRemoveFromWishlist && (
              <Button
                onClick={onRemoveFromWishlist}
                variant="outline"
                className="mt-auto border-red-300 text-red-600 hover:bg-red-50"
              >
                <Heart className="mr-2 h-4 w-4" />
                Remove from Wishlist
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
