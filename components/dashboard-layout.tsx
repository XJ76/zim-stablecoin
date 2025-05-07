"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart,
  CreditCardIcon as CardIcon,
  DollarSign,
  Globe,
  HelpCircle,
  History,
  Home,
  LogOut,
  Menu,
  Search,
  Send,
  Settings,
  User,
  X,
  Bell,
  ArrowUpDown,
  Download,
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
import { ThemeSelector } from "@/components/theme-selector"
import { LogoutModal } from "@/components/logout-modal"
import { useLogoutModal } from "@/hooks/use-logout-modal"
import { useApp } from "@/context/app-context"
import { useMobile } from "@/hooks/use-mobile"
import { format } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useMobile()
  const logoutModal = useLogoutModal()
  const {
    user,
    balance,
    zwlRate,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    searchTransactions,
    exportTransactions,
  } = useApp()

  const [searchResults, setSearchResults] = useState<any[]>([])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [pathname, isMobile])

  // Handle click outside search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim()) {
      const results = searchTransactions(query)
      setSearchResults(results)
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/dashboard/history?search=${encodeURIComponent(searchQuery)}`)
      setShowSearchResults(false)
    }
  }

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
            <div className="hidden md:flex md:w-64" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="w-full rounded-full bg-muted pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 rounded-md border bg-background p-2 shadow-lg">
                    <ScrollArea className="h-[200px]">
                      {searchResults.slice(0, 5).map((result) => (
                        <div
                          key={result.id}
                          className="cursor-pointer rounded-md p-2 hover:bg-muted"
                          onClick={() => {
                            router.push(`/dashboard/history?transaction=${result.id}`)
                            setShowSearchResults(false)
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium capitalize">{result.type.replace("_", " ")}</span>
                            <span className="text-sm">${result.amount.toFixed(2)}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">{format(new Date(result.date), "PPP")}</div>
                        </div>
                      ))}
                    </ScrollArea>
                    <div className="mt-2 border-t pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => {
                          router.push(`/dashboard/history?search=${encodeURIComponent(searchQuery)}`)
                          setShowSearchResults(false)
                        }}
                      >
                        View all results
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={exportTransactions} className="hidden md:flex">
                    <Download className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export transactions</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <ThemeSelector />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-2">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  {unreadNotificationsCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllNotificationsAsRead} className="h-8 text-xs">
                      Mark all as read
                    </Button>
                  )}
                </div>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-3 p-3 hover:bg-muted ${!notification.read ? "bg-muted/50" : ""}`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            notification.type === "transaction"
                              ? "bg-primary/10 text-primary"
                              : notification.type === "security"
                                ? "bg-red-100 text-red-600"
                                : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {notification.type === "transaction" ? (
                            <DollarSign className="h-4 w-4" />
                          ) : notification.type === "security" ? (
                            <Settings className="h-4 w-4" />
                          ) : (
                            <Globe className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {format(new Date(notification.date), "PPp")}
                          </p>
                        </div>
                        {!notification.read && <div className="ml-auto mt-1 h-2 w-2 rounded-full bg-primary"></div>}
                      </div>
                    ))
                  ) : (
                    <div className="flex h-20 items-center justify-center">
                      <p className="text-sm text-muted-foreground">No notifications</p>
                    </div>
                  )}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <img src="/placeholder.svg?height=32&width=32" alt="User" className="h-8 w-8 rounded-full" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user ? `${user.firstName} ${user.lastName}` : "My Account"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex cursor-pointer items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="flex cursor-pointer items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logoutModal.onOpen}>
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
              className={`fixed inset-y-0 left-0 z-30 w-64 border-r border-border/40 bg-background/95 backdrop-blur-sm pt-16 ${
                isMobile ? "shadow-xl" : ""
              }`}
            >
              <div className="flex h-full flex-col px-4 py-4">
                <div className="mb-6 rounded-lg bg-muted p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-medium">Wallet Balance</h3>
                  </div>
                  <div className="mb-1 text-2xl font-bold">${balance.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">
                    ≈ Z${(balance * zwlRate).toLocaleString()} at current rate
                  </div>
                </div>

                <nav className="space-y-1">
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted hover:text-foreground ${
                      pathname === "/dashboard" ? "bg-muted font-medium text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/dashboard/send"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted hover:text-foreground ${
                      pathname === "/dashboard/send" ? "bg-muted font-medium text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <Send className="h-5 w-5" />
                    <span>Send</span>
                  </Link>
                  <Link
                    href="/dashboard/receive"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted hover:text-foreground ${
                      pathname === "/dashboard/receive"
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    <ArrowUpDown className="h-5 w-5 rotate-90" />
                    <span>Receive</span>
                  </Link>
                  <Link
                    href="/dashboard/convert"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted hover:text-foreground ${
                      pathname === "/dashboard/convert"
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    <ArrowUpDown className="h-5 w-5" />
                    <span>Convert</span>
                  </Link>
                  <Link
                    href="/dashboard/history"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted hover:text-foreground ${
                      pathname === "/dashboard/history"
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    <History className="h-5 w-5" />
                    <span>History</span>
                  </Link>
                  <Link
                    href="/dashboard/cards"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted hover:text-foreground ${
                      pathname === "/dashboard/cards" ? "bg-muted font-medium text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <CardIcon className="h-5 w-5" />
                    <span>Cards</span>
                  </Link>
                  <Link
                    href="/dashboard/analytics"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted hover:text-foreground ${
                      pathname === "/dashboard/analytics"
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    <BarChart className="h-5 w-5" />
                    <span>Analytics</span>
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted hover:text-foreground ${
                      pathname === "/dashboard/profile"
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted hover:text-foreground ${
                      pathname === "/dashboard/settings"
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </nav>

                <div className="mt-auto">
                  <div className="mb-4 flex items-center justify-center">
                    <ThemeSelector />
                  </div>
                  <div className="rounded-lg border bg-card p-4">
                    <h3 className="mb-2 text-sm font-medium">Need Help?</h3>
                    <p className="mb-3 text-xs text-muted-foreground">
                      Our support team is available 24/7 to assist you with any questions.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Get Support
                    </Button>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 pt-16 md:pl-64">{children}</main>
      </div>

      <LogoutModal open={logoutModal.isOpen} onClose={logoutModal.onClose} />
    </div>
  )
}
