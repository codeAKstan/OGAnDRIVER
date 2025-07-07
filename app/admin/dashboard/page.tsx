import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Car, DollarSign, CheckCircle, Database, Wifi, CreditCard } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType="admin" userName="Admin User" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Platform overview and system health monitoring</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">System Status</p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm font-medium text-green-600">All Systems Operational</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Registered Owners</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">+23 this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Registered Drivers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,891</div>
                <p className="text-xs text-muted-foreground">+67 this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,156</div>
                <p className="text-xs text-muted-foreground">+15 this week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transaction Volume</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦45.2M</div>
                <p className="text-xs text-muted-foreground">+8.2% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* User Sign-ups Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>New User Sign-ups</CardTitle>
                <CardDescription>Owners vs Drivers over the past 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">User Sign-ups Chart Placeholder</p>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Key services health monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Wifi className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">API Service</p>
                        <p className="text-sm text-gray-500">Core application API</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Online
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Database className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Database</p>
                        <p className="text-sm text-gray-500">Primary database cluster</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Online
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Payment Gateway</p>
                        <p className="text-sm text-gray-500">Transaction processing</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Platform Activity</CardTitle>
              <CardDescription>Important events and system notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    type: "user_signup",
                    message: "New vehicle owner registered: Adebayo Fashola",
                    time: "5 minutes ago",
                    severity: "info",
                  },
                  {
                    type: "large_transaction",
                    message: "Large transaction processed: ₦250,000 payment received",
                    time: "12 minutes ago",
                    severity: "success",
                  },
                  {
                    type: "dispute",
                    message: "Payment dispute flagged: Transaction ID #TXN-2024-001234",
                    time: "1 hour ago",
                    severity: "warning",
                  },
                  {
                    type: "user_signup",
                    message: "New driver registered: Musa Ibrahim (Risk Score: Low)",
                    time: "2 hours ago",
                    severity: "info",
                  },
                  {
                    type: "system",
                    message: "Scheduled maintenance completed successfully",
                    time: "3 hours ago",
                    severity: "success",
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.severity === "success"
                          ? "bg-green-500"
                          : activity.severity === "warning"
                            ? "bg-yellow-500"
                            : activity.severity === "error"
                              ? "bg-red-500"
                              : "bg-blue-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
