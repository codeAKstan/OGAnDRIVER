"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import apiService from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car, ArrowLeft } from "lucide-react"

export default function FleetPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [vehicles, setVehicles] = useState([])
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const userRole = localStorage.getItem('userRole')
    if (!userData || userRole !== 'OGA') {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userData))
    setLoading(false)
  }, [router])

  useEffect(() => {
    const loadVehicles = async () => {
      if (!user?.id) return
      setIsLoadingVehicles(true)
      try {
        const data = await apiService.getVehicles(user.id)
        const list = Array.isArray(data) ? data : (data?.results || [])
        setVehicles(list)
      } catch (error) {
        console.error('Failed to load vehicles:', error)
      } finally {
        setIsLoadingVehicles(false)
      }
    }
    loadVehicles()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading fleet...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-orange-500">Your Fleet</h1>
          <Link href="/dashboard">
            <Button variant="outline" className="border-gray-600 text-black hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Car className="w-5 h-5 mr-2 text-orange-500" />
              Fleet Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingVehicles ? (
              <p className="text-gray-400">Loading vehicles...</p>
            ) : vehicles.length === 0 ? (
              <p className="text-gray-400">No vehicles yet. Add your first vehicle from the dashboard.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((v) => (
                  <div key={v.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                    <div className="relative h-40 w-full bg-gray-700">
                      <Image
                        src={v.photo_url || '/placeholder.jpg'}
                        alt={`${v.model_name} photo`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">{v.model_name}</h3>
                        <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">{v.vehicle_type}</span>
                      </div>
                      <p className="text-sm text-gray-400">Reg: {v.registration_number}</p>
                      <p className="text-sm text-gray-400">Status: {v.is_active ? 'Active' : 'Inactive'}</p>
                      <p className="text-sm text-gray-400">Paid: ₦{Number(v.amount_paid).toLocaleString()} / ₦{Number(v.total_cost).toLocaleString()}</p>
                      <p className="text-sm text-gray-400">Fully Paid: {v.is_fully_paid ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}