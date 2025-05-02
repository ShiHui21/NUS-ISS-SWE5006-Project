"use client"

import type React from "react"

import { useState } from "react"
import { X, Upload, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ListingType } from "@/types/listing"
import Image from "next/image"

interface EditListingModalProps {
  listing: ListingType
  onClose: () => void
  onSubmit: (listing: ListingType) => void
}

export function EditListingModal({ listing, onClose, onSubmit }: EditListingModalProps) {
  const [formData, setFormData] = useState({
    ...listing,
    price: listing.price.toString(),
  })

  const [mainImage, setMainImage] = useState<string | null>(listing.imageUrl)
  const [additionalImages, setAdditionalImages] = useState<string[]>(listing.additionalImages || [])
  const [isUploading, setIsUploading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isMain = true) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Simulate file upload - in a real app, you would upload to a server
    const reader = new FileReader()
    reader.onload = () => {
      if (isMain) {
        setMainImage(reader.result as string)
      } else {
        setAdditionalImages((prev) => [...prev, reader.result as string])
      }
      setIsUploading(false)
    }
    reader.readAsDataURL(file)

    // Reset the input value so the same file can be selected again if needed
    e.target.value = ""
  }

  const removeImage = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeMainImage = () => {
    setMainImage(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const price = Number.parseFloat(formData.price)

    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid price")
      return
    }

    if (!mainImage) {
      alert("Please upload a main image")
      return
    }

    onSubmit({
      ...formData,
      price,
      imageUrl: mainImage,
      additionalImages,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10" onClick={onClose}>
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">Edit Listing</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Card Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="border-gray-200 focus:border-blue-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="min-h-[100px] border-gray-200 focus:border-blue-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="2"
                max="100"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                className="border-gray-200 focus:border-blue-300"
              />
            </div>

            <div className="space-y-2">
              <Label>Main Image</Label>
              {mainImage ? (
                <div className="relative rounded-md overflow-hidden">
                  <Image
                    src={mainImage || "/placeholder.svg"}
                    alt="Main card image"
                    width={300}
                    height={300}
                    className="w-full h-40 object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeMainImage}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">Click to upload main image</p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    className="hidden"
                    id="main-image-upload"
                  />
                  <Label
                    htmlFor="main-image-upload"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700"
                  >
                    {isUploading ? "Uploading..." : "Select Image"}
                  </Label>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Additional Images</Label>
              <div className="grid grid-cols-3 gap-2">
                {additionalImages.map((img, index) => (
                  <div key={index} className="relative rounded-md overflow-hidden">
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`Additional image ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-20 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-5 w-5 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {additionalImages.length < 5 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center h-20">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="hidden"
                      id="additional-image-upload"
                    />
                    <Label
                      htmlFor="additional-image-upload"
                      className="w-full h-full flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="h-6 w-6 text-gray-400" />
                    </Label>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">You can add up to 5 additional images</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rarity">Rarity</Label>
                <Select value={formData.rarity} onValueChange={(value) => handleSelectChange("rarity", value)}>
                  <SelectTrigger id="rarity" className="border-gray-200">
                    <SelectValue placeholder="Select Rarity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="common">Common</SelectItem>
                    <SelectItem value="uncommon">Uncommon</SelectItem>
                    <SelectItem value="rare">Rare</SelectItem>
                    <SelectItem value="ultra-rare">Ultra Rare</SelectItem>
                    <SelectItem value="secret-rare">Secret Rare</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select value={formData.condition} onValueChange={(value) => handleSelectChange("condition", value)}>
                  <SelectTrigger id="condition" className="border-gray-200">
                    <SelectValue placeholder="Select Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mint">Mint</SelectItem>
                    <SelectItem value="near-mint">Near Mint</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="played">Played</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" className="flex-1 border-gray-300" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
