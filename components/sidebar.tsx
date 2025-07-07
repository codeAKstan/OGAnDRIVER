"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Car,
  FileText,
  Settings,
  LogOut,
  Users,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  userType: "owner" | "admin"
  userName?: string
  userAvatar?: string
}

const ownerNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Car, label: "My Vehicles", href: "/vehicles" },
  { icon: FileText, label: "Applications", href: "/applications" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

const adminNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "User Management", href: "/admin/users" },
  { icon: Car, label: "Vehicle Fleet", href: "/admin/vehicles" },
  { icon: CreditCard, label: "Transactions", href: "/admin/transactions" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

export function Sidebar({ userType, userName = "John Doe", userAvatar }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const navItems = userType === "admin" ? adminNavItems : ownerNavItems

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Image src="/logo.png" alt="OGAnDRIVER" width={32} height={32} />
          {!collapsed && <span className="text-xl font-bold text-gray-900">OGAnDRIVER</span>}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-orange-600 hover:bg-orange-700 text-white",
                  !isActive && "hover:bg-orange-50 hover:text-orange-600",
                  collapsed && "px-2",
                )}
              >
                <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                {!collapsed && item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        {!collapsed && (
          <div className="flex items-center space-x-3 p-2">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-orange-600">
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{userType}</p>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          className={cn("w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700", collapsed && "px-2")}
        >
          <LogOut className={cn("h-5 w-5", !collapsed && "mr-3")} />
          {!collapsed && "Logout"}
        </Button>
      </div>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-gray-200">
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="w-full">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={cn("hidden md:flex flex-col h-screen transition-all duration-300", collapsed ? "w-16" : "w-64")}>
        <SidebarContent />
      </div>
    </>
  )
}
