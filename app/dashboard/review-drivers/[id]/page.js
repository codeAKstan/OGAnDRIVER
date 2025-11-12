"use client"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import apiService from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Car, BadgeInfo, Check, X } from "lucide-react"

export default function DriverApplicationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const appId = params?.id
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [application, setApplication] = useState(null)
  const [updating, setUpdating] = useState(false)

  const riskCategory = (score) => {
    const s = Number(score || 0)
    if (s >= 750) return 'Excellent'
    if (s >= 650) return 'Good'
    if (s >= 550) return 'Fair'
    return 'Poor'
  }

  const riskBadgeClass = (score) => {
    const s = Number(score || 0)
    if (s >= 750) return 'bg-green-700 text-white'
    if (s >= 650) return 'bg-yellow-700 text-white'
    if (s >= 550) return 'bg-orange-700 text-white'
    return 'bg-red-700 text-white'
  }

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const role = localStorage.getItem('userRole')
    if (!userData || role !== 'OGA') {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userData))
    setLoading(false)
  }, [router])

  useEffect(() => {
    const fetchApp = async () => {
      if (!appId) return
      try {
        setFetching(true)
        const res = await apiService.getApplication(appId)
        setApplication(res || null)
      } catch (e) {
        console.error('Failed to fetch application:', e)
        setApplication(null)
      } finally {
        setFetching(false)
      }
    }
    fetchApp()
  }, [appId])

  const updateStatus = async (status) => {
    if (!application?.id) return
    try {
      setUpdating(true)
      const res = await apiService.updateApplicationStatus(application.id, status)
      if (res?.application) setApplication(res.application)
    } catch (e) {
      console.error('Failed to update status:', e)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Checking access...</p>
      </div>
    )
  }

  const driver = application?.applicant_details || {}
  const v = application?.vehicle_details || {}
  const appliedAt = application?.application_date ? new Date(application.application_date).toLocaleString() : '-'
  const decisionAt = application?.decision_date ? new Date(application.decision_date).toLocaleString() : '-'
  const category = riskCategory(application?.risk_score)

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-orange-500">Driver Application Details</h1>
          <Link href="/dashboard/review-drivers">
            <Button variant="ghost" className="text-gray-300 hover:text-white">Back to Applications</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-white">Applicant Overview</CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={updating || application?.status !== 'PENDING'}
                onClick={() => updateStatus('APPROVED')}
              >
                <span className="flex items-center gap-1"><Check className="w-4 h-4" /> Approve</span>
              </Button>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={updating || application?.status !== 'PENDING'}
                onClick={() => updateStatus('REJECTED')}
              >
                <span className="flex items-center gap-1"><X className="w-4 h-4" /> Reject</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {fetching ? (
              <p className="text-sm text-gray-400">Loading details...</p>
            ) : !application ? (
              <p className="text-sm text-gray-400">Application not found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Driver info */}
                <div>
                  <h2 className="text-gray-300 mb-2">Driver Information</h2>
                  <div className="space-y-2 text-gray-300">
                    <div className="text-white text-lg font-semibold">{driver.first_name} {driver.last_name}</div>
                    <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /><span>{driver.email || '-'}</span></div>
                    <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><span>{driver.phone_number || '-'}</span></div>
                  </div>
                </div>

                {/* Vehicle info */}
                <div>
                  <h2 className="text-gray-300 mb-2">Vehicle Information</h2>
                  <div className="space-y-2 text-gray-300">
                    <div className="flex items-center gap-2"><Car className="w-4 h-4 text-gray-400" /><span>{v.model_name || '-'}</span></div>
                    <div className="text-gray-400">Registration: {v.registration_number || '-'}</div>
                    <div className="text-gray-400">Type: {v.vehicle_type || '-'}</div>
                  </div>
                </div>

                {/* Risk & status */}
                <div>
                  <h2 className="text-gray-300 mb-2">Risk Assessment</h2>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded ${riskBadgeClass(application?.risk_score)}`}>
                    <BadgeInfo className="w-4 h-4" />
                    <span className="font-semibold">{application?.risk_score ?? '-'}</span>
                  </div>
                  <div className="text-gray-400 mt-2">{category}</div>
                </div>

                <div>
                  <h2 className="text-gray-300 mb-2">Status & Dates</h2>
                  <div className="text-gray-300">Status: <span className="inline-block px-2 py-1 rounded bg-blue-700 text-white text-xs">{application?.status}</span></div>
                  <div className="text-gray-400 mt-2">Applied On: {appliedAt}</div>
                  <div className="text-gray-400">Decision Date: {decisionAt}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}