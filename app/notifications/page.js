"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import apiService from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

export default function NotificationsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState('')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const r = localStorage.getItem('userRole')
    if (!userData || !r) {
      router.push('/login')
      return
    }
    const u = JSON.parse(userData)
    setUser(u)
    setRole(String(r || '').toUpperCase())
    setLoading(false)
  }, [router])

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user?.id) return
      try {
        const res = await apiService.getNotifications(user.id)
        const list = Array.isArray(res?.items) ? res.items : []
        setItems(list)
      } catch (e) {
        console.error('Failed to fetch notifications:', e)
        setItems([])
      }
    }
    fetchNotes()
  }, [user])

  const markAllRead = async () => {
    if (!user?.id) return
    try {
      await apiService.markNotificationsRead(user.id)
      const res = await apiService.getNotifications(user.id)
      const list = Array.isArray(res?.items) ? res.items : []
      setItems(list)
    } catch (e) {
      console.error('Failed to mark notifications read:', e)
    }
  }

  const goBack = () => {
    const role = (localStorage.getItem('userRole') || '').toUpperCase()
    if (role === 'DRIVER') {
      router.push('/driver-dashboard')
    } else if (role === 'OGA') {
      router.push('/dashboard')
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-orange-500 flex items-center gap-2"><Bell className="w-5 h-5" /> Notifications</h1>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-white"
              onClick={markAllRead}
            >
              Mark all as read
            </Button>
            <Button variant="ghost" className="text-gray-300 hover:text-white" onClick={goBack}>Back to Dashboard</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Your Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : items.length === 0 ? (
              <p className="text-sm text-gray-400">No notifications</p>
            ) : (
              <div className="divide-y divide-gray-800">
                {items.map((n) => (
                  <div key={n.id} className="py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white text-sm font-medium">{n.title}</div>
                        <div className="text-xs text-gray-400 mt-1">{n.message}</div>
                        {n.created_at && (
                          <div className="text-[11px] text-gray-500 mt-1">{new Date(n.created_at).toLocaleString()}</div>
                        )}
                      </div>
                      <div>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${n.is_read ? 'bg-gray-700 text-gray-300' : 'bg-blue-700 text-white'}`}>{n.is_read ? 'READ' : 'NEW'}</span>
                      </div>
                    </div>
                    {n.application?.id && (
                      <div className="mt-2">
                        <Link
                          href={role === 'DRIVER' ? `/driver-dashboard/loan/${n.application.id}` : `/dashboard/review-drivers/${n.application.id}`}
                          className="text-xs text-orange-400 hover:text-orange-300"
                        >
                          View application
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}