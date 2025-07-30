"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, User, Mail, Phone, Lock, Download } from "lucide-react"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userType, setUserType] = useState("driver") // driver, oga
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", { ...formData, userType })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="OGA Driver Logo"
                width={154}
                height={154}
                className="object-contain"
              />
            </Link>
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Join <span className="text-orange-500">Oga Driver</span>
            </h1>
            <p className="text-gray-400">
              Create your account and start your journey with us
            </p>
          </div>

          {/* User Type Selection */}
          <div className="mb-6">
            <Label className="text-white mb-3 block">I want to join as:</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setUserType("driver")}
                className={`p-4 rounded-lg border text-sm font-medium transition-colors ${
                  userType === "driver"
                    ? "bg-orange-500 text-black border-orange-500"
                    : "bg-gray-900 text-white border-gray-700 hover:border-gray-600"
                }`}
              >
                Driver
              </button>
              <button
                type="button"
                onClick={() => setUserType("oga")}
                className={`p-4 rounded-lg border text-sm font-medium transition-colors ${
                  userType === "oga"
                    ? "bg-orange-500 text-black border-orange-500"
                    : "bg-gray-900 text-white border-gray-700 hover:border-gray-600"
                }`}
              >
                Oga (Investor)
              </button>
            </div>
          </div>

          {/* Download App Button for Drivers */}
          {userType === "driver" && (
            <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2 text-orange-500">Driver App Available</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Download our mobile app for the best driver experience
                </p>
                <Button 
                  type="button"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 mx-auto"
                  onClick={() => {
                    // Handle app download logic here
                    alert("Coming soon...")
                  }}
                >
                  <Download className="w-4 h-4" />
                  <span>Download App</span>
                </Button>
              </div>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-white mb-2 block">
                  First Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="bg-gray-900 border-gray-700 text-white pl-10 focus:border-orange-500"
                    placeholder="John"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="lastName" className="text-white mb-2 block">
                  Last Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="bg-gray-900 border-gray-700 text-white pl-10 focus:border-orange-500"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-white mb-2 block">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-gray-900 border-gray-700 text-white pl-10 focus:border-orange-500"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-white mb-2 block">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="bg-gray-900 border-gray-700 text-white pl-10 focus:border-orange-500"
                  placeholder="+234 xxx xxx xxxx"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-white mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-gray-900 border-gray-700 text-white pl-10 pr-10 focus:border-orange-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-white mb-2 block">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="bg-gray-900 border-gray-700 text-white pl-10 pr-10 focus:border-orange-500"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-black py-6 text-lg font-semibold"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-orange-500 hover:text-orange-400">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              By creating an account, you agree to our{" "}
              <Link href="#" className="text-orange-500 hover:text-orange-400">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-orange-500 hover:text-orange-400">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}