"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { PokemonCard } from "@/components/pokemon-card"
import { PokemonCardDetail } from "@/components/pokemon-card-detail"
import { Navbar } from "@/components/navbar"
import type { ListingType } from "@/types/listing"
import { SearchFilterComponent, type FilterState } from "@/components/search-filter-component"
import { useToast } from "@/components/ui/use-toast"

interface ExploreClientProps {
  initialListings: ListingType[]
}

export default function ExploreClient({ initialListings }: ExploreClientProps) {
  const [listings, setListings] = useState<ListingType[]>(initialListings)
  const [filteredListings, setFilteredListings] = useState<ListingType[]>(initialListings)
  const [selectedCard, setSelectedCard] = useState<ListingType | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    minPrice: "2",
    maxPrice: "100",
    regions: [],
    rarities: [],
    conditions: [],
    sortBy: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Apply filters and sorting
  const applyFilters = (newFilters: FilterState) => {
    setFilters(newFilters)
    let result = [...listings]

    // Apply search filter
    if (newFilters.searchQuery) {
      result = result.filter((card) => card.title.toLowerCase().includes(newFilters.searchQuery.toLowerCase()))
    }

    // Apply price range filter
    const min = Number.parseFloat(newFilters.minPrice) || 2
    const max = Number.parseFloat(newFilters.maxPrice) || 100
    result = result.filter((card) => card.price >= min && card.price <= max)

    // Apply region filter
    if (newFilters.regions.length > 0) {
      result = result.filter((card) => newFilters.regions.includes(card.sellerRegion))
    }

    // Apply rarity filter
    if (newFilters.rarities.length > 0) {
      result = result.filter((card) => newFilters.rarities.includes(card.rarity))
    }

    // Apply condition filter
    if (newFilters.conditions.length > 0) {
      result = result.filter((card) => newFilters.conditions.includes(card.condition))
    }

    // Apply sorting
    if (newFilters.sortBy && newFilters.sortBy !== "default") {
      switch (newFilters.sortBy) {
        case "price-asc":
          result.sort((a, b) => a.price - b.price)
          break
        case "price-desc":
          result.sort((a, b) => b.price - a.price)
          break
        case "rarity-asc":
          result.sort((a, b) => {
            const rarityOrder = ["common", "uncommon", "rare", "ultra-rare", "secret-rare"]
            return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity)
          })
          break
        case "rarity-desc":
          result.sort((a, b) => {
            const rarityOrder = ["common", "uncommon", "rare", "ultra-rare", "secret-rare"]
            return rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity)
          })
          break
        case "condition-asc":
          result.sort((a, b) => {
            const conditionOrder = ["played", "good", "excellent", "near-mint", "mint"]
            return conditionOrder.indexOf(a.condition) - conditionOrder.indexOf(b.condition)
          })
          break
        case "condition-desc":
          result.sort((a, b) => {
            const conditionOrder = ["played", "good", "excellent", "near-mint", "mint"]
            return conditionOrder.indexOf(b.condition) - conditionOrder.indexOf(a.condition)
          })
          break
      }
    }

    setFilteredListings(result)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-blue-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Pokémon Card <span className="text-yellow-500">Explorer</span>
        </h1>

        <SearchFilterComponent onFilter={applyFilters} />

        {/* Listings Section */}
        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-blue-600">
                {filteredListings.length} {filteredListings.length === 1 ? "Card" : "Cards"} Available
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading cards...</p>
              </div>
            ) : filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredListings.map((card) => (
                  <PokemonCard key={card.id} card={card} onClick={() => setSelectedCard(card)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No cards match your filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Card Detail Modal */}
      {selectedCard && <PokemonCardDetail card={selectedCard} onClose={() => setSelectedCard(null)} />}
    </div>
  )
}
