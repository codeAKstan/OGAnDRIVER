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
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [vehicleCount, setVehicleCount] = useState(0)
  const [totalInvestment, setTotalInvestment] = useState(0)
  const [amountReceived, setAmountReceived] = useState(0)
  const [totalReceivable, setTotalReceivable] = useState(0)
  const [weeklyReturns, setWeeklyReturns] = useState(0)
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false)
  const [vehicleForm, setVehicleForm] = useState({
    vehicle_type: '',
    model_name: '',
    registration_number: '',
    photo: null,
    total_cost: '',
    repayment_duration: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Repayment plans mapping
  const repaymentPlans = {
    '12': { months: 12, weeks: 52, rate: 0.30 },
    '18': { months: 18, weeks: 78, rate: 0.45 },
    '24': { months: 24, weeks: 104, rate: 0.50 },
  }

  // Notifications: fetch list and compute unread
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) return
      try {
        const res = await apiService.getNotifications(user.id)
        const items = Array.isArray(res?.items) ? res.items : []
        setNotifications(items)
        setUnreadCount(items.filter(n => !n.is_read).length)
      } catch (e) {
        console.error('Failed to fetch notifications:', e)
        setNotifications([])
        setUnreadCount(0)
      }
    }
    fetchNotifications()
  }, [user])

  const toggleNotifications = () => setIsNotifOpen(prev => !prev)
  const markAllRead = async () => {
    if (!user?.id) return
    try {
      await apiService.markNotificationsRead(user.id)
      // Refresh list
      const res = await apiService.getNotifications(user.id)
      const items = Array.isArray(res?.items) ? res.items : []
      setNotifications(items)
      setUnreadCount(items.filter(n => !n.is_read).length)
    } catch (e) {
      console.error('Failed to mark notifications read:', e)
    }
  }

  const computeReceivable = () => {
    const cost = parseFloat(vehicleForm.total_cost || 0)
    const plan = repaymentPlans[vehicleForm.repayment_duration]
    if (!plan || !cost || cost <= 0) return 0
    return cost * (1 + plan.rate)
  }

  const formatNGN = (amount) => {
    const n = Number(amount || 0)
    try {
      return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(n)
    } catch {
      return `₦${n.toLocaleString('en-NG')}`
    }
  }

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

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        if (!user?.id) return
        const vehicles = await apiService.getVehicles(user.id)
        const list = Array.isArray(vehicles) ? vehicles : (vehicles?.results || [])
        setVehicleCount(list.length)
        const total = list.reduce((acc, v) => acc + parseFloat(v?.total_cost ?? 0), 0)
        setTotalInvestment(total)
        const received = list.reduce((acc, v) => acc + parseFloat(v?.amount_paid ?? 0), 0)
        setAmountReceived(received)
        // Total receivable from backend (vehicle cost + interest)
        const receivable = list.reduce((acc, v) => acc + parseFloat(v?.total_receivable ?? 0), 0)
        setTotalReceivable(receivable)
        // Weekly returns from backend (sum of weekly_returns field)
        const weekly = list.reduce((acc, v) => acc + parseFloat(v?.weekly_returns ?? 0), 0)
        setWeeklyReturns(weekly)
      } catch (error) {
        console.error('Failed to load vehicles:', error)
      }
    }
    fetchVehicles()
  }, [user])

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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        setFormErrors(prev => ({
          ...prev,
          photo: 'Please select a valid image file (JPEG, PNG, WebP)'
        }))
        return
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({
          ...prev,
          photo: 'File size must be less than 5MB'
        }))
        return
      }
      
      setVehicleForm(prev => ({
        ...prev,
        photo: file
      }))
      
      // Clear error when valid file is selected
      if (formErrors.photo) {
        setFormErrors(prev => ({
          ...prev,
          photo: ''
        }))
      }
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
    
    if (!vehicleForm.photo) {
      errors.photo = 'Vehicle photo is required'
    }
    
    if (!vehicleForm.repayment_duration) {
      errors.repayment_duration = 'Please select a repayment duration'
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
      // Upload image to Vercel Blob first
      const file = vehicleForm.photo
      const uploadRes = await fetch(`/api/blob/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      })

      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({ error: 'Upload failed' }))
        throw new Error(err.error || 'Image upload failed')
      }

      const blob = await uploadRes.json()
      const photoUrl = blob.url

      // Prepare JSON payload for Django backend
      const payload = {
        vehicle_type: vehicleForm.vehicle_type,
        model_name: vehicleForm.model_name,
        registration_number: vehicleForm.registration_number,
        photo_url: photoUrl,
        total_cost: parseFloat(vehicleForm.total_cost),
        repayment_duration: parseInt(vehicleForm.repayment_duration, 10),
        owner: user.id,
      }

      await apiService.addVehicle(payload)

      // Reset form and close modal
      setVehicleForm({
        vehicle_type: '',
        model_name: '',
        registration_number: '',
        photo: null,
        total_cost: '',
        repayment_duration: ''
      })
      setIsAddVehicleOpen(false)

      // Refresh vehicle count
      try {
        const updated = await apiService.getVehicles(user.id)
        const list = Array.isArray(updated) ? updated : (updated?.results || [])
        setVehicleCount(list.length)
        const total = list.reduce((acc, v) => acc + parseFloat(v?.total_cost ?? 0), 0)
        setTotalInvestment(total)
        const received = list.reduce((acc, v) => acc + parseFloat(v?.amount_paid ?? 0), 0)
        setAmountReceived(received)
        const receivable = list.reduce((acc, v) => acc + parseFloat(v?.total_receivable ?? 0), 0)
        setTotalReceivable(receivable)
        const weekly = list.reduce((acc, v) => acc + parseFloat(v?.weekly_returns ?? 0), 0)
        setWeeklyReturns(weekly)
      } catch (e) {
        console.error('Failed to refresh vehicle count:', e)
      }

      alert('Vehicle added successfully!')

    } catch (error) {
      console.error('Error adding vehicle:', error)
      alert(error.message || 'Failed to add vehicle. Please try again.')
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
            
            <div className="flex items-center space-x-4 relative">
              <button
                className="relative text-gray-400 hover:text-white"
                aria-label="Notifications"
                onClick={toggleNotifications}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </button>
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

              {isNotifOpen && (
                <div className="absolute right-0 top-10 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
                    <div className="text-sm text-white">Notifications</div>
                    <button
                      className="text-xs text-orange-400 hover:text-orange-300"
                      onClick={markAllRead}
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-3 py-4 text-sm text-gray-400">No notifications</div>
                    ) : notifications.map((n) => (
                      <div key={n.id} className="px-3 py-3 border-b border-gray-800 hover:bg-gray-800">
                        <div className="text-sm text-white">{n.title}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{n.message}</div>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${n.is_read ? 'bg-gray-700 text-gray-300' : 'bg-blue-700 text-white'}`}>
                            {n.is_read ? 'READ' : 'NEW'}
                          </span>
                          {n.application?.id ? (
                            <Link href={`/dashboard/review-drivers/${n.application.id}`} className="text-xs text-orange-400 hover:text-orange-300">
                              View application
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              <div className="text-2xl font-bold text-white">{vehicleCount}</div>
              <p className="text-xs text-gray-500">{vehicleCount === 0 ? 'No vehicles yet' : 'Your registered vehicles'}</p>
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
              <div className="text-2xl font-bold text-white">{formatNGN(totalInvestment)}</div>
              <p className="text-xs text-gray-500">{vehicleCount === 0 ? 'Ready to invest' : 'Committed capital'}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Amount Received</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatNGN(amountReceived)}</div>
              <p className="text-xs text-gray-500">Cash collected so far</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Receivable</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatNGN(totalReceivable)}</div>
              <p className="text-xs text-gray-500">Vehicle cost + interest (all vehicles)</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Weekly Returns</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatNGN(weeklyReturns)}</div>
              <p className="text-xs text-gray-500">Sum of receivable ÷ weeks (12→52, 18→78, 24→104)</p>
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
                <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md mx-4 max-h-[90vh] overflow-y-auto">
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
                          <SelectItem value="KEKE">Tricycle (Keke)</SelectItem>
                          <SelectItem value="BUS">Bus</SelectItem>
                          <SelectItem value="BIKE">Motorcycle</SelectItem>
                          {/* <SelectItem value="car">Car</SelectItem> */}
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
                      <Label htmlFor="repayment_duration" className="text-white">Repayment Duration</Label>
                      <Select 
                        value={vehicleForm.repayment_duration} 
                        onValueChange={(value) => handleVehicleFormChange('repayment_duration', value)}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="12">12 months (52 weeks) — 30% interest</SelectItem>
                          <SelectItem value="18">18 months (78 weeks) — 45% interest</SelectItem>
                          <SelectItem value="24">24 months (104 weeks) — 50% interest</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.repayment_duration && (
                        <p className="text-red-400 text-sm mt-1">{formErrors.repayment_duration}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-white">Total Amount Receivable (₦)</Label>
                      <Input
                        value={computeReceivable() ? Number(computeReceivable()).toLocaleString() : ''}
                        disabled
                        placeholder="Displays after selecting duration"
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Amount of vehicle + interest based on duration
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="photo" className="text-white">Vehicle Photo *</Label>
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="bg-gray-800 border-gray-600 text-white file:bg-orange-500 file:text-black file:border-0 file:rounded file:px-3 file:py-1 file:mr-3 hover:file:bg-orange-600"
                      />
                      {formErrors.photo && (
                        <p className="text-red-400 text-sm mt-1">{formErrors.photo}</p>
                      )}
                      {vehicleForm.photo && (
                        <p className="text-green-400 text-sm mt-1">Selected: {vehicleForm.photo.name}</p>
                      )}
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
              
              <Link href="/dashboard/review-drivers">
              <Button variant="outline" className="w-full border-gray-600 text-black hover:bg-gray-800">
                <Search className="w-4 h-4 mr-2" />
                Review Drivers
              </Button>
              </Link>
              <Link href="/dashboard/fleet" className="block">
                <Button variant="outline" className="w-full border-gray-600 text-black hover:bg-gray-800">
                  <Car className="w-4 h-4 mr-2" />
                  View Fleet
                </Button>
              </Link>
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
            <CardDescription className="text-black">
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
                <h3 className="font-semibold text-white mb-2">View Drivers Applications</h3>
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