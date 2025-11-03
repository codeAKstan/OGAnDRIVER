"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import apiService from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: "", text: "" })
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setMessage({ type: "error", text: "Please fill in all fields" })
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await apiService.loginUser({
        email: formData.email,
        password: formData.password
      })
      
      setMessage({ 
        type: "success", 
        text: "Login successful! Redirecting..." 
      })
      
      // Store user data in localStorage for session management
      localStorage.setItem('user', JSON.stringify(response.user))
      localStorage.setItem('userRole', response.role)
      
      // Role-based redirect (includes ADMIN)
      setTimeout(() => {
        if (response.role === 'ADMIN') {
          router.push('/admin')
        } else if (response.role === 'OGA') {
          router.push('/dashboard')
        } else if (response.role === 'DRIVER') {
          router.push('/kyc')
        } else {
          router.push('/dashboard') // fallback
        }
      }, 1500)
      
    } catch (error) {
      console.error('Login error:', error)
      let errorMessage = "Something went wrong. Please try again."
      
      // Handle specific error messages from the backend
      if (error.message === 'Invalid credentials') {
        errorMessage = "The email or password you entered is incorrect. Please double-check your credentials and try again. If you don't have an account, please sign up first."
      } else if (error.message.includes('email')) {
        errorMessage = "Please enter a valid email address."
      } else if (error.message.includes('password')) {
        errorMessage = "Password is required."
      } else if (error.message.includes('400')) {
        errorMessage = "Please check your input and try again."
      } else if (error.message.includes('500')) {
        errorMessage = "Server error. Please try again later."
      } else if (error.message.includes('Network') || error.message.includes('fetch')) {
        errorMessage = "Network error. Please check your internet connection and try again."
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
              Welcome back to <span className="text-orange-500">Oga Driver</span>
            </h1>
            <p className="text-gray-400">
              Sign in to your account to continue
            </p>
          </div>

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

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-700 rounded bg-gray-900"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="#" className="text-orange-500 hover:text-orange-400">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-black py-6 text-lg font-semibold"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link href="/signup" className="text-orange-500 hover:text-orange-400">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              By signing in, you agree to our{" "}
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