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

export function PokemonCard({ card, onClick, isSold = false }: PokemonCardProps) {
  const [imageError, setImageError] = useState(false)

  const rarityColors = {
    common: "bg-gray-200 text-gray-800",
    uncommon: "bg-green-200 text-green-800",
    rare: "bg-blue-200 text-blue-800",
    "ultra-rare": "bg-purple-200 text-purple-800",
    "secret-rare": "bg-yellow-200 text-yellow-800",
  }

  const rarityColor = rarityColors[card.rarity as keyof typeof rarityColors] || rarityColors.common

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className={`overflow-hidden shadow-md transition-all duration-300 ${isSold ? "opacity-70" : ""}`}>
        <div className="relative">
          {imageError || !card.imageUrl ? (
            <PlaceholderImage
              width={300}
              height={300}
              text={`Pokémon Card: ${card.title}`}
              className="w-full aspect-square object-cover"
            />
          ) : (
            <Image
              src={card.imageUrl || "/placeholder.svg"}
              alt={card.title}
              width={300}
              height={300}
              className="w-full aspect-square object-cover"
              onError={() => setImageError(true)}
            />
          )}
          {isSold && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Badge className="text-lg px-3 py-1 bg-red-500 text-white">SOLD</Badge>
            </div>
          )}
          <Badge className={`absolute top-2 right-2 ${rarityColor}`}>{card.rarity.replace("-", " ")}</Badge>
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
