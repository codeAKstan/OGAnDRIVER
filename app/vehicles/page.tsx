import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Search, Filter, Plus, Eye, MoreHorizontal, Car, Truck, Bus } from "lucide-react"
import Link from "next/link"

export default function VehiclesPage() {
  const vehicles = [
    {
      id: 1,
      type: "Keke",
      plateNumber: "ABC123XY",
      driver: "Adamu Okafor",
      totalAmount: 500000,
      paidAmount: 350000,
      status: "active",
      riskLevel: "high",
      lastPayment: "2024-01-10",
    },
    {
      id: 2,
      type: "Bus",
      plateNumber: "DEF456GH",
      driver: "Emmanuel Musa",
      totalAmount: 800000,
      paidAmount: 720000,
      status: "active",
      riskLevel: "medium",
      lastPayment: "2024-01-12",
    },
    {
      id: 3,
      type: "Keke",
      plateNumber: "GHI789JK",
      driver: "Kemi Adebayo",
      totalAmount: 450000,
      paidAmount: 450000,
      status: "completed",
      riskLevel: "low",
      lastPayment: "2024-01-15",
    },
    {
      id: 4,
      type: "Korope",
      plateNumber: "LMN012OP",
      driver: "Ibrahim Sule",
      totalAmount: 600000,
      paidAmount: 480000,
      status: "active",
      riskLevel: "low",
      lastPayment: "2024-01-14",
    },
  ]

  const getVehicleIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "bus":
        return <Bus className="h-5 w-5" />
      case "korope":
        return <Truck className="h-5 w-5" />
      default:
        return <Car className="h-5 w-5" />
    }
  }

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "high":
        return <Badge variant="destructive">High Risk</Badge>
      case "medium":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Medium Risk
          </Badge>
        )
      case "low":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Low Risk
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Active
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar userType="owner" userName="Chinedu Okoro" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Vehicles</h1>
              <p className="text-gray-600">Manage your fleet and track payment progress</p>
            </div>
            <Link href="/vehicles/add">
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search by plate number, driver name..." className="pl-10" />
            </div>
            <Button variant="outline" className="flex items-center bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Vehicles Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => {
              const progressPercentage = (vehicle.paidAmount / vehicle.totalAmount) * 100

              return (
                <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          {getVehicleIcon(vehicle.type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{vehicle.plateNumber}</CardTitle>
                          <CardDescription>{vehicle.type}</CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Driver Info */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{vehicle.driver}</p>
                        <p className="text-xs text-gray-500">Driver</p>
                      </div>
                      <div className="flex space-x-2">
                        {getRiskBadge(vehicle.riskLevel)}
                        {getStatusBadge(vehicle.status)}
                      </div>
                    </div>

                    {/* Payment Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Payment Progress</span>
                        <span className="font-medium">
                          ₦{vehicle.paidAmount.toLocaleString()} / ₦{vehicle.totalAmount.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                      <p className="text-xs text-gray-500">{progressPercentage.toFixed(1)}% completed</p>
                    </div>

                    {/* Last Payment */}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Payment</span>
                      <span className="font-medium">{vehicle.lastPayment}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      <Link href={`/vehicles/${vehicle.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Fleet Value</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">₦2,350,000</p>
                <p className="text-sm text-gray-500">Across 4 vehicles</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Collected</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">₦2,000,000</p>
                <p className="text-sm text-gray-500">85.1% of total value</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Outstanding</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-600">₦350,000</p>
                <p className="text-sm text-gray-500">14.9% remaining</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
