"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import apiService from "@/lib/api"

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: "", text: "" })

    if (!formData.email || !formData.password) {
      setMessage({ type: "error", text: "Please fill in all fields" })
      return
    }

    setIsLoading(true)
    try {
      const res = await apiService.loginUser({ email: formData.email, password: formData.password })
      if (res?.role !== 'ADMIN') {
        setMessage({ type: "error", text: "Access denied. This account is not an admin." })
        return
      }
      localStorage.setItem('user', JSON.stringify(res.user))
      localStorage.setItem('userRole', res.role)
      setMessage({ type: "success", text: "Login successful! Redirecting..." })
      setTimeout(() => router.push('/admin'), 1000)
    } catch (error) {
      console.error('Admin login error:', error)
      const text = error?.message === 'Invalid credentials' ? 'Invalid email or password' : 'Login failed. Please try again.'
      setMessage({ type: "error", text })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md p-6 border border-gray-800 rounded-lg bg-gray-900">
        <h1 className="text-2xl font-semibold mb-2">Admin Login</h1>
        <p className="text-sm text-gray-400 mb-4">Sign in with your admin credentials.</p>
        {message.text && (
          <div className={`mb-4 text-sm ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>{message.text}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="admin@example.com" className="bg-gray-800 border-gray-700 text-white" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" className="bg-gray-800 border-gray-700 text-white" />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full bg-orange-500 hover:bg-orange-600 text-black">
            {isLoading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}