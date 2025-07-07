import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Image src="/logo.png" alt="OGAnDRIVER" width={48} height={48} />
            <span className="text-2xl font-bold text-gray-900">OGAnDRIVER</span>
          </div>
          <p className="text-gray-600">Welcome back! Please sign in to your account.</p>
        </div>

        <Tabs defaultValue="owner" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="owner">Vehicle Owner</TabsTrigger>
            <TabsTrigger value="admin">Administrator</TabsTrigger>
          </TabsList>

          <TabsContent value="owner">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Owner Login</CardTitle>
                <CardDescription>Access your fleet management dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="owner-email">Email</Label>
                  <Input id="owner-email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner-password">Password</Label>
                  <Input id="owner-password" type="password" placeholder="Enter your password" />
                </div>
                <div className="flex items-center justify-between">
                  <Link href="/forgot-password" className="text-sm text-orange-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Link href="/dashboard">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">Sign In</Button>
                </Link>
                <div className="text-center">
                  <span className="text-sm text-gray-600">Don't have an account? </span>
                  <Link href="/register" className="text-sm text-orange-600 hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Administrator Login</CardTitle>
                <CardDescription>Access the platform administration panel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input id="admin-email" type="email" placeholder="Enter your admin email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input id="admin-password" type="password" placeholder="Enter your password" />
                </div>
                <Link href="/admin/dashboard">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700">Sign In as Admin</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
