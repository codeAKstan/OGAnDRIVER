"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import apiService from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DriverPaymentsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [items, setItems] = useState([])

  const exportPDF = () => {
    try {
      const win = window.open('', 'PRINT', 'height=800,width=1000')
      const rows = (items || []).map((t) => {
        const v = t.vehicle_details || {}
        const paidAt = t.payment_date ? new Date(t.payment_date).toLocaleString() : '-'
        const amt = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Number(t.amount || 0))
        return `<tr>
          <td>${paidAt}</td>
          <td>${amt}</td>
          <td>${v.registration_number || ''}</td>
          <td>${t.transaction_id || ''}</td>
          <td>${t.status || ''}</td>
        </tr>`
      }).join('')
      const html = `
        <html>
          <head>
            <title>Payment History</title>
            <style>
              body { font-family: Arial, sans-serif; color: #000; }
              h1 { font-size: 18px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #444; padding: 8px; font-size: 12px; }
              th { background: #eee; }
            </style>
          </head>
          <body>
            <h1>Payment History</h1>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Vehicle</th>
                  <th>Transaction</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </body>
        </html>`
      win.document.write(html)
      win.document.close()
      win.focus()
      win.print()
      win.close()
    } catch (e) {
    }
  }

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const role = localStorage.getItem('userRole')
    if (!userData || role !== 'DRIVER') {
      router.push('/login')
      return
    }
    const u = JSON.parse(userData)
    setUser(u)
    setLoading(false)
  }, [router])

  useEffect(() => {
    const fetchPayments = async () => {
      if (!user?.id) return
      try {
        setFetching(true)
        const res = await apiService.getDriverPayments(user.id)
        const list = Array.isArray(res?.items) ? res.items : []
        setItems(list)
      } catch (e) {
        setItems([])
      } finally {
        setFetching(false)
      }
    }
    fetchPayments()
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
          <h1 className="text-xl font-bold text-orange-500">Payment History</h1>
          <div className="flex items-center gap-2">
            <Button onClick={exportPDF} className="bg-gray-800 border border-gray-700 text-white hover:bg-gray-700">Export PDF</Button>
            <Link href="/driver-dashboard">
              <Button variant="ghost" className="text-gray-300 hover:text-white">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {fetching ? (
              <p className="text-sm text-gray-400">Loading transactions...</p>
            ) : items.length === 0 ? (
              <p className="text-sm text-gray-400">No transactions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400">
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Amount</th>
                      <th className="py-2 px-3">Vehicle</th>
                      <th className="py-2 px-3">Transaction</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((t) => {
                      const v = t.vehicle_details || {}
                      const paidAt = t.payment_date ? new Date(t.payment_date).toLocaleString() : '-'
                      const amt = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Number(t.amount || 0))
                      return (
                        <tr key={t.id} className="border-t border-gray-800">
                          <td className="py-2 px-3 text-gray-300">{paidAt}</td>
                          <td className="py-2 px-3 text-white">{amt}</td>
                          <td className="py-2 px-3 text-gray-300">{v.registration_number}</td>
                          <td className="py-2 px-3 text-gray-300">{t.transaction_id}</td>
                          <td className="py-2 px-3"><span className={`inline-block px-2 py-1 rounded ${t.status === 'SUCCESSFUL' ? 'bg-green-700 text-white' : 'bg-red-700 text-white'}`}>{t.status}</span></td>
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