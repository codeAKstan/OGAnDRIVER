"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { Search, MapPin, Star } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Newsletter from "@/components/Newsletter"


export default function HireRentPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedModel, setSelectedModel] = useState("all")

  const vehicles = [
    {
      id: 1,
      image: "/keke1.png",
      title: "Brand New Tricycle Keke Bajaj RE 2023",
      location: "Enugu State • Model year 2023",
      price: "₦3,620,000.00",
      features: ["Brand New", "Weekly Payment", "All Conditions"],
      rating: 4.8,
      available: true
    },
    {
      id: 2,
      image: "/keke2.png",
      title: "Piaggio Ape City 2023",
      location: "Enugu State • Model year 2023",
      price: "₦1,600,000.00",
      features: ["Good Engine", "Weekly Payment", "All Conditions"],
      rating: 4.5,
      available: true
    },
    {
      id: 3,
      image: "/keke3.png",
      title: "Brand New Tricycle Keke Bajaj RE 2022",
      location: "Enugu State • Model year 2022",
      price: "₦1,450,000.00",
      features: ["Brand New", "Weekly Payment", "All Conditions"],
      rating: 4.9,
      available: true
    },
    {
      id: 4,
      image: "/keke4.png",
      title: "Brand New Tricycle Keke Bajaj RE 2023",
      location: "Enugu State • Model year 2023",
      price: "₦3,620,000.00",
      features: ["Brand New", "Weekly Payment", "All Conditions"],
      rating: 4.6,
      available: true
    },
    {
      id: 5,
      image: "/keke5.png",
      title: "Brand New Tricycle Keke Bajaj RE 2023",
      location: "Enugu State • Model year 2023",
      price: "₦3,620,000.00",
      features: ["Brand New", "Weekly Payment", "All Conditions"],
      rating: 4.7,
      available: true
    },
    {
      id: 6,
      image: "/keke6.png",
      title: "Brand New Tricycle Keke Bajaj RE 2023",
      location: "Enugu State • Model year 2023",
      price: "₦3,620,000.00",
      features: ["Brand New", "Weekly Payment", "All Conditions"],
      rating: 4.4,
      available: true
    }
  ]

  const locations = ["all", "Enugu State", "Lagos State", "Abuja FCT", "Rivers State"]
  const models = ["all", "Bajaj RE", "Piaggio Ape", "TVS King", "Mahindra Alfa"]

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = selectedLocation === "all" || vehicle.location.includes(selectedLocation)
    const matchesModel = selectedModel === "all" || vehicle.title.toLowerCase().includes(selectedModel.toLowerCase())
    return matchesSearch && matchesLocation && matchesModel
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-black py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Available <span className="text-orange-500">Keke</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              for Hire-Purchase
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Apply for a deal that fits your hustle and start your journey to ownership.
            </p>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="bg-[#1A1A1A] py-12">
          <div className="container mx-auto px-4 py-8 bg-[#252525]">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-4xl mx-auto">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Input
                  type="text"
                  placeholder="Search for available kekes by location, model or Oga Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#06050566] text-black pl-12 pr-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-orange-500 w-full"
                />
              </div>
              
              {/* Search Button */}
              <Button className="bg-orange-500 hover:bg-orange-600 text-black px-8 py-3 rounded-lg font-semibold">
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>

            {/* Filter Options */}
            <div className="flex flex-wrap gap-4 justify-center mt-6">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-orange-500 text-black rounded-full px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-orange-600"
              >
                <option value="all">Location</option>
                {locations.slice(1).map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-[#1A1A1A] text-white rounded-full px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Weekly Payment</option>
                <option value="weekly">Weekly Payment</option>
                <option value="monthly">Monthly Payment</option>
              </select>

              <select
                className="bg-[#1A1A1A] text-white rounded-full px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option>Model / Year</option>
                <option>2023</option>
                <option>2022</option>
                <option>2021</option>
              </select>

              <Button className="bg-[#1A1A1A] text-white hover:bg-[#1A1A1A] rounded-full px-4 py-2 font-medium">
                All Filters
              </Button>
            </div>
          </div>
        </section>

        {/* Vehicle Grid */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-[#252525] rounded-lg overflow-hidden hover:bg-[#252525]transition-colors">
                  <div className="relative">
                    <Image
                      src={vehicle.image}
                      alt={vehicle.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center">
                      <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {vehicle.rating}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2 text-white">{vehicle.title}</h3>
                    <div className="flex items-center text-gray-400 text-sm mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      {vehicle.location}
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {vehicle.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center bg-[#252525] text-xs px-2 py-1 rounded text-gray-300"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-white">
                        {vehicle.price}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold py-2">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
        <Newsletter />

      <Footer />
    </div>
  )
}