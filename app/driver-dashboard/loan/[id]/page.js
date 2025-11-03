"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import apiService from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function LoanDetailsPage({ params }) {
  const router = useRouter()
  const { id } = params || {}
  const [loading, setLoading] = useState(true)
  const [application, setApplication] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const role = localStorage.getItem('userRole')
    if (!userData || role !== 'DRIVER') {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  useEffect(() => {
    const fetchApp = async () => {
      if (!id) return
      try {
        const res = await apiService.getApplication(id)
        setApplication(res)
      } catch (e) {
        console.error('Failed to load application:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchApp()
  }, [id])

  const formatNaira = (n) => {
    if (typeof n !== 'number') return '₦0'
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading application...</p>
        </div>
      </div>
    )
  }

  const v = application?.vehicle_details || {}
  const status = (application?.status || 'PENDING').toUpperCase()

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-orange-500">Loan Application Details</h1>
          <div className="flex gap-2">
            <Link href="/driver-dashboard/available-vehicles">
              <Button variant="ghost" className="text-gray-300 hover:text-white">Back to Vehicles</Button>
            </Link>
            <Link href="/driver-dashboard">
              <Button variant="ghost" className="text-gray-300 hover:text-white">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Status Banner */}
        {status === 'PENDING' && (
          <Card className="bg-yellow-900/30 border-yellow-700">
            <CardHeader>
              <CardTitle className="text-white">Status: Pending</CardTitle>
              <CardDescription className="text-gray-300">
                Your application is under review. We will notify you when a decision is made.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
        {status === 'APPROVED' && (
          <Card className="bg-green-900/30 border-green-700">
            <CardHeader>
              <CardTitle className="text-white">Status: Approved</CardTitle>
              <CardDescription className="text-gray-300">
                Congratulations! Your application has been approved.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
        {status === 'REJECTED' && (
          <Card className="bg-red-900/30 border-red-700">
            <CardHeader>
              <CardTitle className="text-white">Status: Rejected</CardTitle>
              <CardDescription className="text-gray-300">
                Unfortunately, your application was rejected. You may contact support for details.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Vehicle & Terms */}
        <Card className="bg-gray-900 border-gray-700 overflow-hidden">
          <div className="relative h-40 w-full bg-gray-700">
            <Image
              src={v?.photo_url || '/placeholder.jpg'}
              alt={`${v?.model_name || 'Vehicle'} photo`}
              fill
              className="object-cover"
            />
          </div>
          <CardHeader>
            <CardTitle className="text-white text-base">
              {(v?.make || v?.manufacturer || 'Vehicle')} {v?.model || v?.model_name || ''}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {v?.registration_number ? `Reg: ${v.registration_number}` : 'Unregistered'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Total Receivable</span>
              <span className="text-sm text-white">{formatNaira(Number(v?.total_receivable || 0))}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Duration</span>
              <span className="text-sm text-white">{v?.repayment_duration ? `${v.repayment_duration} months` : '-'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Weekly Returns</span>
              <span className="text-sm text-white">{formatNaira(Number(v?.weekly_returns || 0))}</span>
            </div>
          </CardContent>
        </Card>

        {/* Application Meta */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-base">Application Summary</CardTitle>
            <CardDescription className="text-gray-400">Submitted details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-gray-300">Application ID: <span className="text-white">{application?.id}</span></p>
            <p className="text-gray-300">Submitted: <span className="text-white">{application?.application_date ? new Date(application.application_date).toLocaleString() : '-'}</span></p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}