"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Shield, Users, Award, Target } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = "" }) {
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

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime
    const startValue = 0
    const endValue = parseInt(end.toString().replace(/[^0-9]/g, ''))

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeOutQuart * endValue)
      
      setCount(currentCount)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <div ref={counterRef} className="text-4xl font-bold text-white mb-2">
      {count.toLocaleString()}{suffix}
    </div>
  )
}

export default function AboutUs() {
  return (
    <section className="bg-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Empowering <span className="text-orange-500">Nigeria's</span>
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Keke Owners and Drivers
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Our platform brings keke gap between vehicle owners and drivers, making every hire purchase deal secure, and transparent.
          </p>
        </div>

        {/* Hero Image and Mission/Vision */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative">
            <Image
              src="/kekepark.png"
              alt="Keke lineup"
              width={400}
              height={200}
              className="w-full rounded-lg"
            />
          </div>
          
          <div className="space-y-8">
            {/* Mission */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                <h3 className="text-xl font-bold text-orange-500">Our Mission</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                To provide reliable, safe, and cost-effective transportation solutions that connect communities across Nigeria.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                <h3 className="text-xl font-bold text-orange-500">Our Vision</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                To become Africa's most trusted and innovative transportation platform, transforming urban mobility across Nigeria.
              </p>
            </div>

            <Link href="/hire-rent">
              <Button className="bg-orange-500 hover:bg-orange-600 text-black px-8 py-3 rounded-lg font-semibold">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Know More About Our Core Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Know More About
            </h2>
            <h3 className="text-3xl font-bold">
              Our Core <span className="text-orange-500">Values</span>
            </h3>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors">
                <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-black" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Trust & Safety</h4>
                <p className="text-gray-400 text-sm">
                  We prioritize the safety and security of all our users through verified profiles.
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors">
                <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-black" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Community</h4>
                <p className="text-gray-400 text-sm">
                  Building strong relationships within the tricycle community and fostering growth.
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors">
                <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-black" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Excellence</h4>
                <p className="text-gray-400 text-sm">
                  Delivering exceptional service quality and continuously improving our platform.
                </p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition-colors">
                <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-black" />
                </div>
                <h4 className="text-lg font-semibold mb-2">Innovation</h4>
                <p className="text-gray-400 text-sm">
                  Embracing technology to create innovative solutions for transportation challenges.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8">
            Our <span className="text-orange-500">Story</span>
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <p className="text-gray-300 leading-relaxed">
                Founded with a vision to transform Nigeria's transportation landscape, OGA DRIVER emerged 
                from the need to create a reliable, transparent platform for tricycle services.
              </p>
              
              <p className="text-gray-300 leading-relaxed">
                We recognized the challenges faced by drivers in finding quality vehicles and owners 
                in connecting with reliable drivers. Our platform bridges this gap, creating opportunities 
                for sustainable income and growth.
              </p>
              
              <p className="text-gray-300 leading-relaxed">
                Today, we're proud to serve communities across Nigeria, empowering thousands of drivers 
                and connecting them with customers who need reliable transportation services.
              </p>
            </div>
            
            <div className="relative">
              <Image
                src="/tricycle-lineup.png"
                alt="Keke park scene"
                width={500}
                height={400}
                className="w-full rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gray-900 rounded-lg p-8 mb-20">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <AnimatedCounter end="1500" suffix="+" />
              <p className="text-gray-300">Active Drivers</p>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <AnimatedCounter end="2500" suffix="+" />
              <p className="text-gray-300">Keke Available</p>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <AnimatedCounter end="15" suffix="+" />
              <p className="text-gray-300">Cities Covered</p>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <AnimatedCounter end="3000" suffix="+" />
              <p className="text-gray-300">Happy Customers</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-orange-500 rounded-lg p-8 text-center text-black">
          <h2 className="text-3xl font-bold mb-4">Join the OGAnDRIVER Community</h2>
          <p className="text-lg mb-6 opacity-90">
            Whether you're a driver looking for opportunities or a customer needing 
            reliable transportation, we're here to serve you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold">
                Get Started Today
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                variant="outline" 
                className="border-black text-black hover:bg-black hover:text-white px-8 py-3 rounded-lg font-semibold bg-transparent"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}