import ExploreClient from "./explore-client"
import { getListings } from "@/lib/api"

export default function ExplorePage() {
  // Get listings data (this is a Server Component, so we can fetch data directly)
  const listings = getListings()

  return <ExploreClient initialListings={listings} />
}
