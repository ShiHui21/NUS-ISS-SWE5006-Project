export interface ListingType {
  id: string
  title: string
  description: string
  price: number
  imageUrl: string
  additionalImages?: string[]
  rarity: string
  cardCondition: string
  cardType: string
  sellerId: string
  sellerName: string
  sellerRegion: string
  listingStatus: string
  inCart: boolean
}
