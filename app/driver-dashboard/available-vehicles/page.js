"use client"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import apiService from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

export default function AvailableVehiclesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const userRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [vehicles, setVehicles] = useState([])
  const [fetching, setFetching] = useState(true)
  const [kycStatus, setKycStatus] = useState(null)
  const [showKycModal, setShowKycModal] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [note, setNote] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const userRole = localStorage.getItem('userRole')
    if (!userData || userRole !== 'DRIVER') {
      router.push('/login')
      return
    }
    const driverUser = JSON.parse(userData)
    userRef.current = driverUser
    const syncStatus = async () => {
      try {
        const res = await apiService.getKYCStatus(driverUser.id)
        const status = (res?.status || localStorage.getItem('kycStatus') || '').toUpperCase()
        setKycStatus(status || null)
        if (status) localStorage.setItem('kycStatus', status)
      } catch (e) {
        console.error('Failed to fetch KYC status:', e)
        const status = localStorage.getItem('kycStatus') || null
        setKycStatus(status)
      } finally {
        setLoading(false)
      }
    }
    syncStatus()
  }, [router])

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setFetching(true)
        const all = await apiService.getVehicles()
        const available = (Array.isArray(all) ? all : [])
          .filter(v => !v?.driver && (v?.is_active ?? true))
        setVehicles(available)
      } catch (e) {
        console.error('Failed to load vehicles:', e)
        setVehicles([])
      } finally {
        setFetching(false)
      }
    }
    fetchVehicles()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading available vehicles...</p>
        </div>
      </div>
    )
  }

  const formatNaira = (n) => {
    if (typeof n !== 'number') return '₦0'
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n)
  }

  const handleApplyClick = (vehicle) => {
    setSelectedVehicle(vehicle)
    const status = (kycStatus || '').toUpperCase()
    const isKycApproved = status === 'APPROVED'
    if (!isKycApproved) {
      setShowKycModal(true)
      return
    }
    setAgreeTerms(false)
    setNote("")
    setShowApplyModal(true)
  }

  const submitApplication = async (e) => {
    e?.preventDefault()
    if (!userRef.current || !selectedVehicle) return
    if (!agreeTerms) {
      toast({ title: "Agree to Terms", description: "Please accept the hire-purchase terms before applying." })
      return
    }
    try {
      setSubmitting(true)
      const res = await apiService.submitApplication({ applicant: userRef.current.id, vehicle: selectedVehicle.id })
      const appId = res?.application?.id
      toast({ title: "Application Submitted", description: "Your loan application is now pending." })
      setShowApplyModal(false)
      if (appId) router.push(`/driver-dashboard/loan/${appId}`)
    } catch (err) {
      toast({ title: "Submission Failed", description: (err?.message || 'Unable to submit application') })
    } finally {
      setSubmitting(false)
    }
  }



  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-orange-500">Available Vehicles</h1>
          <Link href="/driver-dashboard">
            <Button variant="ghost" className="text-gray-300 hover:text-white">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="bg-gray-900 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Browse and Compare</CardTitle>
            <CardDescription className="text-gray-400">
              Vehicles open for hire purchase. See repayment plan and weekly returns.
            </CardDescription>
          </CardHeader>
        </Card>

        {fetching ? (
          <p className="text-sm text-gray-500">Loading vehicles...</p>
        ) : vehicles.length === 0 ? (
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="py-6">
              <p className="text-sm text-gray-400">No vehicles available right now. Please check back later.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <Card key={v.id} className="bg-gray-900 border-gray-700 overflow-hidden">
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
                  <div className="pt-4 flex items-center justify-end">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-black" onClick={() => handleApplyClick(v)}>
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* KYC Required Modal */}
      <Dialog open={showKycModal} onOpenChange={setShowKycModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Complete KYC First</DialogTitle>
            <DialogDescription className="text-gray-300">
              You must complete your KYC before applying for a vehicle.
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm text-gray-400">
            {selectedVehicle ? (
              <p>
                Selected: {(selectedVehicle?.make || selectedVehicle?.manufacturer || 'Vehicle')} {selectedVehicle?.model || selectedVehicle?.model_name || ''}
              </p>
            ) : null}
          </div>
          <DialogFooter className="sm:justify-end">
            <Button variant="ghost" className="text-gray-300" onClick={() => setShowKycModal(false)}>
              Cancel
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-black" onClick={() => router.push('/kyc')}>
              Go to KYC
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Apply Modal with scrollable content */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Apply for Vehicle</DialogTitle>
            <DialogDescription className="text-gray-300">
              Review vehicle details and complete the form to submit your application.
            </DialogDescription>
          </DialogHeader>

          {selectedVehicle && (
            <div className="space-y-6">
              <div className="relative h-40 w-full bg-gray-800 rounded-md overflow-hidden">
                <Image
                  src={selectedVehicle?.photo_url || '/placeholder.jpg'}
                  alt={`${selectedVehicle?.model_name || 'Vehicle'} photo`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Make & Model</p>
                  <p className="text-sm text-white font-medium">
                    {(selectedVehicle?.make || selectedVehicle?.manufacturer || 'Vehicle')} {selectedVehicle?.model || selectedVehicle?.model_name || ''}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Registration</p>
                  <p className="text-sm text-white font-medium">{selectedVehicle?.registration_number || '-'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Total Receivable</p>
                  <p className="text-sm text-white font-medium">{formatNaira(Number(selectedVehicle?.total_receivable || 0))}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Weekly Returns</p>
                  <p className="text-sm text-white font-medium">{formatNaira(Number(selectedVehicle?.weekly_returns || 0))}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Duration</p>
                  <p className="text-sm text-white font-medium">
                    {(() => {
                      const d = Number(selectedVehicle?.repayment_duration || 0)
                      const map = { 12: 52, 18: 78, 24: 104 }
                      const weeks = map[d] ?? (d ? Math.max(1, Math.round(d * 4.33)) : 0)
                      return d ? `${d} months${weeks ? ` (${weeks} weeks)` : ''}` : '-'
                    })()}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Number of Payments</p>
                  <p className="text-sm text-white font-medium">
                    {(() => {
                      const d = Number(selectedVehicle?.repayment_duration || 0)
                      const map = { 12: 52, 18: 78, 24: 104 }
                      const weeks = map[d] ?? (d ? Math.max(1, Math.round(d * 4.33)) : 0)
                      return weeks ? `${weeks} weekly payments` : '-'
                    })()}
                  </p>
                </div>
              </div>

              <form onSubmit={submitApplication} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="note" className="text-white">Optional Note</Label>
                  <Input id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Anything we should know?" className="bg-gray-800 border-gray-700 text-white" />
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox id="agree" checked={agreeTerms} onCheckedChange={(v) => setAgreeTerms(Boolean(v))} />
                  <Label htmlFor="agree" className="text-gray-300 text-sm">I agree to the hire-purchase terms and repayment schedule.</Label>
                </div>
                <DialogFooter className="sm:justify-end">
                  <Button type="button" variant="ghost" className="text-gray-300" onClick={() => setShowApplyModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} className="bg-orange-500 hover:bg-orange-600 text-black">
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </DialogFooter>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}