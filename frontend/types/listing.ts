export interface ListingType {
  id: string
  title: string
  description: string
  price: number
  imageUrl: string
  additionalImages?: string[]
  rarity: string
  condition: string
  sellerId: string
  sellerName: string
  sellerRegion: string
  sold: boolean
}
