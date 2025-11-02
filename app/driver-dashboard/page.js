"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { 
  Car, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Settings, 
  LogOut,
  Bell,
  MapPin,
  TrendingUp,
  AlertTriangle
} from "lucide-react"
import { useRouter } from "next/navigation"
import apiService from "@/lib/api"

export default function DriverDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [kycStatus, setKycStatus] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [activityLoading, setActivityLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in and has the right role
    const userData = localStorage.getItem('user')
    const userRole = localStorage.getItem('userRole')
    
    if (!userData || userRole !== 'DRIVER') {
      router.push('/login')
      return
    }
    
    setUser(JSON.parse(userData))
    const status = localStorage.getItem('kycStatus') || null
    setKycStatus(status)
    setLoading(false)
  }, [])

  useEffect(() => {
    const fetchActivity = async () => {
      if (!user?.id) return
      try {
        setActivityLoading(true)
        const items = await apiService.getRecentActivity(user.id)
        setRecentActivity(Array.isArray(items) ? items : [])
      } catch (e) {
        console.error('Failed to fetch recent activity:', e)
        setRecentActivity([])
      } finally {
        setActivityLoading(false)
      }
    }
    fetchActivity()
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
                <h1 className="text-xl font-bold text-orange-500">Driver Dashboard</h1>
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
        {/* KYC Status Banner */}
        {kycStatus === 'SUBMITTED' ? (
          <Card className="bg-[green] border-green-500/30 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                KYC Verification Complete
              </CardTitle>
              <CardDescription className="text-gray-300">
                Your KYC verification has been submitted and is under review. You'll be notified once approved.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <Card className="bg-orange-900/20 border-orange-500/30 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertTriangle className="w-6 h-6 text-orange-500 mr-3" />
                Complete your KYC
              </CardTitle>
              <CardDescription className="text-gray-300">
                You haven’t completed your KYC. Complete it to proceed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-black"
                onClick={() => router.push('/kyc')}
              >
                Go to KYC
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Available Vehicles CTA */}
        <Card className="bg-gray-900 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Browse Available Vehicles</CardTitle>
            <CardDescription className="text-gray-400">
              Explore vehicles currently open for hire purchase. Apply after your KYC is approved.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              View makes, models, repayment plans and weekly returns.
            </p>
            <Link href="/driver-dashboard/available-vehicles">
              <Button className="bg-orange-500 hover:bg-orange-600 text-black">See Available Vehicles</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Vehicle Assigned</CardTitle>
              <Car className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Pending</div>
              <p className="text-xs text-gray-500">Waiting for assignment</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Repayment</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₦0</div>
              <p className="text-xs text-gray-500">Hire purchase total</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Amount Repaid</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₦0</div>
              <p className="text-xs text-gray-500">Cumulative paid to date</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Rating</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">-</div>
              <p className="text-xs text-gray-500">No ratings yet</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Next Steps */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Next Steps</CardTitle>
              <CardDescription className="text-gray-400">
                Complete these steps to start earning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-orange-900/20 rounded-lg border border-orange-500/30">
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Wait for KYC Approval</p>
                  <p className="text-sm text-gray-400">Your documents are being reviewed</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                <div className="w-5 h-5 rounded-full bg-gray-600 flex-shrink-0"></div>
                <div>
                  <p className="text-gray-400 font-medium">Get Vehicle Assignment</p>
                  <p className="text-sm text-gray-500">Available after KYC approval</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                <div className="w-5 h-5 rounded-full bg-gray-600 flex-shrink-0"></div>
                <div>
                  <p className="text-gray-400 font-medium">Start Earning</p>
                  <p className="text-sm text-gray-500">Begin your driving journey</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity (real data) */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-gray-400">
                Your latest updates and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activityLoading ? (
                <p className="text-sm text-gray-500">Loading activity...</p>
              ) : recentActivity.length === 0 ? (
                <p className="text-sm text-gray-500">No recent updates yet</p>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3 rounded-lg border bg-gray-800">
                      {item.type === 'KYC' && (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      )}
                      {item.type === 'PAYMENT' && (
                        <DollarSign className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      )}
                      {item.type === 'APPLICATION' && (
                        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      )}
                      {item.type !== 'KYC' && item.type !== 'PAYMENT' && item.type !== 'APPLICATION' && (
                        <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-white font-medium">{item.title}</p>
                        <p className="text-sm text-gray-400">{item.description}</p>
                        {item.timestamp && (
                          <p className="text-xs text-gray-500 mt-1">{new Date(item.timestamp).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Information Card */}
        <Card className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <MapPin className="w-5 h-5 text-blue-500 mr-3" />
              What's Next?
            </CardTitle>
            <CardDescription className="text-gray-300">
              While waiting for KYC approval, here's what you can expect
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-3">1</div>
                <h3 className="font-semibold text-white mb-2">KYC Review</h3>
                <p className="text-sm text-gray-400">Our team will review your documents within 24-48 hours</p>
              </div>
              <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-3">2</div>
                <h3 className="font-semibold text-white mb-2">Vehicle Assignment</h3>
                <p className="text-sm text-gray-400">Get matched with available vehicles from Oga investors</p>
              </div>
              <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto mb-3">3</div>
                <h3 className="font-semibold text-white mb-2">Start Driving</h3>
                <p className="text-sm text-gray-400">Begin earning with your assigned vehicle</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}