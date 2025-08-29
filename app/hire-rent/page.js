"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { Search, Filter, MapPin, Calendar, Users, Fuel, Settings } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function HireRentPage() {
  const [activeTab, setActiveTab] = useState("hire") // hire or purchase
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [priceRange, setPriceRange] = useState("all")

  const vehicles = [
    {
      id: 1,
      image: "/keke1.png",
      title: "Brand New Tricycle Keke RE 2024",
      location: "Abuja, Nigeria",
      hirePrice: "₦15,000/day",
      purchasePrice: "₦3,500,000",
      features: ["New Engine", "Good Condition", "Warranty Included"],
      specs: {
        passengers: "3-4",
        fuel: "Petrol",
        transmission: "Manual",
        year: "2024"
      },
      available: true,
      rating: 4.8
    },
    {
      id: 2,
      image: "/keke2.png",
      title: "Piaggio Ape City 2023",
      location: "Lagos, Nigeria",
      hirePrice: "₦12,000/day",
      purchasePrice: "₦800,000",
      features: ["Good Engine", "Fair Condition", "Tested & Verified"],
      specs: {
        passengers: "3",
        fuel: "Petrol",
        transmission: "Manual",
        year: "2023"
      },
      available: true,
      rating: 4.5
    },
    {
      id: 3,
      image: "/keke3.png",
      title: "Brand New Tricycle Keke RE 2024",
      location: "Port Harcourt, Nigeria",
      hirePrice: "₦18,000/day",
      purchasePrice: "₦1,400,000",
      features: ["New Engine", "Excellent Condition", "Full Documentation"],
      specs: {
        passengers: "4",
        fuel: "Petrol",
        transmission: "Manual",
        year: "2024"
      },
      available: true,
      rating: 4.9
    },
    {
      id: 4,
      image: "/keke4.png",
      title: "TVS King Deluxe 2023",
      location: "Kano, Nigeria",
      hirePrice: "₦14,000/day",
      purchasePrice: "₦1,200,000",
      features: ["Reliable Engine", "Good Condition", "Maintenance Records"],
      specs: {
        passengers: "3",
        fuel: "Petrol",
        transmission: "Manual",
        year: "2023"
      },
      available: false,
      rating: 4.6
    },
    {
      id: 5,
      image: "/keke5.png",
      title: "Bajaj RE Compact 2024",
      location: "Ibadan, Nigeria",
      hirePrice: "₦16,000/day",
      purchasePrice: "₦2,800,000",
      features: ["Brand New", "Fuel Efficient", "Modern Design"],
      specs: {
        passengers: "3-4",
        fuel: "Petrol",
        transmission: "Manual",
        year: "2024"
      },
      available: true,
      rating: 4.7
    },
    {
      id: 6,
      image: "/keke6.png",
      title: "Mahindra Alfa Plus 2023",
      location: "Enugu, Nigeria",
      hirePrice: "₦13,000/day",
      purchasePrice: "₦950,000",
      features: ["Spacious", "Comfortable", "Well Maintained"],
      specs: {
        passengers: "4",
        fuel: "Petrol",
        transmission: "Manual",
        year: "2023"
      },
      available: true,
      rating: 4.4
    }
  ]

  const locations = ["all", "Abuja", "Lagos", "Port Harcourt", "Kano", "Ibadan", "Enugu"]
  const priceRanges = {
    hire: ["all", "₦10,000-15,000", "₦15,000-20,000", "₦20,000+"],
    purchase: ["all", "₦500,000-1,000,000", "₦1,000,000-2,000,000", "₦2,000,000+"]
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = selectedLocation === "all" || vehicle.location.includes(selectedLocation)
    return matchesSearch && matchesLocation
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-black to-gray-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-orange-500">Hire</span> or <span className="text-orange-500">Buy</span>
            <br />Your Perfect Keke
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Choose from our wide selection of well-maintained tricycles. 
            Rent for daily operations or purchase to build your fleet.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-gray-900 py-8 border-b border-gray-800">
        <div className="container mx-auto px-4">
          {/* Tab Selection */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-800 rounded-lg p-1 flex">
              <button
                onClick={() => setActiveTab("hire")}
                className={`px-8 py-3 rounded-md font-semibold transition-colors ${
                  activeTab === "hire"
                    ? "bg-orange-500 text-black"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Hire/Rent
              </button>
              <button
                onClick={() => setActiveTab("purchase")}
                className={`px-8 py-3 rounded-md font-semibold transition-colors ${
                  activeTab === "purchase"
                    ? "bg-orange-500 text-black"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Purchase
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white pl-10 focus:border-orange-500"
              />
            </div>
            
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 focus:border-orange-500"
            >
              {locations.map(location => (
                <option key={location} value={location}>
                  {location === "all" ? "All Locations" : location}
                </option>
              ))}
            </select>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 focus:border-orange-500"
            >
              {priceRanges[activeTab].map(range => (
                <option key={range} value={range}>
                  {range === "all" ? "All Prices" : range}
                </option>
              ))}
            </select>

            <Button className="bg-orange-500 hover:bg-orange-600 text-black">
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Vehicle Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">
              {activeTab === "hire" ? "Available for Hire" : "Available for Purchase"}
            </h2>
            <p className="text-gray-400">{filteredVehicles.length} vehicles found</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors">
                <div className="relative">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                  />
                  {!vehicle.available && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-sm">
                      Not Available
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    ⭐ {vehicle.rating}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 text-white">{vehicle.title}</h3>
                  <div className="flex items-center text-gray-400 text-sm mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    {vehicle.location}
                  </div>

                  {/* Vehicle Specs */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div className="flex items-center text-gray-400">
                      <Users className="w-4 h-4 mr-1" />
                      {vehicle.specs.passengers} passengers
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Fuel className="w-4 h-4 mr-1" />
                      {vehicle.specs.fuel}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Settings className="w-4 h-4 mr-1" />
                      {vehicle.specs.transmission}
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      {vehicle.specs.year}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    {vehicle.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-gray-800 text-xs px-2 py-1 rounded mr-2 mb-2 text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-orange-500">
                      {activeTab === "hire" ? vehicle.hirePrice : vehicle.purchasePrice}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      className={`w-full ${vehicle.available 
                        ? 'bg-orange-500 hover:bg-orange-600 text-black' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!vehicle.available}
                    >
                      {activeTab === "hire" ? "Book Now" : "Buy Now"}
                    </Button>
                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Contact our team to discuss custom requirements, bulk orders, or special arrangements.
            We're here to help you find the perfect vehicle solution.
          </p>
          <div className="space-x-4">
          <Link href="/contact">
            
            <Button className="bg-orange-500 hover:bg-orange-600 text-black px-8 py-3">
              Contact Us
            </Button>
          </Link>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3">
              Request Quote
            </Button>
          </div>
        </div>
      </section>
      </div>

      <Footer />
    </div>
  )
}