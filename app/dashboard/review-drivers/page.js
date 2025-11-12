"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import apiService from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ReviewDriversPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [applications, setApplications] = useState([])
  const [updatingId, setUpdatingId] = useState(null)

  const riskCategory = (score) => {
    const s = Number(score || 0)
    if (s >= 750) return 'Excellent'
    if (s >= 650) return 'Good'
    if (s >= 550) return 'Fair'
    return 'Poor'
  }

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id)
      const res = await apiService.updateApplicationStatus(id, status)
      const updated = res?.application
      if (updated) {
        setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)))
      }
    } catch (e) {
      console.error('Failed to update status:', e)
    } finally {
      setUpdatingId(null)
    }
  }

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const role = localStorage.getItem('userRole')
    if (!userData || role !== 'OGA') {
      router.push('/login')
      return
    }
    const u = JSON.parse(userData)
    setUser(u)
    setLoading(false)
  }, [router])

  useEffect(() => {
    const fetchApps = async () => {
      if (!user?.id) return
      try {
        setFetching(true)
        const res = await apiService.getOwnerApplications(user.id)
        setApplications(Array.isArray(res?.items) ? res.items : [])
      } catch (e) {
        console.error('Failed to fetch applications:', e)
        setApplications([])
      } finally {
        setFetching(false)
      }
    }
    fetchApps()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Checking access...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-orange-500">Review Drivers</h1>
          <Link href="/dashboard">
            <Button variant="ghost" className="text-gray-300 hover:text-white">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Driver Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {fetching ? (
              <p className="text-sm text-gray-400">Loading applications...</p>
            ) : applications.length === 0 ? (
              <p className="text-sm text-gray-400">No applications yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400">
                      <th className="py-2 px-3">Driver</th>
                      <th className="py-2 px-3">Contact</th>
                      <th className="py-2 px-3">Vehicle & Actions</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Risk Score</th>
                      <th className="py-2 px-3">Applied</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => {
                      const driver = app.applicant_details || {}
                      const v = app.vehicle_details || {}
                      const appliedAt = app.application_date ? new Date(app.application_date).toLocaleString() : '-'
                      const category = riskCategory(app.risk_score)
                      const isPending = app.status === 'PENDING'
                      return (
                        <tr key={app.id} className="border-t border-gray-800">
                          <td className="py-2 px-3 text-white">{driver.first_name} {driver.last_name}</td>
                          <td className="py-2 px-3 text-gray-300">{driver.email || '-'}<br />{driver.phone_number || '-'}</td>
                          <td className="py-2 px-3 text-gray-300">
                            <div className="text-gray-300">
                              <div className="font-medium text-white">{v.registration_number || '-'}</div>
                              <div className="text-gray-400">{v.model_name || '-'}</div>
                            </div>
                            <div className="mt-2 flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={!isPending || updatingId === app.id}
                                onClick={() => updateStatus(app.id, 'APPROVED')}
                              >
                                {updatingId === app.id ? 'Updating...' : 'Approve'}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                disabled={!isPending || updatingId === app.id}
                                onClick={() => updateStatus(app.id, 'REJECTED')}
                              >
                                {updatingId === app.id ? 'Updating...' : 'Reject'}
                              </Button>
                            </div>
                          </td>
                          <td className="py-2 px-3">
                            <span className="inline-block px-2 py-1 rounded bg-gray-800 text-gray-200">{app.status}</span>
                          </td>
                          <td className="py-2 px-3 text-gray-300">
                            <div>{app.risk_score ?? '-'}</div>
                            <div className="mt-1">
                              <span className="inline-block px-2 py-1 rounded bg-gray-800 text-gray-200">{category}</span>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-gray-300">{appliedAt}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}