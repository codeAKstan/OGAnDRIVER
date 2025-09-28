"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import Image from "next/image"
import { 
  Car, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Settings, 
  LogOut,
  Bell,
  Search
} from "lucide-react"
import { useRouter } from "next/navigation"
import apiService from "@/lib/api"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false)
  const [vehicleForm, setVehicleForm] = useState({
    vehicle_type: '',
    model_name: '',
    registration_number: '',
    photo_url: '',
    total_cost: '',
    amount_paid: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Check if user is logged in and has the right role
    const userData = localStorage.getItem('user')
    const userRole = localStorage.getItem('userRole')
    
    if (!userData || userRole !== 'OGA') {
      router.push('/login')
      return
    }
    
    setUser(JSON.parse(userData))
    setLoading(false)
  }, [])

  const handleLogout = async () => {
    try {
      await apiService.logoutUser()
      localStorage.removeItem('user')
      localStorage.removeItem('userRole')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Force logout even if API call fails
      localStorage.removeItem('user')
      localStorage.removeItem('userRole')
      router.push('/login')
    }
  }

  const handleVehicleFormChange = (field, value) => {
    setVehicleForm(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!vehicleForm.vehicle_type) {
      errors.vehicle_type = 'Vehicle type is required'
    }
    
    if (!vehicleForm.model_name.trim()) {
      errors.model_name = 'Model name is required'
    }
    
    if (!vehicleForm.registration_number.trim()) {
      errors.registration_number = 'Registration number is required'
    }
    
    if (!vehicleForm.total_cost || parseFloat(vehicleForm.total_cost) <= 0) {
      errors.total_cost = 'Valid total cost is required'
    }
    
    if (vehicleForm.amount_paid && parseFloat(vehicleForm.amount_paid) < 0) {
      errors.amount_paid = 'Amount paid cannot be negative'
    }
    
    if (vehicleForm.amount_paid && parseFloat(vehicleForm.amount_paid) > parseFloat(vehicleForm.total_cost)) {
      errors.amount_paid = 'Amount paid cannot exceed total cost'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddVehicle = async () => {
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const vehicleData = {
        ...vehicleForm,
        total_cost: parseFloat(vehicleForm.total_cost),
        amount_paid: vehicleForm.amount_paid ? parseFloat(vehicleForm.amount_paid) : 0,
        owner: user.id
      }
      
      await apiService.addVehicle(vehicleData)
      
      // Reset form and close modal
      setVehicleForm({
        vehicle_type: '',
        model_name: '',
        registration_number: '',
        photo_url: '',
        total_cost: '',
        amount_paid: ''
      })
      setIsAddVehicleOpen(false)
      
      // Show success message (you might want to add a toast notification here)
      alert('Vehicle added successfully!')
      
    } catch (error) {
      console.error('Error adding vehicle:', error)
      alert('Failed to add vehicle. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/logo.png"
                  alt="OGA Driver Logo"
                  width={120}
                  height={120}
                  className="object-contain"
                />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-orange-500">Oga Dashboard</h1>
                <p className="text-sm text-gray-400">Welcome back, {user?.first_name}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Settings className="w-4 h-4" />
              </Button>
              <Button 
                onClick={handleLogout}
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-red-400"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Vehicles</CardTitle>
              <Car className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">0</div>
              <p className="text-xs text-gray-500">No vehicles yet</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Drivers</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">0</div>
              <p className="text-xs text-gray-500">No drivers assigned</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Investment</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₦0</div>
              <p className="text-xs text-gray-500">Ready to invest</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Monthly Returns</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₦0</div>
              <p className="text-xs text-gray-500">No returns yet</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-gray-400">
                Get started with your investment journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-black">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Vehicle
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-white">Add New Vehicle</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Enter the details of your vehicle to add it to your fleet.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="vehicle_type" className="text-white">Vehicle Type</Label>
                      <Select 
                        value={vehicleForm.vehicle_type} 
                        onValueChange={(value) => handleVehicleFormChange('vehicle_type', value)}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="tricycle">Tricycle (Keke)</SelectItem>
                          <SelectItem value="bus">Bus</SelectItem>
                          <SelectItem value="bike">Motorcycle</SelectItem>
                          <SelectItem value="car">Car</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.vehicle_type && (
                        <p className="text-red-400 text-sm mt-1">{formErrors.vehicle_type}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="model_name" className="text-white">Model Name</Label>
                      <Input
                        id="model_name"
                        value={vehicleForm.model_name}
                        onChange={(e) => handleVehicleFormChange('model_name', e.target.value)}
                        placeholder="e.g., Toyota Hiace, Bajaj RE"
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      />
                      {formErrors.model_name && (
                        <p className="text-red-400 text-sm mt-1">{formErrors.model_name}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="registration_number" className="text-white">Registration Number</Label>
                      <Input
                        id="registration_number"
                        value={vehicleForm.registration_number}
                        onChange={(e) => handleVehicleFormChange('registration_number', e.target.value)}
                        placeholder="e.g., ABC-123-XY"
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      />
                      {formErrors.registration_number && (
                        <p className="text-red-400 text-sm mt-1">{formErrors.registration_number}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="total_cost" className="text-white">Total Cost (₦)</Label>
                      <Input
                        id="total_cost"
                        type="number"
                        value={vehicleForm.total_cost}
                        onChange={(e) => handleVehicleFormChange('total_cost', e.target.value)}
                        placeholder="e.g., 2500000"
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      />
                      {formErrors.total_cost && (
                        <p className="text-red-400 text-sm mt-1">{formErrors.total_cost}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="amount_paid" className="text-white">Amount Paid (₦) - Optional</Label>
                      <Input
                        id="amount_paid"
                        type="number"
                        value={vehicleForm.amount_paid}
                        onChange={(e) => handleVehicleFormChange('amount_paid', e.target.value)}
                        placeholder="e.g., 1000000"
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      />
                      {formErrors.amount_paid && (
                        <p className="text-red-400 text-sm mt-1">{formErrors.amount_paid}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="photo_url" className="text-white">Photo URL - Optional</Label>
                      <Input
                        id="photo_url"
                        value={vehicleForm.photo_url}
                        onChange={(e) => handleVehicleFormChange('photo_url', e.target.value)}
                        placeholder="https://example.com/vehicle-photo.jpg"
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddVehicleOpen(false)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddVehicle}
                      disabled={isSubmitting}
                      className="bg-orange-500 hover:bg-orange-600 text-black"
                    >
                      {isSubmitting ? 'Adding...' : 'Add Vehicle'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" className="w-full border-gray-600 text-black hover:bg-gray-800">
                <Search className="w-4 h-4 mr-2" />
                Find Drivers
              </Button>
              <Button variant="outline" className="w-full border-gray-600 text-black hover:bg-gray-800">
                <DollarSign className="w-4 h-4 mr-2" />
                View Financial Reports
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-gray-400">
                Your latest transactions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">
                  <TrendingUp className="w-12 h-12 mx-auto opacity-50" />
                </div>
                <p className="text-gray-400">No recent activity</p>
                <p className="text-sm text-gray-500 mt-2">
                  Start by adding your first vehicle to see activity here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Guide */}
        <Card className="bg-gradient-to-r from-orange-900/20 to-orange-800/20 border-orange-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <span className="bg-orange-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">!</span>
              Getting Started as an Oga
            </CardTitle>
            <CardDescription className="text-gray-300">
              Follow these steps to start your investment journey with Oga Driver
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                <div className="bg-orange-500 text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-3">1</div>
                <h3 className="font-semibold text-white mb-2">Add Vehicles</h3>
                <p className="text-sm text-gray-400">Register your tricycles, buses, or bikes to start earning</p>
              </div>
              <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                <div className="bg-orange-500 text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-3">2</div>
                <h3 className="font-semibold text-white mb-2">Find Drivers</h3>
                <p className="text-sm text-gray-400">Connect with verified drivers to operate your vehicles</p>
              </div>
              <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                <div className="bg-orange-500 text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-3">3</div>
                <h3 className="font-semibold text-white mb-2">Earn Returns</h3>
                <p className="text-sm text-gray-400">Start receiving monthly payments from your drivers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}