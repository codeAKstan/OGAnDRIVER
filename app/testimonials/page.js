"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { Star, Search, Filter, Quote, ThumbsUp, MessageCircle, Calendar } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const counterRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime = null
    const startValue = 0
    const endValue = parseInt(end.toString().replace(/[^0-9]/g, '')) || 0

    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeOutQuart * endValue)
      
      setCount(currentCount)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(endValue)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <span ref={counterRef} className="inline-block">
      {prefix}{count}{suffix}
    </span>
  )
}

export default function TestimonialsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  const testimonials = [
    {
      id: 1,
      name: "Adebayo Adebisi",
      role: "Tricycle Owner",
      location: "Lagos, Nigeria",
      content: "OGANDRIVER made it so easy for me to purchase my tricycle. The process was transparent and stress-free. I've been operating for 6 months now and earning consistently.",
      rating: 5,
      category: "purchase",
      date: "2024-01-15",
      verified: true,
      likes: 24,
      image: "/placeholder-user.jpg"
    },
    {
      id: 2,
      name: "Khadijah Abubakar",
      role: "Business Owner",
      location: "Abuja, Nigeria",
      content: "Excellent service! I was able to hire a tricycle for my business needs quickly and affordably. The booking process was seamless and the vehicle was in perfect condition.",
      rating: 5,
      category: "hire",
      date: "2024-01-20",
      verified: true,
      likes: 18,
      image: "/placeholder-user.jpg"
    },
    {
      id: 3,
      name: "Chidi Okafor",
      role: "Driver",
      location: "Port Harcourt, Nigeria",
      content: "The hire purchase option helped me start my transportation business. Highly recommended! The flexible payment terms made it possible for me to own my keke.",
      rating: 5,
      category: "hire-purchase",
      date: "2024-01-10",
      verified: true,
      likes: 31,
      image: "/placeholder-user.jpg"
    },
    {
      id: 4,
      name: "Fatima Mohammed",
      role: "Entrepreneur",
      location: "Kano, Nigeria",
      content: "I started with one tricycle through OGA Driver and now I have a fleet of 5. The platform has been instrumental in growing my business. Customer support is excellent.",
      rating: 5,
      category: "purchase",
      date: "2024-01-25",
      verified: true,
      likes: 42,
      image: "/placeholder-user.jpg"
    },
    {
      id: 5,
      name: "Emmanuel Okoro",
      role: "Fleet Manager",
      location: "Enugu, Nigeria",
      content: "Managing our company's tricycle fleet became much easier with OGA Driver. The maintenance tracking and driver management features are top-notch.",
      rating: 4,
      category: "fleet",
      date: "2024-02-01",
      verified: true,
      likes: 15,
      image: "/placeholder-user.jpg"
    },
    {
      id: 6,
      name: "Blessing Eze",
      role: "Student",
      location: "Ibadan, Nigeria",
      content: "As a student, I needed affordable transportation for my part-time delivery business. The daily hire option was perfect for my budget and schedule.",
      rating: 5,
      category: "hire",
      date: "2024-02-05",
      verified: false,
      likes: 8,
      image: "/placeholder-user.jpg"
    },
    {
      id: 7,
      name: "Ibrahim Yusuf",
      role: "Tricycle Driver",
      location: "Kaduna, Nigeria",
      content: "The driver training program was comprehensive. I learned not just how to operate the vehicle but also business management skills. Now I'm earning more than ever.",
      rating: 5,
      category: "training",
      date: "2024-02-10",
      verified: true,
      likes: 27,
      image: "/placeholder-user.jpg"
    },
    {
      id: 8,
      name: "Grace Adamu",
      role: "Logistics Coordinator",
      location: "Jos, Nigeria",
      content: "For our last-mile delivery needs, OGA Driver's tricycles have been reliable and cost-effective. The GPS tracking gives us peace of mind.",
      rating: 4,
      category: "hire",
      date: "2024-02-12",
      verified: true,
      likes: 12,
      image: "/placeholder-user.jpg"
    },
    {
      id: 9,
      name: "Musa Abdullahi",
      role: "Transport Business Owner",
      location: "Maiduguri, Nigeria",
      content: "The insurance coverage and maintenance support provided peace of mind. I can focus on growing my business while OGA Driver handles the technical aspects.",
      rating: 5,
      category: "purchase",
      date: "2024-02-15",
      verified: true,
      likes: 19,
      image: "/placeholder-user.jpg"
    }
  ]

  const categories = [
    { value: "all", label: "All Reviews" },
    { value: "purchase", label: "Purchase" },
    { value: "hire", label: "Hire/Rent" },
    { value: "hire-purchase", label: "Hire Purchase" },
    { value: "fleet", label: "Fleet Management" },
    { value: "training", label: "Training" }
  ]

  const stats = [
    { label: "Total Reviews", value: "500+", numericValue: 500, suffix: "+" },
    { label: "Average Rating", value: "4.8", numericValue: 4.8, suffix: "", isDecimal: true },
    { label: "Verified Reviews", value: "89%", numericValue: 89, suffix: "%" },
    { label: "Response Rate", value: "98%", numericValue: 98, suffix: "%" }
  ]

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesCategory = selectedCategory === "all" || testimonial.category === selectedCategory
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.location.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const sortedTestimonials = [...filteredTestimonials].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.date) - new Date(a.date)
      case "oldest":
        return new Date(a.date) - new Date(b.date)
      case "rating":
        return b.rating - a.rating
      case "likes":
        return b.likes - a.likes
      default:
        return 0
    }
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            What Our <span className="text-orange-500">Customers</span> Say
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Real stories from real people who have transformed their lives and businesses with OGA Driver.
          </p>
          
          {/* Animated Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2 transition-transform duration-300 group-hover:scale-110">
                  {stat.isDecimal ? (
                    <span>
                      <AnimatedCounter 
                        end={Math.floor(stat.numericValue)} 
                        duration={2000 + index * 200}
                      />
                      .{Math.floor((stat.numericValue % 1) * 10)}
                      {stat.suffix}
                    </span>
                  ) : (
                    <AnimatedCounter 
                      end={stat.numericValue} 
                      duration={2000 + index * 200}
                      suffix={stat.suffix}
                    />
                  )}
                </div>
                <div className="text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-gray-900 py-8 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white pl-10 focus:border-orange-500"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 focus:border-orange-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 focus:border-orange-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating">Highest Rating</option>
              <option value="likes">Most Liked</option>
            </select>

            <Button className="bg-orange-500 hover:bg-orange-600 text-black">
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            <p className="text-gray-400">{sortedTestimonials.length} reviews found</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="text-white font-semibold">{testimonial.name}</h4>
                        {testimonial.verified && (
                          <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                      <p className="text-gray-500 text-xs">{testimonial.location}</p>
                    </div>
                  </div>
                  <Quote className="w-6 h-6 text-orange-500 opacity-50" />
                </div>

                {/* Rating */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < testimonial.rating 
                          ? 'text-orange-500 fill-current' 
                          : 'text-gray-600'
                      }`} 
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-400">({testimonial.rating}/5)</span>
                </div>

                {/* Content */}
                <p className="text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(testimonial.date)}
                  </div>
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center hover:text-orange-500 transition-colors">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {testimonial.likes}
                    </button>
                    <button className="flex items-center hover:text-orange-500 transition-colors">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Reply
                    </button>
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
            Ready to Join Our <span className="text-orange-500">Success Stories?</span>
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Start your journey with OGA Driver today and become part of our growing community of successful drivers and business owners.
          </p>
          <div className="space-x-4">
            <Button className="bg-orange-500 hover:bg-orange-600 text-black px-8 py-3">
              Get Started Today
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3">
              Share Your Story
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}