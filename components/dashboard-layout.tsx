"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart,
  Bell,
  CreditCard,
  DollarSign,
  History,
  Home,
  LogOut,
  Menu,
  Search,
  Send,
  Settings,
  User,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMobile } from "@/hooks/use-mobile"
import { LogoutModal } from "@/components/logout-modal"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const isMobile = useMobile()
  const pathname = usePathname()

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [pathname, isMobile])

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Send", href: "/dashboard/send", icon: Send },
    { name: "Receive", href: "/dashboard/receive", icon: Send, rotate: true },
    { name: "Convert", href: "/dashboard/convert", icon: History },
    { name: "Cards", href: "/dashboard/cards", icon: CreditCard },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart },
    { name: "History", href: "/dashboard/history", icon: History },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <DollarSign className="h-5 w-5" />
              </div>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <DollarSign className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">Zimbabwe Stablecoin</span>
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:flex md:w-64">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="w-full rounded-full bg-muted pl-8" />
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    3
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-auto">
                  <div className="flex items-start gap-3 p-3 hover:bg-muted">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Payment Received</p>
                      <p className="text-xs text-muted-foreground">You received $250 from Chiedza M.</p>
                      <p className="mt-1 text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 hover:bg-muted">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                      <BarChart className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Exchange Rate Update</p>
                      <p className="text-xs text-muted-foreground">USD/ZWL rate changed to 3,500</p>
                      <p className="mt-1 text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 hover:bg-muted">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <Settings className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Security Alert</p>
                      <p className="text-xs text-muted-foreground">New login detected from Harare</p>
                      <p className="mt-1 text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2 text-center text-xs text-muted-foreground">
                  <Button variant="ghost" size="sm" className="w-full">
                    View All Notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <img src="/placeholder.svg?height=32&width=32" alt="User" className="h-8 w-8 rounded-full" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowLogoutModal(true)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || !isMobile) && (
            <motion.aside
              initial={isMobile ? { x: -300, opacity: 0 } : false}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`fixed inset-y-0 left-0 z-30 w-64 border-r border-border/40 bg-background/95 backdrop-blur-sm pt-16 ${isMobile ? "shadow-xl" : ""}`}
            >
              <div className="flex h-full flex-col px-4 py-4">
                <div className="mb-6 rounded-lg bg-muted p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-medium">Wallet Balance</h3>
                  </div>
                  <div className="mb-1 text-2xl font-bold">$1,750.00</div>
                  <div className="text-xs text-muted-foreground">≈ Z$6,125,000 at current rate</div>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <item.icon className={`h-5 w-5 ${item.rotate ? "rotate-90" : ""}`} />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto space-y-4">
                  <Link
                    href="/dashboard/settings"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                      isActive("/dashboard/settings")
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                      isActive("/dashboard/profile")
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setShowLogoutModal(true)}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                  </Button>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 pt-16 md:pl-64">{children}</main>
      </div>

      {/* Logout Modal */}
      <LogoutModal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
    </div>
  )
}

