import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, DollarSign, TrendingUp, AlertTriangle } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType="owner" userName="Chinedu Okoro" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, Chinedu! Here's your fleet overview.</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last updated</p>
              <p className="text-sm font-medium">2 minutes ago</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦450,000</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payment Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground">+3% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">At-Risk Drivers</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* At-Risk Drivers */}
            <Card>
              <CardHeader>
                <CardTitle>At-Risk Drivers</CardTitle>
                <CardDescription>Drivers requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-red-600">AO</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Adamu Okafor</p>
                        <p className="text-sm text-gray-500">Keke - ABC123XY</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive">7 days overdue</Badge>
                      <p className="text-sm text-gray-500 mt-1">₦15,000 pending</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-yellow-600">EM</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Emmanuel Musa</p>
                        <p className="text-sm text-gray-500">Bus - DEF456GH</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        3 days overdue
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">₦8,500 pending</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Payments */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>Latest payment activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Kemi Adebayo",
                      vehicle: "Keke - GHI789JK",
                      amount: "₦12,000",
                      status: "completed",
                      time: "2 hours ago",
                    },
                    {
                      name: "Ibrahim Sule",
                      vehicle: "Bus - LMN012OP",
                      amount: "₦25,000",
                      status: "completed",
                      time: "5 hours ago",
                    },
                    {
                      name: "Grace Okon",
                      vehicle: "Keke - QRS345TU",
                      amount: "₦10,500",
                      status: "pending",
                      time: "1 day ago",
                    },
                    {
                      name: "Yusuf Ahmed",
                      vehicle: "Korope - VWX678YZ",
                      amount: "₦18,000",
                      status: "completed",
                      time: "2 days ago",
                    },
                  ].map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-green-600">
                            {payment.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{payment.name}</p>
                          <p className="text-xs text-gray-500">{payment.vehicle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900 text-sm">{payment.amount}</p>
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={payment.status === "completed" ? "default" : "secondary"}
                            className={payment.status === "completed" ? "bg-green-100 text-green-800" : ""}
                          >
                            {payment.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{payment.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Chart Placeholder */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue trends for the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Revenue Chart Placeholder</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
