"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, User, Heart, LogOut, Menu } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import type { NotificationType } from "@/types/notification"
import { getNotifications, markNotificationAsRead } from "@/lib/api-service"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications()
        setNotifications(data)
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      }
    }

    fetchNotifications()

    // Refresh notifications every minute
    const interval = setInterval(fetchNotifications, 60000)

    return () => clearInterval(interval)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleNotificationClick = async (id: string) => {
    try {
      await markNotificationAsRead(id)
      // setNotifications((prev) =>
      //   prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
      // )
      setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const handleLogout = () => {
    router.push("/logout")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-yellow-200 bg-white/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col gap-6 pt-6">
                <Link href="/explore" className="flex items-center gap-2">
                  <span className="text-xl font-bold text-blue-600">
                    Poké<span className="text-yellow-500">Trade</span>
                  </span>
                </Link>
                <nav className="flex flex-col gap-4">
                  <Link
                    href="/explore"
                    className={`text-lg font-medium ${pathname === "/explore" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                  >
                    Explore
                  </Link>
                  <Link
                    href="/profile"
                    className={`text-lg font-medium ${pathname === "/profile" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/wishlist"
                    className={`text-lg font-medium ${pathname === "/wishlist" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                  >
                    Wishlist
                  </Link>
                  <Button
                    variant="ghost"
                    className="justify-start p-0 text-lg font-medium text-gray-600 hover:text-blue-600"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/explore" className="hidden md:flex items-center gap-2">
            <span className="text-xl font-bold text-blue-600">
              Poké<span className="text-yellow-500">Trade</span>
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/explore"
            className={`text-sm font-medium ${pathname === "/explore" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
          >
            Explore
          </Link>
          <Link
            href="/profile"
            className={`text-sm font-medium ${pathname === "/profile" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}
          >
            My Profile
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/wishlist" passHref>
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
            </Button>
          </Link>

          <DropdownMenu open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                    {unreadCount}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`cursor-pointer flex flex-col items-start p-3 ${!notification.read ? "bg-blue-50" : ""}`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    {/* <div className="font-medium">{notification.title}</div> */}
                    <div className="text-sm text-gray-600">{notification.message}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(notification.createOn).toLocaleString()}
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500">No notifications</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/wishlist">
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Wishlist</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
