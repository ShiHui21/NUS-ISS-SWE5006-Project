"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { PokemonCard } from "@/components/pokemon-card"
import { PokemonCardDetail } from "@/components/pokemon-card-detail"
import { Navbar } from "@/components/navbar"
import type { ListingType } from "@/types/listing"
import { SearchFilterComponent, type FilterState } from "@/components/search-filter-component"
import { getFilteredListings } from "@/lib/api-service"
import { useToast } from "@/components/ui/use-toast"

export default function ExplorePage() {
  const [listings, setListings] = useState<ListingType[]>([]) // Initialize as empty array instead of undefined
  const [selectedCard, setSelectedCard] = useState<ListingType | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    minPrice: "",
    maxPrice: "",
    regions: [],
    rarities: [],
    cardConditions: [],
    cardTypes: [],
    sortBy: "default",
  })
  const [loading, setLoading] = useState(true) // Start with loading true for initial fetch
  const [pagination, setPagination] = useState({
    totalElements: 0, // Initialize with 0 instead of commenting out
    totalPages: 1,
    currentPage: 0,
    pageSize: 100,
  })
  const { toast } = useToast()

  // Fetch listings with filters
  const fetchFilteredListings = async (currentFilters = filters) => {
    setLoading(true)
    try {
      // Convert frontend filter values to backend expected values
      const backendFilters: any = {
        excludeCurrentUser: true,
        listingTitle: currentFilters.searchQuery || undefined,
        minPrice: currentFilters.minPrice ? Number.parseFloat(currentFilters.minPrice) : undefined,
        maxPrice: currentFilters.maxPrice ? Number.parseFloat(currentFilters.maxPrice) : undefined,
        listingStatuses: ["Active"],
      }

      if (currentFilters.rarities.length > 0) {
        backendFilters.rarities = currentFilters.rarities
      }

      if (currentFilters.cardConditions.length > 0) {
        backendFilters.conditions = currentFilters.cardConditions
      }

      if (currentFilters.cardTypes.length > 0) { //Not implemented on backend yet
        backendFilters.cardTypes = currentFilters.cardTypes
      }

      if (currentFilters.regions.length > 0) {
        backendFilters.regions = currentFilters.regions
      }

      // Map sort values
      if (currentFilters.sortBy && currentFilters.sortBy !== "default") {
        const [sortField, sortDirection] = currentFilters.sortBy.split("-")
        backendFilters.sortBy = sortField
        backendFilters.sortOrder = sortDirection
      }

      const result = await getFilteredListings(backendFilters)
      setListings(result.listings)
      console.log(result.listings)
      setPagination({
        totalElements: result.totalElements,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        pageSize: result.pageSize,
      })
    } catch (error) {
      console.error("Failed to fetch listings:", error)
      // toast({
      //   title: "Error",
      //   description: "Failed to load listings. Please try again.",
      //   variant: "destructive",
      // })
      setListings([]) // Set to empty array on error
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchFilteredListings()
  }, []) // Empty dependency array to run only once on mount

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    // Don't fetch automatically - wait for search button click
  }

  // Handle search button click
  const handleSearch = () => {
    fetchFilteredListings(filters)
  }

  // Handle reset button click
  const handleReset = () => {
    const resetFilters = {
      searchQuery: "",
      minPrice: "",
      maxPrice: "",
      regions: [],
      rarities: [],
      cardConditions: [],
      cardTypes: [],
      sortBy: "default",
    }
    setFilters(resetFilters)
    fetchFilteredListings(resetFilters)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-blue-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Pokémon Card <span className="text-yellow-500">Explorer</span>
        </h1>

        <SearchFilterComponent
          onFilter={handleFilterChange}
          initialFilters={filters}
          onSearch={handleSearch}
          onReset={handleReset}
          showCardTypeFilter={true}
        />

        {/* Listings Section */}
        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-blue-600">
                {pagination.totalElements} {pagination.totalElements === 1 ? "Card" : "Cards"} Available
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading cards...</p>
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {listings.map((card) => (
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
      {selectedCard && <PokemonCardDetail card={selectedCard} onClose={() => setSelectedCard(null)} showRemoveFromWishlist={selectedCard.inCart}/>}
    </div>
  )
}
