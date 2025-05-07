import type { ListingType } from "@/types/listing"
import type { UserType } from "@/types/user"
import type { NotificationType } from "@/types/notification";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8080';

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
  listingTitle?: string
  username?: string
  minPrice?: number
  maxPrice?: number
  listingStatuses?: string[]
  rarities?: string[]
  regions?: string[]
  conditions?: string[]
  cardTypes?: string[]
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
      cardType: listing.cardType,
      // sellerId: listing.userId,
      sellerName: listing.username,
      sellerRegion: listing.region,
      listingStatus: listing.listingStatus,
      inCart: listing.inCart,
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
  // imageFiles.forEach((file) => formData.append("images", file))
  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file) => formData.append("images", file));
  } else {
    // Ensure "images" field is present and represents an empty set of files.
    formData.append("images", new Blob([]), "");
  }

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

// {
//   "listingTitle": "Test_User1_test",
//   "cardCondition": "Damage",
//   "cardType": "Pokemon Card",
//   "rarity": "Hyper Rare",
//   "price": 123.00,
//   "images": [
//       "https://nus-iss-s3.s3.ap-southeast-1.amazonaws.com/cdf5ab10-4ad0-4ba6-a8df-3379d644c35b_c54be811-ee5e-4a0a-badd-f3ae5b9546dd_TrainerCardPokedex.png",
//       "https://nus-iss-s3.s3.ap-southeast-1.amazonaws.com/a3e88db4-9528-4b84-afc8-ef0e99b81f4a_534143_370x480.jpg.webp"
//   ],
//   "description": "test"
// }

export async function updateListing(
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
  imageFiles?: File[]
): Promise<void> {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const formData = new FormData()

    formData.append("data", JSON.stringify(listing))
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => formData.append("images", file));
    } else {
      // Ensure "images" field is present and represents an empty set of files.
      formData.append("images", new Blob([]), "");
    }

    // First, update the listing data
    const response = await fetch(`${BASE_URL}/listing/update-listing/${listingId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        // "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    console.log(formData)

    if (!response.ok) {
      throw new Error(`Failed to update listing: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error updating listing:", error);
    throw error;
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

  // console.log(listingId)
  if (!response.ok) {
    throw new Error("Failed to mark listing as sold")
  }
}

export const callAddToWishlist = async (listingId: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/cart/add-to-cart/${listingId}`, {
    method: "POST",
    headers: authHeaders(),
  })

  if (!response.ok) {
    throw new Error("Failed to add to wishlist")
  }
}

export const callRemoveFromWishlist = async (listingId: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/cart/delete-from-cart/${listingId}`, {
    method: "DELETE",
    headers: authHeaders(),
  })

  if (!response.ok) {
    throw new Error("Failed to remove from wishlist")
  }
  // console.log(response)
}

export const getWishlist = async (): Promise<ListingType[]> => {
  const response = await fetch(`${BASE_URL}/cart/get-cart-items`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch wishlist items")
  }
  const data = await response.json()
  const allListings = data.flatMap((seller: { items: any[] }) =>
    seller.items.map(item => ({
      id: item.id,
      title: item.listingTitle,
      cardCondition: item.cardCondition,
      rarity: item.rarity,
      price: item.price,
      imageUrl: item.mainImage
    }))
  );
  // console.log(allListings)
  return allListings;
}

export const getNotifications = async(): Promise<NotificationType[]> => {
  const response = await fetch(`${BASE_URL}/notification/get-all-notifications`, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch notifications")
  }
  const data = await response.json()
  return data;
}

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/notification/mark-as-read/${notificationId}`, {
    method: "PUT",
    headers: authHeaders(),
  })

  if (!response.ok) {
    throw new Error("Failed to mark notification as read")
  }
  // console.log(response)
}