"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import apiService from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Check, X, Eye, Bell } from "lucide-react"

export default function ReviewDriversPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [applications, setApplications] = useState([])
  const [updatingId, setUpdatingId] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isNotifOpen, setIsNotifOpen] = useState(false)

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
      const res = await apiService.getNotifications(user.id)
      const items = Array.isArray(res?.items) ? res.items : []
      setNotifications(items)
      setUnreadCount(items.filter(n => !n.is_read).length)
    } catch (e) {
      console.error('Failed to mark notifications read:', e)
    }
  }

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
          <div className="flex items-center gap-3 relative">
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
            <Link href="/dashboard">
              <Button variant="ghost" className="text-gray-300 hover:text-white">Back to Dashboard</Button>
            </Link>

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
                      <th className="py-2 px-3">Driver Name</th>
                      <th className="py-2 px-3">Contact Info</th>
                      <th className="py-2 px-3">Vehicle Details</th>
                      <th className="py-2 px-3">Applied On</th>
                      <th className="py-2 px-3">Risk Assessment</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Actions</th>
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
                          <td className="py-2 px-3 text-gray-300">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span>{driver.email || '-'}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span>{driver.phone_number || '-'}</span>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-gray-300">
                            <div className="font-medium text-white">{v.model_name || '-'}</div>
                            <div className="text-gray-400">{v.registration_number || '-'}</div>
                          </td>
                          <td className="py-2 px-3 text-gray-300">{appliedAt}</td>
                          <td className="py-2 px-3 text-gray-300">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded ${riskBadgeClass(app.risk_score)}`}>
                              <span className="font-semibold">{app.risk_score ?? '-'}</span>
                            </div>
                            <div className="text-gray-400 mt-1">{category}</div>
                          </td>
                          <td className="py-2 px-3">
                            <span className="inline-block px-2 py-1 rounded bg-blue-700 text-white text-xs">{app.status}</span>
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex gap-2">
                              <Link href={`/dashboard/review-drivers/${app.id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-gray-200 bg-[#111827] border-gray-700 hover:bg-gray-800"
                                >
                                  <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> View</span>
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                disabled={!isPending || updatingId === app.id}
                                onClick={() => updateStatus(app.id, 'APPROVED')}
                              >
                                {updatingId === app.id ? 'Updating...' : (
                                  <span className="flex items-center gap-1"><Check className="w-4 h-4" /> Approve</span>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                disabled={!isPending || updatingId === app.id}
                                onClick={() => updateStatus(app.id, 'REJECTED')}
                              >
                                {updatingId === app.id ? 'Updating...' : (
                                  <span className="flex items-center gap-1"><X className="w-4 h-4" /> Reject</span>
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {/* Summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {(() => {
                    const pending = applications.filter(a => a.status === 'PENDING').length
                    const approved = applications.filter(a => a.status === 'APPROVED').length
                    const rejected = applications.filter(a => a.status === 'REJECTED').length
                    return (
                      <>
                        <Card className="bg-gray-900 border-gray-700">
                          <CardContent className="py-4">
                            <div className="text-gray-400 text-sm">Pending Applications</div>
                            <div className="text-2xl font-bold text-white">{pending}</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-900 border-gray-700">
                          <CardContent className="py-4">
                            <div className="text-gray-400 text-sm">Approved</div>
                            <div className="text-2xl font-bold text-green-500">{approved}</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-900 border-gray-700">
                          <CardContent className="py-4">
                            <div className="text-gray-400 text-sm">Rejected</div>
                            <div className="text-2xl font-bold text-red-500">{rejected}</div>
                          </CardContent>
                        </Card>
                      </>
                    )
                  })()}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}