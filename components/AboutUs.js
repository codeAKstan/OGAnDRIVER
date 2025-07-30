"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Shield, Users, Award, Target } from "lucide-react"
import { useState, useEffect, useRef } from "react"

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
    <div ref={counterRef} className="text-4xl font-bold text-orange-500 mb-2">
      {count.toLocaleString()}{suffix}
    </div>
  )
}

export default function AboutUs() {
  return (
    <section className="bg-black">
      {/* Hero Image Section */}
      <div className="relative">
        <Image
          src="/kekepark.jpg"
          alt="Keke Park Scene"
          layout="responsive"
          width={1920}
          height={800}
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-center">
          <h1 className="text-4xl md:text-6xl font-bold">
            About <span className="text-orange-500">Oga Driver</span>
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-gray-900 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-orange-500">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              To provide a transparent, reliable, and stress-free platform that empowers tricycle drivers 
              and owners while delivering exceptional transportation services to customers across Nigeria.
            </p>
          </div>
          <div className="bg-gray-900 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-orange-500">Our Vision</h2>
            <p className="text-gray-300 leading-relaxed">
              To become Africa's most trusted and innovative tricycle marketplace, 
              transforming urban mobility and creating sustainable economic opportunities for all stakeholders.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trust & Safety</h3>
              <p className="text-gray-400">
                We prioritize the safety and security of all our users through verified profiles and secure transactions.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-400">
                Building strong relationships within the tricycle community and fostering mutual growth.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-gray-400">
                Delivering exceptional service quality and continuously improving our platform.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-400">
                Embracing technology to create innovative solutions for modern transportation challenges.
              </p>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Founded with a vision to transform Nigeria's transportation landscape, Oga Driver emerged 
              from the need to create a reliable, transparent platform for tricycle services.
            </p>
            <p className="text-gray-300 mb-4 leading-relaxed">
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
              alt="Tricycle lineup"
              width={500}
              height={400}
              className="w-full rounded-lg"
            />
          </div>
        </div>

        {/* Animated Statistics */}
        <div className="bg-gray-900 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <AnimatedCounter end="5000" suffix="+" />
              <p className="text-gray-300">Active Drivers</p>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <AnimatedCounter end="2500" suffix="+" />
              <p className="text-gray-300">Tricycles Available</p>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <AnimatedCounter end="15" suffix="+" />
              <p className="text-gray-300">Cities Covered</p>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <AnimatedCounter end="50000" suffix="+" />
              <p className="text-gray-300">Happy Customers</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Join the Oga Driver Community</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Whether you're a driver looking for opportunities or a customer needing reliable transportation, 
            we're here to serve you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-orange-500 hover:bg-orange-600 text-black px-8 py-6 rounded-lg text-lg">
              Get Started Today
            </Button>
            <Button
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800 px-8 py-6 rounded-lg text-lg bg-transparent"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}