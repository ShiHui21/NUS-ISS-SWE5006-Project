"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Search, ChevronDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"

interface FilterOption {
  value: string
  label: string
}

interface SearchFilterProps {
  onSearch?: () => void
  onFilter?: (filters: FilterState) => void
  onSort?: (sortOption: string) => void
  onReset?: () => void
  showSearch?: boolean
  showPriceFilter?: boolean
  showRegionFilter?: boolean
  showCardTypeFilter?: boolean
  initialFilters?: Partial<FilterState>
}

export interface FilterState {
  searchQuery: string
  minPrice: string
  maxPrice: string
  regions: string[]
  rarities: string[]
  cardConditions: string[]
  cardTypes: string[]
  sortBy: string
}

const sortOptions: FilterOption[] = [
  { value: "default", label: "Default Sort" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rarityPriority-asc", label: "Rarity: Hyper Rare to Common" },
  { value: "rarityPriority-desc", label: "Rarity: Common to Hyper Rare" },
  { value: "conditionPriority-asc", label: "Condition: Damaged to Brand New" },
  { value: "conditionPriority-desc", label: "Condition: Brand New to Damaged" },
]

const rarityOptions: FilterOption[] = [
  { value: "Common", label: "Common" },
  { value: "Uncommon", label: "Uncommon" },
  { value: "Rare", label: "Rare" },
  { value: "Double Rare", label: "Double Rare" },
  { value: "Illustration Rare", label: "Illustration Rare" },
  { value: "Special Illustration Rare", label: "Special Illustration Rare" },
  { value: "Hyper Rare", label: "Hyper Rare" },
]

const cardConditionOptions: FilterOption[] = [
  { value: "Brand New", label: "Brand New" },
  { value: "Like New", label: "Like New" },
  { value: "Lightly Used", label: "Lightly Used" },
  { value: "Well Used", label: "Well Used" },
  { value: "Heavily Used", label: "Heavily Used" },
  { value: "Damage", label: "Damaged" },
]

const cardTypeOptions: FilterOption[] = [
  { value: "Pokemon Card", label: "Pokémon Card" },
  { value: "Trainer Card", label: "Trainer Card" },
]

const regionOptions: FilterOption[] = [
  { value: "Central Region", label: "Central Region" },
  { value: "North Region", label: "North Region" },
  { value: "East Region", label: "East Region" },
  { value: "North East Region", label: "North East Region" },
  { value: "West Region", label: "West Region" },
]

export function SearchFilterComponent({
  onSearch,
  onFilter,
  onSort,
  onReset,
  showSearch = true,
  showPriceFilter = true,
  showRegionFilter = true,
  showCardTypeFilter = true,
  initialFilters,
}: SearchFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: initialFilters?.searchQuery || "",
    minPrice: initialFilters?.minPrice || "",
    maxPrice: initialFilters?.maxPrice || "",
    regions: initialFilters?.regions || [],
    rarities: initialFilters?.rarities || [],
    cardConditions: initialFilters?.cardConditions || [],
    cardTypes: initialFilters?.cardTypes || [],
    sortBy: initialFilters?.sortBy || "default",
  })

  // Handle numeric input for price fields
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, field: "minPrice" | "maxPrice") => {
    const value = e.target.value
    // Only allow numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFilters((prev) => {
        const newFilters = { ...prev, [field]: value }
        if (onFilter) onFilter(newFilters)
        return newFilters
      })
    }
  }

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFilters((prev) => {
      const newFilters = { ...prev, searchQuery: value }
      if (onFilter) onFilter(newFilters)
      return newFilters
    })
  }

  // Handle search on Enter key
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (onSearch) onSearch()
    }
  }

  // Handle sort change
  const handleSortChange = (value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev, sortBy: value }
      if (onSort) onSort(value)
      if (onFilter) onFilter(newFilters)
      return newFilters
    })
  }

  // Handle filter option toggle
  const toggleFilter = (value: string, type: "rarities" | "cardConditions" | "regions" | "cardTypes") => {
    setFilters((prev) => {
      const isSelected = prev[type].includes(value)
      const newValues = isSelected ? prev[type].filter((v) => v !== value) : [...prev[type], value]

      const newFilters = { ...prev, [type]: newValues }
      if (onFilter) onFilter(newFilters)
      return newFilters
    })
  }

  const resetFilters = () => {
    const resetState = {
      searchQuery: "",
      minPrice: "",
      maxPrice: "",
      regions: [],
      rarities: [],
      cardConditions: [],
      cardTypes: [],
      sortBy: "default",
    }

    setFilters(resetState)
    if (onFilter) onFilter(resetState)
    if (onSort) onSort("default")
  }

  // Get display text for multiselect dropdowns
  const getMultiselectLabel = (options: FilterOption[], selectedValues: string[]) => {
    if (selectedValues.length === 0) return "Any"
    if (selectedValues.length === 1) {
      return options.find((opt) => opt.value === selectedValues[0])?.label || "Any"
    }
    return `${selectedValues.length} selected`
  }

  return (
    <Card className="shadow-md mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          {/* Search and Sort Row */}
          <div className="flex flex-wrap gap-2">
            {showSearch && (
              <div className="relative flex-grow min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search by title..."
                  value={filters.searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  className="pl-10 border-gray-200"
                />
              </div>
            )}

            <div className="w-[180px]">
              <Select value={filters.sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="border-gray-200">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => {
                if (onSearch) onSearch()
              }}
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Search
            </Button>

            <Button
              onClick={() => {
                resetFilters()
                if (onReset) onReset()
              }}
              variant="outline"
              className="border-gray-300 text-blue-600 hover:bg-blue-50"
            >
              Reset
            </Button>
          </div>

          {/* Filter Options Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {/* Price Range */}
            {showPriceFilter && (
              <div className="flex items-center gap-2">
                <Label htmlFor="min-price" className="whitespace-nowrap w-16">
                  Price:
                </Label>
                <div className="flex flex-1 items-center gap-2">
                  <Input
                    id="min-price"
                    type="text"
                    inputMode="decimal"
                    value={filters.minPrice}
                    onChange={(e) => handlePriceChange(e, "minPrice")}
                    className="border-gray-200 w-full"
                    placeholder="Min"
                  />
                  <span>-</span>
                  <Input
                    id="max-price"
                    type="text"
                    inputMode="decimal"
                    value={filters.maxPrice}
                    onChange={(e) => handlePriceChange(e, "maxPrice")}
                    className="border-gray-200 w-full"
                    placeholder="Max"
                  />
                </div>
              </div>
            )}

            {/* Rarity Dropdown */}
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap w-16">Rarity:</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {getMultiselectLabel(rarityOptions, filters.rarities)}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0" align="start">
                  <div className="p-2">
                    {rarityOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
                        <Checkbox
                          id={`rarity-${option.value}`}
                          checked={filters.rarities.includes(option.value)}
                          onCheckedChange={() => toggleFilter(option.value, "rarities")}
                        />
                        <label
                          htmlFor={`rarity-${option.value}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Condition Dropdown */}
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap w-16">Condition:</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {getMultiselectLabel(cardConditionOptions, filters.cardConditions)}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <div className="p-2">
                    {cardConditionOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
                        <Checkbox
                          id={`condition-${option.value}`}
                          checked={filters.cardConditions.includes(option.value)}
                          onCheckedChange={() => toggleFilter(option.value, "cardConditions")}
                        />
                        <label
                          htmlFor={`condition-${option.value}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Card Type Dropdown */}
            {showCardTypeFilter && (
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap w-16">Card Type:</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {getMultiselectLabel(cardTypeOptions, filters.cardTypes)}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <div className="p-2">
                    {cardTypeOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
                        <Checkbox
                          id={`cardType-${option.value}`}
                          checked={filters.cardTypes.includes(option.value)}
                          onCheckedChange={() => toggleFilter(option.value, "cardTypes")}
                        />
                        <label
                          htmlFor={`cardType-${option.value}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            )}


            {/* Region Dropdown */}
            {showRegionFilter && (
              <div className="flex items-center gap-2 md:col-span-3">
                <Label className="whitespace-nowrap w-16">Region:</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {getMultiselectLabel(regionOptions, filters.regions)}
                      <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start">
                    <div className="p-2">
                      {regionOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
                          <Checkbox
                            id={`region-${option.value}`}
                            checked={filters.regions.includes(option.value)}
                            onCheckedChange={() => toggleFilter(option.value, "regions")}
                          />
                          <label
                            htmlFor={`region-${option.value}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
