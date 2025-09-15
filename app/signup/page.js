"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, User, Mail, Phone, Lock, Download, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import apiService from "@/lib/api"

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userType, setUserType] = useState("driver") // driver, oga
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
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

  const generateUsername = (email) => {
    return email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
  }

  const validateForm = () => {
    const errors = []
    
    if (!formData.firstName.trim()) errors.push("First name is required")
    if (!formData.lastName.trim()) errors.push("Last name is required")
    if (!formData.email.trim()) errors.push("Email is required")
    if (!formData.phone.trim()) errors.push("Phone number is required")
    if (formData.password.length < 8) errors.push("Password must be at least 8 characters")
    if (formData.password !== formData.confirmPassword) errors.push("Passwords do not match")
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push("Please enter a valid email address")
    }
    
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: "", text: "" })
    
    // Validate form
    const errors = validateForm()
    if (errors.length > 0) {
      setMessage({ type: "error", text: errors[0] })
      return
    }
    
    setIsLoading(true)
    
    try {
      // Prepare data for backend
      const registrationData = {
        username: generateUsername(formData.email),
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phone,
        role: userType === "oga" ? "OGA" : "DRIVER",
        password: formData.password,
        password_confirm: formData.confirmPassword
      }
      
      const response = await apiService.registerUser(registrationData)
      
      setMessage({ 
        type: "success", 
        text: "Account created successfully! Redirecting to login..." 
      })
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push('/login')
      }, 2000)
      
    } catch (error) {
      console.error('Registration error:', error)
      let errorMessage = "Registration failed. Please try again."
      
      if (error.message.includes('email')) {
        errorMessage = "An account with this email already exists."
      } else if (error.message.includes('username')) {
        errorMessage = "Username is already taken. Please try a different email."
      } else if (error.message.includes('password')) {
        errorMessage = "Password does not meet requirements."
      }
      
      setMessage({ type: "error", text: errorMessage })
    } finally {
      setIsLoading(false)
    }
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

          {/* Message Display */}
          {message.text && (
            <div className={`p-4 rounded-lg border flex items-center space-x-2 mb-6 ${
              message.type === "success" 
                ? "bg-green-900/20 border-green-500 text-green-400" 
                : "bg-red-900/20 border-red-500 text-red-400"
            }`}>
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span>{message.text}</span>
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
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-black py-6 text-lg font-semibold"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
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