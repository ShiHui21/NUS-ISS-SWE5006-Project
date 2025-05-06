"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Upload, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import type { ListingType } from "@/types/listing"

interface ListingFormModalProps {
  onClose: () => void
  onSubmit: (
    listingData: {
      id?: string
      title: string
      description: string
      price: number
      cardType: string
      rarity: string
      cardCondition: string
    },
    imageFiles: File[],
  ) => void
  listing?: ListingType | null
  mode: "create" | "edit"
}

export function ListingFormModal({ onClose, onSubmit, listing, mode }: ListingFormModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    cardType: "",
    rarity: "",
    cardCondition: "",
  })

  const [mainImage, setMainImage] = useState<string | null>(null)
  const [additionalImages, setAdditionalImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([])

  // Initialize form data if editing an existing listing
  useEffect(() => {
    if (mode === "edit" && listing) {
      console.log(listing)
      setFormData({
        title: listing.title || "",
        description: listing.description || "",
        price: listing.price?.toString() || "",
        cardType: listing.cardType,
        rarity: listing.rarity,
        cardCondition: listing.condition,
      })
      // Set images if available
      if (listing.imageUrl) {
        setMainImage(listing.imageUrl)
        if (listing.additionalImages) {
          setAdditionalImages(listing.additionalImages)
        }
      }
    }
  }, [listing, mode])

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

    const reader = new FileReader()
    reader.onload = () => {
      if (isMain) {
        setMainImage(reader.result as string)
        setMainImageFile(file)
      } else {
        setAdditionalImages((prev) => [...prev, reader.result as string])
        setAdditionalImageFiles((prev) => [...prev, file])
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  const removeImage = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index))
    setAdditionalImageFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const removeMainImage = () => {
    setMainImage(null)
    setMainImageFile(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const price = Number.parseFloat(formData.price)
    if (isNaN(price) || price <= 0) {
      console.error("Validation failed: Price must be a positive number")
      return
    }

    // In edit mode, we don't require a main image if one already exists
    if (mode === "create" && !mainImageFile && !mainImage) {
      console.error("Validation failed: Main image is required for new listings")
      return
    }

    const listingDataPayload = {
      ...(mode === "edit" && listing ? { id: listing.id } : {}),
      title: formData.title,
      description: formData.description,
      price,
      cardType: formData.cardType,
      rarity: formData.rarity,
      cardCondition: formData.cardCondition,
    }

    const imageFiles: File[] = []
    if (mainImageFile) {
      imageFiles.push(mainImageFile)
    }
    imageFiles.push(...additionalImageFiles)

    onSubmit(listingDataPayload, imageFiles)
  }

  const modalTitle = mode === "create" ? "Create New Listing" : "Edit Listing"
  const submitButtonText = mode === "create" ? "Create Listing" : "Update Listing"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10" onClick={onClose}>
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-6">{modalTitle}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Card Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Charizard Holo 1st Edition"
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
                placeholder="Describe your card's details, history, and any special features..."
                required
                className="min-h-[100px] resize-none border-gray-200 focus:border-blue-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardType">Card Type</Label>
              <Select value={formData.cardType} onValueChange={(value) => handleSelectChange("cardType", value)}>
                <SelectTrigger id="cardType" className="border-gray-200">
                  <SelectValue placeholder="Select Card Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pokemon Card">Pokemon Card</SelectItem>
                  <SelectItem value="Trainer Card">Trainer Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="29.99"
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
                    <SelectItem value="Common">Common</SelectItem>
                    <SelectItem value="Uncommon">Uncommon</SelectItem>
                    <SelectItem value="Rare">Rare</SelectItem>
                    <SelectItem value="Double Rare">Double Rare</SelectItem>
                    <SelectItem value="Illustration Rare">Illustration Rare</SelectItem>
                    <SelectItem value="Special Illustration Rare">Special Illustration Rare</SelectItem>
                    <SelectItem value="Hyper Rare">Hyper Rare</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardCondition">Condition</Label>
                <Select value={formData.cardCondition} onValueChange={(value) => handleSelectChange("cardCondition", value)}>
                  <SelectTrigger id="cardCondition" className="border-gray-200">
                    <SelectValue placeholder="Select Condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Brand New">Brand New</SelectItem>
                    <SelectItem value="Like New">Like New</SelectItem>
                    <SelectItem value="Lightly Used">Lightly Used</SelectItem>
                    <SelectItem value="Well Used">Well Used</SelectItem>
                    <SelectItem value="Heavily Used">Heavily Used</SelectItem>
                    <SelectItem value="Damage">Damage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" className="flex-1 border-gray-300" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                {submitButtonText}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
