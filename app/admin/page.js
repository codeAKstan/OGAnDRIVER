"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import apiService from "@/lib/api"
import { Users, Shield, Car, FileCheck, LogOut, ExternalLink } from "lucide-react"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [vehicleCount, setVehicleCount] = useState(0)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const userRole = localStorage.getItem('userRole')
    if (!userData || userRole !== 'ADMIN') {
      router.push('/admin/login')
      return
    }
    setUser(JSON.parse(userData))
    setLoading(false)
  }, [router])

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await apiService.getVehicles()
        const list = Array.isArray(res) ? res : (res?.results || [])
        setVehicleCount(list.length)
      } catch (e) {
        console.error('Failed to load vehicles for admin dashboard:', e)
      }
    }
    fetchVehicles()
  }, [])

  const handleLogout = async () => {
    try {
      await apiService.logoutUser()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('user')
      localStorage.removeItem('userRole')
      router.push('/admin/login')
    }
  }

  const openDjangoAdmin = () => {
    const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api')
    const adminUrl = base.replace(/\/api$/, '/admin/')
    window.open(adminUrl, '_blank')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading…</div>
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-gray-400">Welcome, {user?.first_name || user?.username}. Manage platform operations.</p>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Car className="w-5 h-5" /> Vehicles</CardTitle>
              <CardDescription>Total registered vehicles across the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{vehicleCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5" /> KYC</CardTitle>
              <CardDescription>View and approve KYC submissions in Django Admin.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={openDjangoAdmin} className="bg-orange-500 hover:bg-orange-600 text-black">
                Open Django Admin <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileCheck className="w-5 h-5" /> Applications</CardTitle>
              <CardDescription>Manage driver applications and decisions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={openDjangoAdmin} className="bg-orange-500 hover:bg-orange-600 text-black">
                Manage in Admin <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Button variant="ghost" className="text-gray-300 hover:text-white" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </main>
    </div>
  )
}