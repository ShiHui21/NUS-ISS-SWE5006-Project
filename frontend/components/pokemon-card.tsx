"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ListingType } from "@/types/listing"
import { motion } from "framer-motion"
import { PlaceholderImage } from "@/components/placeholder-image"

interface PokemonCardProps {
  card: ListingType
  onClick: () => void
  isSold?: boolean
}

export function PokemonCard({ card, onClick, isSold = card.listingStatus==="Sold" }: PokemonCardProps) {
  const [imageError, setImageError] = useState(false)

  // Updated to handle the new rarity values
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

  const rarityColor = getRarityColor(card.rarity)

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className={`overflow-hidden shadow-md transition-all duration-300 ${isSold ? "opacity-70" : ""}`}>
        <div className="relative">
          {/* {imageError || !card.imageUrl ? (
            <PlaceholderImage
              width={300}
              height={300}
              text={`Pokémon Card: ${card.title}`}
              className="w-full aspect-square object-cover"
            />
          ) : (
            <Image
              src={card.imageUrl}
              alt={card.title}
              width={300}
              height={300}
              className="w-full aspect-square object-cover"
              onError={() => setImageError(true)}
            />
          )} */}
          <Image
              src={card.imageUrl}
              alt={card.title}
              width={300}
              height={300}
              className="w-full aspect-square object-cover"
              // onError={() => setImageError(true)}
            />
          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Badge className="text-lg px-3 py-1 bg-red-500 text-white">SOLD</Badge>
            </div>
          )}
          <Badge className={`absolute top-2 right-2 ${rarityColor}`}>{card.rarity}</Badge>
        </div>
        <CardContent className="p-3">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-blue-800 line-clamp-1">{card.title}</h3>
            <span className="font-bold text-yellow-600">${card.price}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
