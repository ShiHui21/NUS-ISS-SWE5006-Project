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
  onSearch?: (query: string) => void
  onFilter?: (filters: FilterState) => void
  onSort?: (sortOption: string) => void
  showSearch?: boolean
  showPriceFilter?: boolean
  showRegionFilter?: boolean
  initialFilters?: Partial<FilterState>
}

export interface FilterState {
  searchQuery: string
  minPrice: string
  maxPrice: string
  regions: string[]
  rarities: string[]
  conditions: string[]
  sortBy: string
}

const sortOptions: FilterOption[] = [
  { value: "default", label: "Default Sort" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rarity-asc", label: "Rarity: Common to Rare" },
  { value: "rarity-desc", label: "Rarity: Rare to Common" },
  { value: "condition-asc", label: "Condition: Poor to Mint" },
  { value: "condition-desc", label: "Condition: Mint to Poor" },
]

const rarityOptions: FilterOption[] = [
  { value: "common", label: "Common" },
  { value: "uncommon", label: "Uncommon" },
  { value: "rare", label: "Rare" },
  { value: "ultra-rare", label: "Ultra Rare" },
  { value: "secret-rare", label: "Secret Rare" },
]

const conditionOptions: FilterOption[] = [
  { value: "mint", label: "Mint" },
  { value: "near-mint", label: "Near Mint" },
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "played", label: "Played" },
]

const regionOptions: FilterOption[] = [
  { value: "north", label: "North" },
  { value: "south", label: "South" },
  { value: "east", label: "East" },
  { value: "west", label: "West" },
]

export function SearchFilterComponent({
  onSearch,
  onFilter,
  onSort,
  showSearch = true,
  showPriceFilter = true,
  showRegionFilter = true,
  initialFilters,
}: SearchFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: initialFilters?.searchQuery || "",
    minPrice: initialFilters?.minPrice || "2",
    maxPrice: initialFilters?.maxPrice || "100",
    regions: initialFilters?.regions || [],
    rarities: initialFilters?.rarities || [],
    conditions: initialFilters?.conditions || [],
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
      if (onSearch) onSearch(value)
      if (onFilter) onFilter(newFilters)
      return newFilters
    })
  }

  // Handle search on Enter key
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (onFilter) onFilter(filters)
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
  const toggleFilter = (value: string, type: "rarities" | "conditions" | "regions") => {
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
      minPrice: "2",
      maxPrice: "100",
      regions: [],
      rarities: [],
      conditions: [],
      sortBy: "default",
    }

    setFilters(resetState)
    if (onSearch) onSearch("")
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

            <Button onClick={resetFilters} variant="outline" className="border-gray-300 text-blue-600 hover:bg-blue-50">
              Reset
            </Button>
          </div>

          {/* Filter Options Row */}
          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-2"> */}
          <div className={`grid grid-cols-1 ${showRegionFilter ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-2`}>
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
                <PopoverContent className={`${showRegionFilter ? 'w-[270px]' : 'w-[250px]'} p-0`} align="start">
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
                    {getMultiselectLabel(conditionOptions, filters.conditions)}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className={`${showRegionFilter ? 'w-[260px]' : 'w-[240px]'} p-0`} align="start">
                  <div className="p-2">
                    {conditionOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
                        <Checkbox
                          id={`condition-${option.value}`}
                          checked={filters.conditions.includes(option.value)}
                          onCheckedChange={() => toggleFilter(option.value, "conditions")}
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

            {/* Region Dropdown */}
            {showRegionFilter && (
              // <div className="flex items-center gap-2 md:col-span-3">
              <div className="flex items-center gap-2">
                <Label className="whitespace-nowrap w-16">Region:</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {getMultiselectLabel(regionOptions, filters.regions)}
                      <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[270px] p-0" align="start">
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
