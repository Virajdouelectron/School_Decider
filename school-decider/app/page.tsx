"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Star, DollarSign, GraduationCap, Phone, Mail, BookOpen, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

// Dummy data for schools
const dummySchools = [
  {
    id: 1,
    name: "Greenwood International School",
    location: "Mumbai, Maharashtra",
    board: "CBSE",
    fees: 150000,
    rating: 4.5,
    address: "123 Education Lane, Bandra West, Mumbai - 400050",
    facilities: ["Swimming Pool", "Computer Lab", "Library", "Sports Ground", "Transportation"],
    contact: {
      phone: "+91 98765 43210",
      email: "admissions@greenwood.edu.in",
    },
  },
  {
    id: 2,
    name: "St. Mary's Convent School",
    location: "Delhi, Delhi",
    board: "ICSE",
    fees: 120000,
    rating: 4.2,
    address: "456 Knowledge Street, Connaught Place, Delhi - 110001",
    facilities: ["Art Studio", "Music Room", "Science Lab", "Playground", "Cafeteria"],
    contact: {
      phone: "+91 98765 43211",
      email: "info@stmarys.edu.in",
    },
  },
  {
    id: 3,
    name: "Sunrise Public School",
    location: "Bangalore, Karnataka",
    board: "State",
    fees: 80000,
    rating: 4.0,
    address: "789 Learning Avenue, Koramangala, Bangalore - 560034",
    facilities: ["Computer Lab", "Library", "Sports Complex", "Transportation"],
    contact: {
      phone: "+91 98765 43212",
      email: "admissions@sunrise.edu.in",
    },
  },
  {
    id: 4,
    name: "Royal Academy",
    location: "Chennai, Tamil Nadu",
    board: "CBSE",
    fees: 200000,
    rating: 4.8,
    address: "321 Excellence Road, T. Nagar, Chennai - 600017",
    facilities: ["Swimming Pool", "Auditorium", "Computer Lab", "Library", "Sports Ground", "Transportation", "Hostel"],
    contact: {
      phone: "+91 98765 43213",
      email: "contact@royalacademy.edu.in",
    },
  },
  {
    id: 5,
    name: "Modern English School",
    location: "Pune, Maharashtra",
    board: "ICSE",
    fees: 110000,
    rating: 4.3,
    address: "654 Innovation Park, Koregaon Park, Pune - 411001",
    facilities: ["Science Lab", "Art Studio", "Library", "Playground", "Cafeteria"],
    contact: {
      phone: "+91 98765 43214",
      email: "info@modernenglish.edu.in",
    },
  },
]

interface School {
  id: number
  name: string
  location: string
  board: string
  fees: number
  rating: number
  address: string
  facilities: string[]
  contact: {
    phone: string
    email: string
  }
}

interface SearchFilters {
  location: string
  board: string
  minFees: number
  maxFees: number
  rating: string
}

export default function SchoolDecider() {
  const [schools, setSchools] = useState<School[]>([])
  const [filteredSchools, setFilteredSchools] = useState<School[]>([])
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    board: "All Boards",
    minFees: 50000,
    maxFees: 300000,
    rating: "Any Rating",
  })

  // Simulate loading schools data
  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setSchools(dummySchools)
      setFilteredSchools(dummySchools)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleSearch = () => {
    setIsLoading(true)
    setTimeout(() => {
      const filtered = schools.filter((school) => {
        const locationMatch =
          !filters.location || school.location.toLowerCase().includes(filters.location.toLowerCase())
        const boardMatch = !filters.board || school.board === filters.board
        const feesMatch = school.fees >= filters.minFees && school.fees <= filters.maxFees
        const ratingMatch = !filters.rating || school.rating >= Number.parseFloat(filters.rating)

        return locationMatch && boardMatch && feesMatch && ratingMatch
      })
      setFilteredSchools(filtered)
      setIsLoading(false)
    }, 500)
  }

  const formatFees = (fees: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(fees)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">School Decider</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Find the Right School for Your Child</h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Discover and compare the best schools in your area. Make an informed decision for your child's future.
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
            onClick={() => document.getElementById("search-section")?.scrollIntoView({ behavior: "smooth" })}
          >
            Start Your Search
          </Button>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section id="search-section" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Search Schools</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Location */}
              <div>
                <Label htmlFor="location" className="text-sm font-medium text-gray-700 mb-2 block">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="Enter city or area"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full"
                />
              </div>

              {/* Board */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Board</Label>
                <Select value={filters.board} onValueChange={(value) => setFilters({ ...filters, board: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select board" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Boards">All Boards</SelectItem>
                    <SelectItem value="CBSE">CBSE</SelectItem>
                    <SelectItem value="ICSE">ICSE</SelectItem>
                    <SelectItem value="State">State Board</SelectItem>
                    <SelectItem value="IB">International Baccalaureate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Rating */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Minimum Rating</Label>
                <Select value={filters.rating} onValueChange={(value) => setFilters({ ...filters, rating: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any Rating">Any Rating</SelectItem>
                    <SelectItem value="4.0">4.0+ Stars</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button onClick={handleSearch} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Fee Range Slider */}
            <div className="mb-4">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Annual Fees Range: {formatFees(filters.minFees)} - {formatFees(filters.maxFees)}
              </Label>
              <div className="px-2">
                <Slider
                  value={[filters.minFees, filters.maxFees]}
                  onValueChange={([min, max]) => setFilters({ ...filters, minFees: min, maxFees: max })}
                  max={300000}
                  min={50000}
                  step={10000}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-semibold text-gray-900">
              {isLoading ? "Searching..." : `Found ${filteredSchools.length} Schools`}
            </h3>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading schools...</span>
            </div>
          ) : filteredSchools.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h4 className="text-xl font-medium text-gray-900 mb-2">No schools found</h4>
              <p className="text-gray-600">Try adjusting your search criteria to find more schools.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchools.map((school) => (
                <Card key={school.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">{school.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{school.location}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{school.board}</Badge>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{school.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">{formatFees(school.fees)}/year</span>
                      </div>

                      <Button className="w-full mt-4" onClick={() => setSelectedSchool(school)}>
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* School Details Modal */}
      <Dialog open={!!selectedSchool} onOpenChange={() => setSelectedSchool(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedSchool && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900">{selectedSchool.name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{selectedSchool.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <GraduationCap className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Board</p>
                      <Badge variant="secondary">{selectedSchool.board}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Annual Fees</p>
                      <p className="font-medium">{formatFees(selectedSchool.fees)}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="font-medium">{selectedSchool.rating} / 5.0</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Full Address</h4>
                  <p className="text-gray-600">{selectedSchool.address}</p>
                </div>

                {/* Facilities */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Facilities</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedSchool.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                        {facility}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm">{selectedSchool.contact.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm">{selectedSchool.contact.email}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact School
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Save for Later
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
