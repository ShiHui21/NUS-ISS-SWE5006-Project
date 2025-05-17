"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PokemonCard } from "@/components/pokemon-card"
import { PokemonCardDetail } from "@/components/pokemon-card-detail"
import { Navbar } from "@/components/navbar"
import { ListingFormModal } from "@/components/listing-form-modal"
import type { UserType } from "@/types/user"
import type { ListingType } from "@/types/listing"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Trash2, CheckCircle, Loader2 } from "lucide-react"
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
import {
  getUserDetails,
  getFilteredListings,
  createListing,
  updateListing,
  deleteListing,
  markAsSoldListing,
} from "@/lib/api-service"

export default function ProfilePage() {
  // Profile and authentication state
  const [profile, setProfile] = useState<UserType | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Listings state
  const [activeListings, setActiveListings] = useState<ListingType[]>([])
  const [filteredActiveListings, setFilteredActiveListings] = useState<ListingType[]>([])
  const [soldListings, setSoldListings] = useState<ListingType[]>([])
  const [selectedCard, setSelectedCard] = useState<ListingType | null>(null)

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [listingToEdit, setListingToEdit] = useState<ListingType | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [listingToDelete, setListingToDelete] = useState<string | null>(null)
  const [markAsSoldConfirmOpen, setMarkAsSoldConfirmOpen] = useState(false)
  const [listingToMarkAsSold, setListingToMarkAsSold] = useState<string | null>(null)

  // Filter and loading state
  const [filterLoading, setFilterLoading] = useState(false)
  const [currentFilters, setCurrentFilters] = useState<FilterState>({
    searchQuery: "",
    minPrice: "",
    maxPrice: "",
    regions: [],
    rarities: [],
    cardConditions: [],
    cardTypes: [],
    sortBy: "default",
  })
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 1,
    currentPage: 0,
    pageSize: 100,
  })

  // Initial data fetch
  useEffect(() => {
    const fetchProfileData = async () => {
      setInitialLoading(true)
      try {
        // Check if user is authenticated
        const token = localStorage.getItem("auth_token")
        if (!token) {
          router.push("/login")
          return
        }

        // Fetch user details
        const userDetails = await getUserDetails()
        setProfile(userDetails)

        // Fetch user's listings - initial fetch without filters
        await initialFetch(userDetails)
      } catch (error) {
        console.error("Failed to fetch profile data:", error)
        setError("Failed to load profile data. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setInitialLoading(false)
      }
    }

    fetchProfileData()
  }, [router, toast])

  const initialFetch = async (userProfile = profile) => {
    if (!userProfile) return

    setFilterLoading(true)
    try {
      // Fetch active listings without any filters
      const activeResult = await getFilteredListings({
        listingStatuses: ["Active"],
        username: userProfile.username,
        excludeCurrentUser: false,
      })

      // Fetch sold listings without any filters
      const soldResult = await getFilteredListings({
        listingStatuses: ["Sold"],
        username: userProfile.username,
        excludeCurrentUser: false,
      })

      setActiveListings(activeResult.listings)
      setFilteredActiveListings(activeResult.listings)
      setSoldListings(soldResult.listings)
      setPagination({
        totalElements: activeResult.totalElements,
        totalPages: activeResult.totalPages,
        currentPage: activeResult.currentPage,
        pageSize: activeResult.pageSize,
      })
      console.log(activeResult.listings)
    } catch (error) {
      console.error("Failed to fetch initial listings:", error)
      toast({
        title: "Error",
        description: "Failed to load listings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setFilterLoading(false)
    }
  }
  // Fetch user listings with filters
  const fetchUserListings = async (userProfile = profile, filters = currentFilters) => {
    if (!userProfile) return

    setFilterLoading(true)
    try {
      // Fetch active listings with filters
      const activeResult = await getFilteredListings({
        listingTitle: filters.searchQuery || undefined,
        minPrice: filters.minPrice ? Number.parseFloat(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number.parseFloat(filters.maxPrice) : undefined,
        listingStatuses: ["Active"],
        rarities: filters.rarities.length > 0 ? filters.rarities : undefined,
        conditions: filters.cardConditions.length > 0 ? filters.cardConditions : undefined,
        cardTypes: filters.cardTypes.length > 0 ? filters.cardTypes : undefined,
        // Only fetch the current user's listings
        username: userProfile.username,
        excludeCurrentUser: false,
        // Handle sorting
        ...(filters.sortBy && filters.sortBy !== "default"
          ? {
              sortBy: filters.sortBy.split("-")[0],
              sortOrder: filters.sortBy.split("-")[1],
            }
          : {}),
      })

      // Only update the filtered active listings, not the sold listings
      setFilteredActiveListings(activeResult.listings)
      setPagination({
        totalElements: activeResult.totalElements,
        totalPages: activeResult.totalPages,
        currentPage: activeResult.currentPage,
        pageSize: activeResult.pageSize,
      })
    } catch (error) {
      console.error("Failed to fetch filtered listings:", error)
      toast({
        title: "Error",
        description: "Failed to load listings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setFilterLoading(false)
    }
  }

  const handleCreateListing = async (
    newListingData: {
      title: string
      description: string
      price: number
      cardType: string
      rarity: string
      cardCondition: string
    },
    imageFiles: File[],
  ) => {
    console.log("handleCreateListing: Execution started with new data structure.")
    try {
      // Construct backendListing payload directly
      // No longer using convertToBackendListing for create, to directly use File objects
      const backendListingPayload = {
        listingTitle: newListingData.title,
        description: newListingData.description,
        price: newListingData.price,
        cardType: newListingData.cardType,
        rarity: newListingData.rarity,
        cardCondition: newListingData.cardCondition, // Ensure modal sends this in the correct string format
        // images: [], // API service expects this to be present and empty for create, files are separate
      }
      console.log("handleCreateListing: Backend payload constructed:", backendListingPayload)
      console.log("handleCreateListing: Image files received:", imageFiles)

      console.log("handleCreateListing: Calling createListing API...")
      await createListing({ ...backendListingPayload, images: [] }, imageFiles)
      console.log("handleCreateListing: createListing API call finished.")

      console.log("handleCreateListing: Calling initialFetch...")
      await initialFetch()
      console.log("handleCreateListing: initialFetch call finished.")

      setIsCreateModalOpen(false)
      console.log("handleCreateListing: Create modal closed by parent.")

      toast({
        title: "Listing Created",
        description: "Your card has been listed on the marketplace.",
      })
      console.log("handleCreateListing: Success toast displayed.")
    } catch (error) {
      console.error("handleCreateListing: Error caught:", error)
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive",
      })
      console.log("handleCreateListing: Error toast displayed.")
    }
  }

  const handleEditListing = async (
    updatedListingData: {
      id?: string;
      title: string;
      description: string;
      price: number;
      cardType: string;
      rarity: string;
      cardCondition: string;
    },
    imageFiles: File[],
  ) => {
    try {
      const listingIdToUpdate = updatedListingData.id || listingToEdit?.id;
      if (!listingIdToUpdate) {
        throw new Error("Listing ID is required for updates");
      }

      // Construct the payload for the updateListing API service
      const backendPayload = {
        listingTitle: updatedListingData.title,
        description: updatedListingData.description,
        price: updatedListingData.price,
        cardType: updatedListingData.cardType,
        rarity: updatedListingData.rarity,
        cardCondition: updatedListingData.cardCondition,
        // Provide current images; backend handles new imageFiles separately
        images: [listingToEdit!.imageUrl, ...(listingToEdit!.additionalImages || [])].filter(Boolean) as string[],
      };
      console.log("handleEditListing: Backend payload constructed:", backendPayload);
      console.log("handleEditListing: Image files for update:", imageFiles);

      // Update listing text data and potentially new images
      await updateListing(listingIdToUpdate, backendPayload, imageFiles);
      console.log("handleEditListing: updateListing API call finished.");

      // Refresh all listings after updating
      await initialFetch()
      setIsEditModalOpen(false)
      setListingToEdit(null)

      toast({
        title: "Listing Updated",
        description: "Your card listing has been updated.",
      })
    } catch (error) {
      console.error("Failed to update listing:", error)
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
      // Delete listing
      await deleteListing(listingToDelete)

      // Refresh all listings after deleting
      await initialFetch()

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

  const handleMarkAsSoldClick = (listingId: string) => {
    setListingToMarkAsSold(listingId)
    setMarkAsSoldConfirmOpen(true)
  }

  const confirmMarkAsSold = async () => {
    if (!listingToMarkAsSold) return

    try {
      // Call the API to mark the listing as sold
      await markAsSoldListing(listingToMarkAsSold)

      // Refresh all listings after marking as sold
      await initialFetch()

      toast({
        title: "Marked as Sold",
        description: "Your card has been marked as sold.",
      })
    } catch (error) {
      console.error("Failed to mark listing as sold:", error)
      toast({
        title: "Error",
        description: "Failed to mark listing as sold. Please try again.",
        variant: "destructive",
      })
    } finally {
      setMarkAsSoldConfirmOpen(false)
      setListingToMarkAsSold(null)
    }
  }

  // Handle filter changes - don't trigger API call immediately
  const handleFilterChange = (newFilters: FilterState) => {
    setCurrentFilters(newFilters)
  }

  // Handle search button click - trigger API call
  const handleSearch = () => {
    fetchUserListings(profile, currentFilters)
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
    setCurrentFilters(resetFilters)

    // Reset filtered listings to show all active listings
    setFilteredActiveListings(activeListings)
    setPagination({
      totalElements: activeListings.length,
      totalPages: Math.ceil(activeListings.length / pagination.pageSize),
      currentPage: 0,
      pageSize: pagination.pageSize,
    })
  }

  // Loading state
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-blue-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-blue-600">Loading your profile...</h2>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-blue-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Session expired state
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-blue-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-yellow-600 mb-4">Session Expired</h2>
          <p className="text-gray-600 mb-4">Please log in again to view your profile.</p>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // Main profile UI
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
                    <SearchFilterComponent
                      onFilter={handleFilterChange}
                      onSearch={handleSearch}
                      onReset={handleReset}
                      initialFilters={currentFilters}
                      showRegionFilter={false}
                      showCardTypeFilter={true}
                    />

                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-blue-600">
                        {pagination.totalElements} {pagination.totalElements === 1 ? "Card" : "Cards"} Available
                      </h2>
                    </div>

                    {filterLoading ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500">Loading your listings...</p>
                      </div>
                    ) : filteredActiveListings.length > 0 ? (
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
                                  handleMarkAsSoldClick(card.id)
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
                            <PokemonCard card={card} onClick={() => setSelectedCard(card)} />
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

      {/* Listing Modal Form */}
      {isCreateModalOpen && (
        <ListingFormModal mode="create" onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreateListing} />
      )}

      {/* Edit Listing Modal */}
      {isEditModalOpen && listingToEdit && (
        <ListingFormModal
          mode="edit"
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

      {/* Mark as Sold Confirmation Dialog */}
      <AlertDialog open={markAsSoldConfirmOpen} onOpenChange={setMarkAsSoldConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark this listing as sold?</AlertDialogTitle>
            <AlertDialogDescription>
              This will move the card to your sold listings and make it unavailable for purchase.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmMarkAsSold} className="bg-green-600 hover:bg-green-700 text-white">
              Mark as Sold
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
