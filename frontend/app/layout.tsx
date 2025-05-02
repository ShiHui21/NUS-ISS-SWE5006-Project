import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ClientAuthProvider from "@/components/client-auth-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PokéTrade - Pokémon Card Marketplace",
  description: "Trade and collect Pokémon cards with enthusiasts worldwide",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ClientAuthProvider>{children}</ClientAuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
