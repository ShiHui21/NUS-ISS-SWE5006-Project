import ProfileClient from "./profile-client"
import { getUserProfile, getUserListings } from "@/lib/api"

export default function ProfilePage() {
  // Get mock profile and listings data (this is a Server Component)
  const profile = getUserProfile("user-123")
  const listings = getUserListings("user-123")

  return <ProfileClient profile={profile} initialListings={listings} />
}
