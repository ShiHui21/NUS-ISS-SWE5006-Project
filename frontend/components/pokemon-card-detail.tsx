"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Heart, HeartOff, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ListingType } from "@/types/listing"
import { useToast } from "@/components/ui/use-toast"
import { PlaceholderImage } from "@/components/placeholder-image"
import { callAddToWishlist, callRemoveFromWishlist } from "@/lib/api-service"

interface PokemonCardDetailProps {
  card: ListingType
  onClose: () => void
  showRemoveFromWishlist?: boolean
  // onRemoveFromWishlist?: () => void
}

export function PokemonCardDetail({
  card,
  onClose,
  showRemoveFromWishlist = false,
  // onRemoveFromWishlist,
}: PokemonCardDetailProps) {
  const [isInWishlist, setIsInWishlist] = useState(showRemoveFromWishlist)
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
      // Call the API service function to add to wishlist
      await callAddToWishlist(card.id)

      setIsInWishlist(true)

      toast({
        title: "Added to Wishlist",
        description: "The card has been added to your wishlist.",
      })
    } catch (error) {
      console.error("Failed to add to wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to add to wishlist. Please try again.",
        variant: "destructive",
      })
    }
  }

  const removeFromWishlist = async () => {
    try {
      // Call the API service function to add to wishlist
      await callRemoveFromWishlist(card.id)

      setIsInWishlist(false)

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

          {/* Right column - Details */}
          <div className="flex flex-col space-y-6">
            {/* Title and Price */}
            <div>
              <h2 className="text-2xl font-bold text-blue-600">{card.title}</h2>
              <div className="text-2xl font-bold text-yellow-600 mt-2">${card.price.toFixed(2)}</div>
            </div>

            {/* Seller Information */}
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Seller Information</h3>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                  {card.sellerName ? card.sellerName.charAt(0).toUpperCase() : "S"}
                </div>
                <div>
                  <Link href={`/seller/${card.sellerId}`} className="text-blue-500 hover:underline font-medium">
                    {card.sellerName}
                  </Link>
                  <p className="text-gray-600 text-sm">Region: {card.sellerRegion}</p>
                </div>
              </div>
            </div>

            {/* Card Details */}
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Card Details</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {card.rarity && <Badge className={getRarityColor(card.rarity)}>{card.rarity}</Badge>}
                {(card.condition) && (
                  <Badge className={getConditionColor(card.condition)}>
                    {card.condition}
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-2 gap-y-2">
                <div>
                  <p className="text-sm text-gray-500">Card Type</p>
                  <p className="text-gray-700">{card.cardType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Listed On</p>
                  <p className="text-gray-700">
                    {card.listedOn
                      ? new Date(card.listedOn).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Recently"}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2">Description</h3>
              <p className="text-gray-700">{card.description || "No description provided."}</p>
            </div>

            {/* Wishlist Button */}
            <div className="mt-auto pt-2">
              {card.listingStatus !== "Sold" && !isInWishlist && (
                <Button onClick={addToWishlist} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Heart className="mr-2 h-4 w-4" />
                  Add to wishlist
                </Button>
              )}

              {card.listingStatus !== "Sold" && isInWishlist && (
                <Button
                  onClick={removeFromWishlist}
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                >
                  <HeartOff className="mr-2 h-4 w-4" />
                  Remove from wishlist
                </Button>
              )}

              {card.listingStatus === "Sold" && (
                <p className="text-red-600 text-center font-medium">
                  This card has been sold and is no longer available.
                </p>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
