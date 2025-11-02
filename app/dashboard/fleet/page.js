"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import apiService from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, ArrowLeft } from "lucide-react"

export default function FleetPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [vehicles, setVehicles] = useState([])
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editVehicle, setEditVehicle] = useState(null)
  const [editForm, setEditForm] = useState({
    vehicle_type: '',
    model_name: '',
    registration_number: '',
    total_cost: '',
    repayment_duration: '',
    photo: null,
  })

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

  const openEdit = (v) => {
    setEditVehicle(v)
    setEditForm({
      vehicle_type: v.vehicle_type || '',
      model_name: v.model_name || '',
      registration_number: v.registration_number || '',
      total_cost: String(v.total_cost || ''),
      repayment_duration: '',
      photo: null,
    })
    setIsEditOpen(true)
  }

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleEditFileChange = (e) => {
    const file = e.target.files?.[0] || null
    setEditForm((prev) => ({ ...prev, photo: file }))
  }

  // Repayment plans mapping and calculation for edit form
  const repaymentPlans = {
    '12': { months: 12, weeks: 52, rate: 0.30 },
    '18': { months: 18, weeks: 78, rate: 0.45 },
    '24': { months: 24, weeks: 104, rate: 0.50 },
  }
  const computeReceivableEdit = () => {
    const cost = parseFloat(editForm.total_cost || 0)
    const plan = repaymentPlans[editForm.repayment_duration]
    if (!plan || !cost || cost <= 0) return 0
    return cost * (1 + plan.rate)
  }

  const handleSaveEdit = async () => {
    if (!editVehicle) return
    try {
      const payload = {
        vehicle_type: editForm.vehicle_type,
        model_name: editForm.model_name.trim(),
        registration_number: editForm.registration_number.trim(),
        total_cost: parseFloat(editForm.total_cost),
        repayment_duration: editForm.repayment_duration ? parseInt(editForm.repayment_duration, 10) : undefined,
      }

      // If photo updated, upload to Blob and include photo_url
      if (editForm.photo) {
        const file = editForm.photo
        const uploadRes = await fetch(`/api/blob/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          body: file,
        })
        const blob = await uploadRes.json().catch(() => null)
        if (!uploadRes.ok || !blob?.url) {
          throw new Error('Image upload failed')
        }
        payload.photo_url = blob.url
      }

      await apiService.updateVehicle(editVehicle.id, payload)
      // Refresh list
      const data = await apiService.getVehicles(user.id)
      setVehicles(Array.isArray(data) ? data : (data?.results || []))
      setIsEditOpen(false)
      setEditVehicle(null)
    } catch (error) {
      console.error('Failed to update vehicle:', error)
      alert(error.message || 'Update failed')
    }
  }

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
                      <div className="pt-2">
                        {v.driver ? (
                          <span className="text-xs text-gray-500">Assigned — editing locked</span>
                        ) : (
                          <Button variant="outline" className="border-gray-600 text-black hover:bg-gray-800" onClick={() => openEdit(v)}>
                            Edit Vehicle
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Vehicle Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Vehicle</DialogTitle>
              <DialogDescription className="text-gray-400">Update details for your vehicle. Editing is only allowed if not assigned.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="vehicle_type" className="text-white">Vehicle Type</Label>
                <Select value={editForm.vehicle_type} onValueChange={(v) => handleEditChange('vehicle_type', v)}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="KEKE">Tricycle (Keke)</SelectItem>
                    <SelectItem value="BUS">Bus</SelectItem>
                    <SelectItem value="BIKE">Motorcycle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="model_name" className="text-white">Model Name</Label>
                <Input id="model_name" value={editForm.model_name} onChange={(e) => handleEditChange('model_name', e.target.value)} className="bg-gray-800 border-gray-600 text-white" />
              </div>

              <div>
                <Label htmlFor="registration_number" className="text-white">Registration Number</Label>
                <Input id="registration_number" value={editForm.registration_number} onChange={(e) => handleEditChange('registration_number', e.target.value)} className="bg-gray-800 border-gray-600 text-white" />
              </div>

              <div>
                <Label htmlFor="total_cost" className="text-white">Total Cost (₦)</Label>
                <Input id="total_cost" type="number" value={editForm.total_cost} onChange={(e) => handleEditChange('total_cost', e.target.value)} className="bg-gray-800 border-gray-600 text-white" />
              </div>

              <div>
                <Label htmlFor="repayment_duration" className="text-white">Repayment Duration</Label>
                <Select value={editForm.repayment_duration} onValueChange={(v) => handleEditChange('repayment_duration', v)}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="12">12 months (52 weeks) — 30% interest</SelectItem>
                    <SelectItem value="18">18 months (78 weeks) — 45% interest</SelectItem>
                    <SelectItem value="24">24 months (104 weeks) — 50% interest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Total Amount Receivable (₦)</Label>
                <Input
                  value={computeReceivableEdit() ? Number(computeReceivableEdit()).toLocaleString() : ''}
                  disabled
                  placeholder="Displays after selecting duration"
                  className="bg-gray-800 border-gray-600 text-white"
                />
                <p className="text-xs text-gray-500 mt-1">Amount of vehicle + interest based on duration</p>
              </div>

              <div>
                <Label htmlFor="photo" className="text-white">Vehicle Photo</Label>
                <Input id="photo" type="file" accept="image/*" onChange={handleEditFileChange} className="bg-gray-800 border-gray-600 text-white file:bg-orange-500 file:text-black file:border-0 file:rounded file:px-3 file:py-1 file:mr-3 hover:file:bg-orange-600" />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-black" onClick={handleSaveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}