import SellerProfileClient from "./seller-profile-client"
import { getUserProfile, getUserListings } from "@/lib/api"

interface SellerProfilePageProps {
  params: {
    id: string
  }
}

export default function SellerProfilePage({ params }: SellerProfilePageProps) {
  // Get seller profile and listings
  const profile = getUserProfile(params.id)
  const listings = getUserListings(params.id)

  // Only show active listings for other sellers
  const activeListings = listings.filter((listing) => !listing.sold)

  return <SellerProfileClient profile={profile} listings={activeListings} />
}
