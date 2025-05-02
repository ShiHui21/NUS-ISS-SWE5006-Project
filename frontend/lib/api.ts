import type { ListingType } from "@/types/listing"
import type { UserType } from "@/types/user"
import type { NotificationType } from "@/types/notification"

// Mock data for development
const mockUsers: UserType[] = [
  {
    id: "user-123",
    name: "Ash Ketchum",
    username: "pokemon_master",
    email: "ash@pokemon.com",
    mobile: "+1 234 567 8900",
    region: "north",
  },
  {
    id: "user-456",
    name: "Misty Waterflower",
    username: "water_gym_leader",
    email: "misty@pokemon.com",
    mobile: "+1 234 567 8901",
    region: "east",
  },
  {
    id: "user-789",
    name: "Brock Harrison",
    username: "rock_gym_leader",
    email: "brock@pokemon.com",
    mobile: "+1 234 567 8902",
    region: "west",
  },
]

const mockListings: ListingType[] = [
  {
    id: "listing-1",
    title: "Charizard Holo 1st Edition",
    description:
      "Rare first edition Charizard in near mint condition. One of the most sought-after cards in the Pokémon TCG.",
    price: 89.99,
    imageUrl: "/placeholder.svg?height=300&width=200",
    additionalImages: [
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
    ],
    rarity: "ultra-rare",
    condition: "near-mint",
    sellerId: "user-456",
    sellerName: "Misty Waterflower",
    sellerRegion: "east",
    sold: false,
  },
  {
    id: "listing-2",
    title: "Pikachu Illustrator Promo",
    description: "Extremely rare promotional card featuring artwork by Pikachu's creator.",
    price: 95.99,
    imageUrl: "/placeholder.svg?height=300&width=200",
    additionalImages: ["/placeholder.svg?height=100&width=100", "/placeholder.svg?height=100&width=100"],
    rarity: "secret-rare",
    condition: "mint",
    sellerId: "user-789",
    sellerName: "Brock Harrison",
    sellerRegion: "west",
    sold: false,
  },
  {
    id: "listing-3",
    title: "Blastoise Base Set",
    description: "Classic Blastoise card from the original Base Set. Great addition to any collection.",
    price: 45.5,
    imageUrl: "/placeholder.svg?height=300&width=200",
    additionalImages: [],
    rarity: "rare",
    condition: "excellent",
    sellerId: "user-123",
    sellerName: "Ash Ketchum",
    sellerRegion: "north",
    sold: false,
  },
  {
    id: "listing-4",
    title: "Venusaur Jungle Set",
    description: "Venusaur from the Jungle expansion. Shows some light play wear but overall in good condition.",
    price: 32.99,
    imageUrl: "/placeholder.svg?height=300&width=200",
    additionalImages: [],
    rarity: "rare",
    condition: "good",
    sellerId: "user-123",
    sellerName: "Ash Ketchum",
    sellerRegion: "north",
    sold: true,
  },
  {
    id: "listing-5",
    title: "Mewtwo GX Rainbow Rare",
    description: "Modern Mewtwo GX Rainbow Rare card in perfect condition. Straight from pack to sleeve.",
    price: 28.5,
    imageUrl: "/placeholder.svg?height=300&width=200",
    additionalImages: [],
    rarity: "ultra-rare",
    condition: "mint",
    sellerId: "user-456",
    sellerName: "Misty Waterflower",
    sellerRegion: "east",
    sold: false,
  },
  {
    id: "listing-6",
    title: "Eevee Common Card",
    description: "Common Eevee card, perfect for beginners or completing your collection.",
    price: 3.99,
    imageUrl: "/placeholder.svg?height=300&width=200",
    additionalImages: [],
    rarity: "common",
    condition: "played",
    sellerId: "user-789",
    sellerName: "Brock Harrison",
    sellerRegion: "west",
    sold: false,
  },
]

const mockWishlist = ["listing-1", "listing-5"]

const mockNotifications: NotificationType[] = [
  {
    id: "notif-1",
    title: "Card Sold",
    message: "Charizard Holo 1st Edition has been sold and is no longer available.",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "notif-2",
    title: "Card Removed",
    message: "Pikachu Illustrator Promo has been removed by the seller.",
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
]

// API functions - modified to be synchronous for server components
export function getListings(): ListingType[] {
  return mockListings
}

export function getUserProfile(userId: string): UserType {
  const user = mockUsers.find((u) => u.id === userId)

  if (!user) {
    throw new Error("User not found")
  }

  return user
}

export function getUserListings(userId: string): ListingType[] {
  return mockListings.filter((listing) => listing.sellerId === userId)
}

export function getUserWishlist(userId: string): ListingType[] {
  return mockListings.filter((listing) => mockWishlist.includes(listing.id))
}

// Client-side API functions - these are used in client components
export async function getNotificationsClient(): Promise<NotificationType[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockNotifications
}

export async function markNotificationAsReadClient(notificationId: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  // For now, we'll just simulate marking a notification as read
  const notification = mockNotifications.find((n) => n.id === notificationId)

  if (notification) {
    notification.read = true
  }
}

// For server components
export function getNotifications(): NotificationType[] {
  return mockNotifications
}

export function markNotificationAsRead(notificationId: string): void {
  const notification = mockNotifications.find((n) => n.id === notificationId)

  if (notification) {
    notification.read = true
  }
}
