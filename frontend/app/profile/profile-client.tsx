"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PokemonCard } from "@/components/pokemon-card"
import { PokemonCardDetail } from "@/components/pokemon-card-detail"
import { Navbar } from "@/components/navbar"
import { CreateListingModal } from "@/components/create-listing-modal"
import { EditListingModal } from "@/components/edit-listing-modal"
import type { UserType } from "@/types/user"
import type { ListingType } from "@/types/listing"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Trash2, CheckCircle } from "lucide-react"
import { SearchFilterComponent, type FilterState } from "@/components/search-filter-component"
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

interface ProfileClientProps {
  profile: UserType
  initialListings: ListingType[]
}

export default function ProfileClient({ profile, initialListings }: ProfileClientProps) {
  const [activeListings, setActiveListings] = useState(initialListings.filter((listing) => !listing.sold))
  const [filteredActiveListings, setFilteredActiveListings] = useState(activeListings)
  const [soldListings, setSoldListings] = useState(initialListings.filter((listing) => listing.sold))
  const [selectedCard, setSelectedCard] = useState<ListingType | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [listingToEdit, setListingToEdit] = useState<ListingType | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [listingToDelete, setListingToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  const handleCreateListing = async (
    newListing: Omit<ListingType, "id" | "sellerId" | "sellerName" | "sellerRegion">,
  ) => {
    try {
      // This would be replaced with actual API call to Spring Boot backend
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newListing,
          sellerId: profile.id,
          sellerName: profile.name,
          sellerRegion: profile.region,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create listing")
      }

      const createdListing = await response.json()

      // For now, we'll simulate a successful creation
      const mockListing: ListingType = {
        id: `listing-${Date.now()}`,
        sellerId: profile.id,
        sellerName: profile.name,
        sellerRegion: profile.region,
        ...newListing,
        sold: false,
      }

      const newActiveListings = [...activeListings, mockListing]
      setActiveListings(newActiveListings)
      applyFilters(newActiveListings)
      setIsCreateModalOpen(false)

      toast({
        title: "Listing Created",
        description: "Your card has been listed on the marketplace.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditListing = async (updatedListing: ListingType) => {
    try {
      // This would be replaced with actual API call to Spring Boot backend
      const response = await fetch(`/api/listings/${updatedListing.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedListing),
      })

      if (!response.ok) {
        throw new Error("Failed to update listing")
      }

      // Update the listings in state
      const newActiveListings = activeListings.map((listing) =>
        listing.id === updatedListing.id ? updatedListing : listing,
      )
      setActiveListings(newActiveListings)
      applyFilters(newActiveListings)

      setIsEditModalOpen(false)
      setListingToEdit(null)

      toast({
        title: "Listing Updated",
        description: "Your card listing has been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update listing. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteListing = async (listingId: string) => {
    setListingToDelete(listingId)
    setDeleteConfirmOpen(true)
  }

  const confirmDeleteListing = async () => {
    if (!listingToDelete) return

    try {
      // This would be replaced with actual API call to Spring Boot backend
      const response = await fetch(`/api/listings/${listingToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete listing")
      }

      // Remove the listing from state
      const newActiveListings = activeListings.filter((listing) => listing.id !== listingToDelete)
      setActiveListings(newActiveListings)
      applyFilters(newActiveListings)

      toast({
        title: "Listing Deleted",
        description: "Your card listing has been removed from the marketplace.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete listing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteConfirmOpen(false)
      setListingToDelete(null)
    }
  }

  const handleMarkAsSold = async (listingId: string) => {
    try {
      // This would be replaced with actual API call to Spring Boot backend
      const response = await fetch(`/api/listings/${listingId}/sold`, {
        method: "PUT",
      })

      if (!response.ok) {
        throw new Error("Failed to mark listing as sold")
      }

      // Find the listing
      const listing = activeListings.find((l) => l.id === listingId)

      if (listing) {
        // Remove from active listings
        const newActiveListings = activeListings.filter((l) => l.id !== listingId)
        setActiveListings(newActiveListings)
        applyFilters(newActiveListings)

        // Add to sold listings
        setSoldListings((prev) => [{ ...listing, sold: true }, ...prev])
      }

      toast({
        title: "Marked as Sold",
        description: "Your card has been marked as sold.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark listing as sold. Please try again.",
        variant: "destructive",
      })
    }
  }

  const applyFilters = (listingsOrFilters: ListingType[] | FilterState, filterState?: FilterState) => {
    // Determine if the first argument is listings or filters
    let listings: ListingType[]
    let filtersToApply: FilterState

    if (Array.isArray(listingsOrFilters)) {
      // First argument is listings array
      listings = listingsOrFilters
      filtersToApply = filterState || {
        searchQuery: "",
        minPrice: "2",
        maxPrice: "100",
        regions: [],
        rarities: [],
        conditions: [],
        sortBy: "default",
      }
    } else {
      // First argument is filters object
      listings = activeListings
      filtersToApply = listingsOrFilters
    }

    let result = [...listings]

    // Apply search filter
    if (filtersToApply.searchQuery) {
      result = result.filter((card) => card.title.toLowerCase().includes(filtersToApply.searchQuery.toLowerCase()))
    }

    // Apply price range filter
    const min = Number.parseFloat(filtersToApply.minPrice) || 2
    const max = Number.parseFloat(filtersToApply.maxPrice) || 100
    result = result.filter((card) => card.price >= min && card.price <= max)

    // Apply rarity filter
    if (filtersToApply.rarities.length > 0) {
      result = result.filter((card) => filtersToApply.rarities.includes(card.rarity))
    }

    // Apply condition filter
    if (filtersToApply.conditions.length > 0) {
      result = result.filter((card) => filtersToApply.conditions.includes(card.condition))
    }

    // Apply sorting
    if (filtersToApply.sortBy && filtersToApply.sortBy !== "default") {
      switch (filtersToApply.sortBy) {
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

    setFilteredActiveListings(result)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-blue-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center text-blue-600">
            My <span className="text-yellow-500">Profile</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Info */}
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
                </div>

                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Create New Listing
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Listings */}
          <div className="lg:col-span-3">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <Tabs defaultValue="active" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger
                      value="active"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Active Listings ({activeListings.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="sold"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Sold Listings ({soldListings.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="active">
                    <SearchFilterComponent onFilter={applyFilters} showRegionFilter={false} />

                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-blue-600">
                        {filteredActiveListings.length} {filteredActiveListings.length === 1 ? "Card" : "Cards"}{" "}
                        Available
                      </h2>
                    </div>

                    {filteredActiveListings.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredActiveListings.map((card) => (
                          <div key={card.id} className="relative group">
                            <PokemonCard card={card} onClick={() => setSelectedCard(card)} />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="rounded-full bg-white/90 hover:bg-white text-blue-600"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setListingToEdit(card)
                                  setIsEditModalOpen(true)
                                }}
                              >
                                <Edit className="h-5 w-5" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="rounded-full bg-white/90 hover:bg-white text-green-600"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMarkAsSold(card.id)
                                }}
                              >
                                <CheckCircle className="h-5 w-5" />
                                <span className="sr-only">Mark as Sold</span>
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="rounded-full bg-white/90 hover:bg-white text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteListing(card.id)
                                }}
                              >
                                <Trash2 className="h-5 w-5" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : activeListings.length > 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No cards match your filters.</p>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">You don't have any active listings.</p>
                        <Button
                          onClick={() => setIsCreateModalOpen(true)}
                          variant="link"
                          className="mt-2 text-blue-500"
                        >
                          Create your first listing
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="sold">
                    {soldListings.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {soldListings.map((card) => (
                          <div key={card.id} className="relative">
                            <PokemonCard card={card} onClick={() => setSelectedCard(card)} isSold />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">You haven't sold any cards yet.</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Card Detail Modal */}
      {selectedCard && <PokemonCardDetail card={selectedCard} onClose={() => setSelectedCard(null)} />}

      {/* Create Listing Modal */}
      {isCreateModalOpen && (
        <CreateListingModal onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreateListing} />
      )}

      {/* Edit Listing Modal */}
      {isEditModalOpen && listingToEdit && (
        <EditListingModal
          listing={listingToEdit}
          onClose={() => {
            setIsEditModalOpen(false)
            setListingToEdit(null)
          }}
          onSubmit={handleEditListing}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this listing?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your card listing from the marketplace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteListing} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
