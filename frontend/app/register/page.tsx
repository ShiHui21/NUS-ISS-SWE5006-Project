"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    mobile: "",
    region: "north",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, region: value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // This would be replaced with actual API call to Spring Boot backend
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Registration failed")
      }

      // For now, we'll simulate a successful registration
      setTimeout(() => {
        toast({
          title: "Registration Successful!",
          description: "You can now log in with your credentials.",
        })
        router.push("/login")
      }, 1000)
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <span className="text-4xl font-bold text-blue-600">
              Poké<span className="text-yellow-500">Trade</span>
            </span>
          </div>
          <h1 className="text-3xl font-bold text-yellow-500 drop-shadow-md">
            <span className="text-blue-500">Poké</span>Trade
          </h1>
          <p className="text-gray-600 mt-2">Join the Pokémon card trading community</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-blue-600">Create an Account</CardTitle>
            <CardDescription className="text-center">Enter your details to register</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ash Ketchum"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="border-gray-200 focus:border-blue-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="pokemon_master"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="border-gray-200 focus:border-blue-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ash.ketchum@pokemon.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border-gray-200 focus:border-blue-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  className="border-gray-200 focus:border-blue-300"
                />
              </div>

              <div className="space-y-2">
                <Label>Region</Label>
                <RadioGroup
                  value={formData.region}
                  onValueChange={handleRegionChange}
                  className="grid grid-cols-2 gap-2"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-blue-50">
                    <RadioGroupItem value="north" id="north" />
                    <Label htmlFor="north" className="cursor-pointer">
                      North
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-blue-50">
                    <RadioGroupItem value="south" id="south" />
                    <Label htmlFor="south" className="cursor-pointer">
                      South
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-blue-50">
                    <RadioGroupItem value="east" id="east" />
                    <Label htmlFor="east" className="cursor-pointer">
                      East
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-2 cursor-pointer hover:bg-blue-50">
                    <RadioGroupItem value="west" id="west" />
                    <Label htmlFor="west" className="cursor-pointer">
                      West
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="border-gray-200 focus:border-blue-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="border-gray-200 focus:border-blue-300"
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500 hover:underline font-medium">
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
