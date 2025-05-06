import type { ListingType } from "@/types/listing"
import type { UserType } from "@/types/user"

const BASE_URL = "http://localhost:8080"
// const BASE_URL = "http://13.213.45.86:8080"

// Auth token management
const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

const setToken = (token: string): void => {
  localStorage.setItem("auth_token", token)
}

const clearToken = (): void => {
  localStorage.removeItem("auth_token")
}

// Headers with authentication
const authHeaders = (): HeadersInit => {
  const token = getToken()
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

const authHeadersCreate = (): HeadersInit => {
  const token = getToken()
  return {
    // Remove Content-Type header - browser will set it automatically with boundary
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// Auth API
export const loginUser = async (identifier: string, password: string): Promise<string> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData.error || `Login failed with status: ${response.status}`
      throw new Error(errorMessage)
    }

    const data = await response.json()
    setToken(data.token)
    return data.token
  } catch (error: any) {
    if (error.name === "TypeError") {
      // e.g., network error
      throw new Error("Cannot connect to the server. Please try again later.")
    }
    throw error
  }
}

export const registerUser = async (userData: {
  username: string
  password: string
  name: string
  email: string
  mobileNumber: string
  region: string
}): Promise<void> => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
  console.log(userData)
  if (!response.ok) {
    const errorData = await response.json()
    const error = new Error("Registration failed")
    ;(error as any).validationErrors = errorData
    throw error
  }
}

export const logoutUser = (): void => {
  clearToken()
}

// User API
export const getUserDetails = async (): Promise<UserType> => {
  const response = await fetch(`${BASE_URL}/user/get-details`, {
    headers: authHeaders(),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch user details")
  }

  const data = await response.json()

  // Transform backend response to match our UserType
  return {
    id: data.id,
    name: data.name,
    username: data.username,
    email: data.email,
    mobile: data.mobileNumber,
    region: data.region,
  }
}

export const getFilteredListings = async (filters: {
  excludeCurrentUser: boolean
  title?: string
  username?: string
  minPrice?: number
  maxPrice?: number
  listingStatuses?: string[]
  rarities?: string[]
  regions?: string[]
  conditions?: string[]
  cardType?: string[]
  sortBy?: string
  sortOrder?: string
  page?: number
  size?: number
}): Promise<{
  listings: ListingType[]
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
}> => {
  try {
    // Set default values
    const requestBody = {
      // listingStatus: ["active"],
      page: filters.page || 0,
      size: filters.size || 100,
      ...filters,
    }
    console.log("request", requestBody)
    const response = await fetch(`${BASE_URL}/listing/get-all-listing`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.status}`)
    }

    const data = await response.json()

    // Transform backend response to match our ListingType
    const transformedListings = data.listings.map((listing: any) => ({
      id: listing.id,
      title: listing.listingTitle,
      description: listing.description || "",
      price: listing.price,
      imageUrl: listing.mainImage,
      additionalImages: listing.images ? listing.images.slice(1) : [],
      rarity: listing.rarity,
      condition: listing.cardCondition,
      sellerId: listing.userId,
      sellerName: listing.username,
      sellerRegion: listing.regione,
      listingStatus: listing.listingStatus,
    }))

    return {
      listings: transformedListings,
      totalElements: data.totalElements,
      totalPages: data.totalPages,
      currentPage: data.currentPage,
      pageSize: data.pageSize,
    }
  } catch (error) {
    console.error("Failed to fetch filtered listings:", error)
    throw error
  }
}

// export const getListingDetails = async (listingId: string): Promise<ListingType> => {
//   const response = await fetch(`${BASE_URL}/listing/get-listing-details/${listingId}`, {
//     headers: authHeaders(),
//   })

//   if (!response.ok) {
//     throw new Error("Failed to fetch listing details")
//   }

//   const listing = await response.json()

//   // Transform backend response to match our ListingType
//   return {
//     id: listing.id,
//     title: listing.listingTitle,
//     description: listing.description || "",
//     price: listing.price,
//     imageUrl: listing.images && listing.images.length > 0 ? listing.images[0] : "",
//     additionalImages: listing.images ? listing.images.slice(1) : [],
//     rarity: listing.rarity?.toLowerCase() || "common",
//     condition: listing.cardCondition?.toLowerCase().replace(" ", "-") || "good",
//     sellerId: listing.userId,
//     sellerName: listing.username,
//     sellerRegion: "unknown", // Backend doesn't provide this directly
//     sold: listing.status === "SOLD",
//   }
// }

// export const createListing = async (listing: {
//   listingTitle: string
//   cardCondition: string
//   cardType: string
//   rarity: string
//   images: string[]
//   price: number
//   description: string
// }): Promise<string> => {
//   const response = await fetch(`${BASE_URL}/listing/create-listing`, {
//     method: "POST",
//     headers: authHeaders(),
//     body: JSON.stringify(listing),
//   })

//   if (!response.ok) {
//     throw new Error("Failed to create listing")
//   }

//   const data = await response.json()
//   return data.id
// }

export const createListing = async (
  listing: {
    listingTitle: string
    description: string
    price: number
    cardType: string
    rarity: string
    cardCondition: string
    // imageUrl: string
    // additionalImages: string[]
    images: []
  },
  imageFiles: File[]
): Promise<void> => {
  const formData = new FormData()

  formData.append("data", JSON.stringify(listing))
  imageFiles.forEach((file) => formData.append("images", file))

  const response = await fetch(`${BASE_URL}/listing/create-listing`, {
    method: "POST",
    // headers: authHeadersForCreateListing(),
    headers: authHeadersCreate(),
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || "Failed to create listing")
  }
}

export const updateListing = async (
  listingId: string,
  listing: {
    listingTitle: string
    cardCondition: string
    cardType: string
    rarity: string
    images: string[]
    price: number
    description: string
  },
): Promise<void> => {
  const response = await fetch(`${BASE_URL}/listing/update-listing/${listingId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(listing),
  })

  if (!response.ok) {
    throw new Error("Failed to update listing")
  }
}

export const deleteListing = async (listingId: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/listing/delete-listing/${listingId}`, {
    method: "DELETE",
    headers: authHeaders(),
  })

  if (!response.ok) {
    throw new Error("Failed to delete listing")
  }
}

export const markAsSoldListing = async (listingId: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/listing/update-listing-as-sold/${listingId}`, {
    method: "PUT",
    headers: authHeaders(),
  })

  if (!response.ok) {
    throw new Error("Failed to mark listing as sold")
  }
}

// Helper functions to convert between frontend and backend data formats
export const convertToBackendListing = (listing: Partial<ListingType>): any => {
  // Handle potentially undefined rarity
  const rarityValue = listing.rarity
    ? listing.rarity.charAt(0).toUpperCase() + listing.rarity.slice(1)
    : "Common" // Default value if rarity is undefined

  return {
    listingTitle: listing.title,
    cardCondition: listing.condition?.replace("-", " ") ?? "Not Specified", // Provide default for condition too
    cardType: "Pokemon Card", // Default value
    rarity: rarityValue,
    images: [listing.imageUrl, ...(listing.additionalImages || [])].filter(Boolean),
    price: listing.price,
    description: listing.description,
  }
}

// Mock API functions for features not yet implemented in the backend
export const getUserWishlist = (userId: string): ListingType[] => {
  // This is a mock function until the backend implements wishlist functionality
  return []
}

export const getNotificationsClient = async (): Promise<any[]> => {
  // This is a mock function until the backend implements notifications
  return []
}

export const markNotificationAsReadClient = async (notificationId: string): Promise<void> => {
  // This is a mock function until the backend implements notifications
}
