"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { Search, Filter } from "lucide-react"
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

  const testimonials = [
     {
       id: 1,
       name: "Emeka Egboka",
       role: "Driver",
       image: "/man1.png",
       content: "OGAnDRIVER helped me prove I've never missed a payment. Before now, my last Oga dey change story anyhow. But now, everything is recorded and I can even show it. I finally own my ride and I'm respected likea serious man now. This app changed my life"
     },
     {
       id: 2,
       name: "Chinelo Adio",
       role: "Driver",
       image: "/man2.png",
       content: "I've been using Oga Driver for over 6 months now and it's been a game-changer for my business. The platform is user-friendly and the support team is always ready to help. I've been able to grow my fleet from 2 to 8 tricycles thanks to their flexible payment options."
     },
     {
       id: 3,
       name: "Kingsley Akinola",
       role: "Business Owner",
       image: "/man3.png",
       content: "What I appreciate most about Oga Driver is their transparency. No hidden fees, clear terms, and excellent customer service. The hire-purchase option helped me start my own transportation business without breaking the bank."
     },
     {
       id: 4,
       name: "Oge Mark",
       role: "Driver",
       image: "/man4.png",
       content: "Service has been top-notch. I was able to get a tricycle for my delivery business within 24 hours of applying. The weekly payment plan fits perfectly with my cash flow. Highly recommended!"
     },
     {
       id: 5,
       name: "Michael",
       role: "Driver",
       image: "/man2.png",
       content: "Oga Driver has been a blessing to my family. The income from operating the tricycle has helped me support my children's education and improve our standard of living. The platform is reliable and trustworthy."
     },
     {
       id: 6,
       name: "Chinelo Henry",
       role: "Entrepreneur",
       image: "/man5.png",
       content: "As a woman entrepreneur, I was initially hesitant about getting into the transportation business. But Oga Driver's support and guidance made the process smooth. I now own 3 tricycles and my business is thriving."
     },
     {
       id: 7,
       name: "Hilary Ekis",
       role: "Fleet Manager",
       image: "/man7.png",
       content: "The maintenance support provided by Oga Driver is exceptional. They ensure that the vehicles are always in good working condition, which gives me peace of mind and helps maintain consistent income."
     },
     {
       id: 8,
       name: "Grace Adamu",
       role: "Driver",
       image: "/man6.png",
       content: "Managing my rides and payments through the Oga Driver app is so convenient. The interface is intuitive and I can track my earnings in real-time. It's made running my transportation business much more efficient."
     }
   ]

  const stats = [
    { label: "Active Drivers", value: "1,500+", numericValue: 1500, suffix: "+" },
    { label: "Tricycles Available", value: "2,500+", numericValue: 2500, suffix: "+" },
    { label: "Cities Covered", value: "15+", numericValue: 15, suffix: "+" },
    { label: "Happy Customers", value: "3,000+", numericValue: 3000, suffix: "+" }
  ]

  const categories = [
    { value: "all", label: "All Reviews" },
    { value: "oga", label: "OGA" },
    { value: "driver", label: "Driver" }
  ]

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.content.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-black py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              What Our <span className="text-orange-500">Customers</span> Say
            </h1>
            <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
              Real stories from real people who have transformed their lives, hustle and businesses with OGADRIVER.
            </p>
            
            {/* Animated Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">
                    <AnimatedCounter 
                      end={stat.numericValue} 
                      duration={2000 + index * 200}
                      suffix={stat.suffix}
                    />
                  </div>
                  <div className="text-gray-400 text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="bg-[#1A1A1A] py-8">
          <div className="container mx-auto px-4 py-6 bg-[#252525]">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-4xl mx-auto">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Input
                  type="text"
                  placeholder="Search for real people stories and reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#06050566] text-white pl-12 pr-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 w-full"
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
              <Button 
                onClick={() => setSelectedCategory("all")}
                className={`rounded-full px-6 py-2 font-medium ${
                  selectedCategory === "all" 
                    ? "bg-orange-500 text-black" 
                    : "bg-[#1A1A1A] text-white hover:bg-gray-700"
                }`}
              >
                All Reviews
              </Button>
              <Button 
                onClick={() => setSelectedCategory("oga")}
                className={`rounded-full px-6 py-2 font-medium ${
                  selectedCategory === "oga" 
                    ? "bg-orange-500 text-black" 
                    : "bg-[#1A1A1A] text-white hover:bg-gray-700"
                }`}
              >
                OGA
              </Button>
              <Button 
                onClick={() => setSelectedCategory("driver")}
                className={`rounded-full px-6 py-2 font-medium ${
                  selectedCategory === "driver" 
                    ? "bg-orange-500 text-black" 
                    : "bg-[#1A1A1A] text-white hover:bg-gray-700"
                }`}
              >
                Driver
              </Button>
              <Button className="bg-[#1A1A1A] text-white hover:bg-gray-700 rounded-full px-6 py-2 font-medium">
                All Filters
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-[#1A1A1A] p-6 rounded-2xl">
                  {/* Quote Content */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">
                    "{testimonial.content}"
                  </p>

                  {/* Avatar, Name and Role */}
                  <div className="flex items-center">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full mr-3 object-cover"
                    />
                    <div>
                      <h4 className="text-white font-semibold text-lg">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="bg-orange-500 rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                Ready to Join Our Success Stories?
              </h2>
              <p className="text-black/80 mb-8 max-w-2xl mx-auto">
                Start your journey with OGA Driver today and become part of our growing community of successful drivers and business owners.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-black text-white hover:bg-[#1A1A1A] px-8 py-3 rounded-lg font-semibold">
                  Get Started Today
                </Button>
                <Button className="bg-transparent border-2 border-black text-black hover:bg-black hover:text-white px-8 py-3 rounded-lg font-semibold">
                  Share Your Story
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}