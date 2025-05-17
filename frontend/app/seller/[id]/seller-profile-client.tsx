"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PokemonCard } from "@/components/pokemon-card"
import { PokemonCardDetail } from "@/components/pokemon-card-detail"
import { Navbar } from "@/components/navbar"
import type { UserType } from "@/types/user"
import type { ListingType } from "@/types/listing"
import { SearchFilterComponent } from "@/components/search-filter-component"

interface SellerProfileClientProps {
  profile: UserType
  listings: ListingType[]
}

interface FilterState {
  searchQuery: string
  minPrice: string
  maxPrice: string
  rarities: string[]
  conditions: string[]
  regions: string[]
  sortBy: string | null
}

export default function SellerProfileClient({ profile, listings }: SellerProfileClientProps) {
  const [filteredListings, setFilteredListings] = useState(listings)
  const [searchQuery, setSearchQuery] = useState("")
  const [minPrice, setMinPrice] = useState("2")
  const [maxPrice, setMaxPrice] = useState("100")
  const [rarity, setRarity] = useState<string | null>(null)
  const [condition, setCondition] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<ListingType | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Apply filters and sorting
  const applyFilters = (newFilters: FilterState) => {
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

  const resetFilters = () => {
    setSearchQuery("")
    setMinPrice("2")
    setMaxPrice("100")
    setRarity(null)
    setCondition(null)
    setSortBy(null)
    setFilteredListings(listings)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-blue-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center text-blue-600">
            <span className="text-yellow-500">{profile.name}&apos;s</span> Profile
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Seller Info */}
          <Card className="lg:col-span-1 shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-yellow-400 flex items-center justify-center mb-4">
                  <span className="text-4xl font-bold text-white">{profile.name.charAt(0)}</span>
                </div>

                <h2 className="text-xl font-bold text-blue-600">{profile.name}</h2>
                <p className="text-gray-600">@{profile.username}</p>

                <div className="w-full mt-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{profile.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mobile:</span>
                    <span className="font-medium">{profile.mobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Region:</span>
                    <span className="font-medium capitalize">{profile.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Listings:</span>
                    <span className="font-medium">{listings.length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Listings */}
          <div className="lg:col-span-3">
            <SearchFilterComponent onFilter={applyFilters} showRegionFilter={false} />

            <Card className="shadow-md">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-blue-600">
                    {filteredListings.length} {filteredListings.length === 1 ? "Card" : "Cards"} Available
                  </h2>
                </div>

                {filteredListings.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredListings.map((card) => (
                      <PokemonCard key={card.id} card={card} onClick={() => setSelectedCard(card)} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No cards match your filters.</p>
                    <Button onClick={resetFilters} variant="link" className="mt-2 text-blue-500">
                      Clear filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Card Detail Modal */}
      {selectedCard && <PokemonCardDetail card={selectedCard} onClose={() => setSelectedCard(null)} />}
    </div>
  )
}
