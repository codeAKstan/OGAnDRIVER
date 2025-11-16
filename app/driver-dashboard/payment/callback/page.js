"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import apiService from "@/lib/api"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DepositCallbackPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [status, setStatus] = useState('pending')
  const [message, setMessage] = useState('Verifying payment...')

  useEffect(() => {
    const verify = async () => {
      const reference = params.get('reference') || params.get('trxref')
      try {
        if (!reference) {
          setStatus('error')
          setMessage('Missing payment reference')
          return
        }
        const res = await apiService.verifyDeposit(reference)
        if (res?.application) {
          setStatus('success')
          setMessage('Deposit verified. Your loan is now active.')
        } else {
          setStatus('error')
          setMessage('Verification failed')
        }
      } catch (e) {
        setStatus('error')
        setMessage('Verification error')
      }
    }
    verify()
  }, [params])

  const goDashboard = () => router.push('/driver-dashboard')

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-8">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Payment Status</CardTitle>
            <CardDescription className="text-gray-400">{status === 'pending' ? 'Please wait...' : status === 'success' ? 'Payment confirmed' : 'Payment failed'}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-300">{message}</p>
            <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-black" onClick={goDashboard}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}