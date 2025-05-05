import WishlistClient from "./wishlist-client"
import { getUserWishlist } from "@/lib/api"

export default function WishlistPage() {
  // Get wishlist data (this is a Server Component)
  const wishlist = getUserWishlist("user-123")

  return <WishlistClient initialWishlist={wishlist} />
}
