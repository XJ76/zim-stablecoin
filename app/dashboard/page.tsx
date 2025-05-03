"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowUpDown,
  BarChart3,
  CreditCard,
  DollarSign,
  Download,
  History,
  Plus,
  Send,
  Settings,
  User,
  Wallet,
  Bell,
  ChevronDown,
  Search,
  Menu,
  X,
  Home,
  CreditCardIcon as CardIcon,
  BarChart,
  HelpCircle,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useMobile } from "@/hooks/use-mobile"
import { ThemeSelector } from "@/components/theme-selector"

const chartData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 500 },
  { name: "Apr", value: 280 },
  { name: "May", value: 590 },
  { name: "Jun", value: 430 },
  { name: "Jul", value: 650 },
]

const pieData = [
  { name: "Savings", value: 60 },
  { name: "Spending", value: 25 },
  { name: "Investments", value: 15 },
]

const COLORS = ["#10b981", "#f59e0b", "#3b82f6"]

const transactions = [
  {
    id: "1",
    type: "receive",
    amount: 250,
    date: "2023-03-15",
    from: "Chiedza M.",
    status: "completed",
  },
  {
    id: "2",
    type: "send",
    amount: 100,
    date: "2023-03-14",
    to: "Farai N.",
    status: "completed",
  },
  {
    id: "3",
    type: "convert",
    amount: 500,
    date: "2023-03-12",
    to: "ZWL",
    status: "completed",
  },
  {
    id: "4",
    type: "receive",
    amount: 1000,
    date: "2023-03-10",
    from: "Business Account",
    status: "completed",
  },
]

export default function DashboardPage() {
  const [balance, setBalance] = useState(1750)
  const [zwlRate, setZwlRate] = useState(3500)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const isMobile = useMobile()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

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

            <ThemeSelector />

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
                      <BarChart3 className="h-4 w-4" />
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
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Add Funds</DropdownMenuItem>
                        <DropdownMenuItem>Withdraw</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mb-1 text-2xl font-bold">${balance.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">
                    ≈ Z${(balance * zwlRate).toLocaleString()} at current rate
                  </div>
                </div>

                <nav className="space-y-1">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/dashboard/send"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Send className="h-5 w-5" />
                    <span>Send</span>
                  </Link>
                  <Link
                    href="/dashboard/receive"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <ArrowUpDown className="h-5 w-5 rotate-90" />
                    <span>Receive</span>
                  </Link>
                  <Link
                    href="/dashboard/convert"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <ArrowUpDown className="h-5 w-5" />
                    <span>Convert</span>
                  </Link>
                  <Link
                    href="/dashboard/history"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <History className="h-5 w-5" />
                    <span>History</span>
                  </Link>
                  <Link
                    href="/dashboard/cards"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <CardIcon className="h-5 w-5" />
                    <span>Cards</span>
                  </Link>
                  <Link
                    href="/dashboard/analytics"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <BarChart className="h-5 w-5" />
                    <span>Analytics</span>
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
        <main className="flex-1 pt-16 md:pl-64">
          <div className="container px-4 py-6 md:px-6 md:py-8">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-[calc(100vh-8rem)] items-center justify-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight">Welcome back, Tendai</h1>
                      <p className="text-muted-foreground">Here&apos;s an overview of your stablecoin wallet</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Funds
                      </Button>
                    </div>
                  </div>

                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6 w-full justify-start">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="transactions">Transactions</TabsTrigger>
                      <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        >
                          <Card className="overflow-hidden border-none shadow-md">
                            <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-full bg-primary/10"></div>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                              <Wallet className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
                              <p className="text-xs text-muted-foreground">
                                ≈ Z${(balance * zwlRate).toLocaleString()} at current rate
                              </p>
                            </CardContent>
                            <div className="h-1 w-full bg-gradient-to-r from-primary to-primary/60"></div>
                          </Card>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          <Card className="overflow-hidden border-none shadow-md">
                            <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-full bg-orange-500/10"></div>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">Exchange Rate</CardTitle>
                              <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">1:3,500</div>
                              <p className="text-xs text-muted-foreground">USD to ZWL</p>
                            </CardContent>
                            <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-orange-500/60"></div>
                          </Card>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          <Card className="overflow-hidden border-none shadow-md">
                            <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-full bg-blue-500/10"></div>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">Monthly Transactions</CardTitle>
                              <History className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">24</div>
                              <p className="text-xs text-muted-foreground">+8% from last month</p>
                            </CardContent>
                            <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-blue-500/60"></div>
                          </Card>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                        >
                          <Card className="overflow-hidden border-none shadow-md">
                            <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-full bg-green-500/10"></div>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">Savings Goal</CardTitle>
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">75%</div>
                              <p className="text-xs text-muted-foreground">$1,500 of $2,000 target</p>
                            </CardContent>
                            <div className="h-1 w-3/4 bg-gradient-to-r from-green-500 to-green-500/60"></div>
                          </Card>
                        </motion.div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-7">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          className="md:col-span-4"
                        >
                          <Card className="border-none shadow-md">
                            <CardHeader>
                              <CardTitle>Balance History</CardTitle>
                              <CardDescription>Your wallet balance over time</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart
                                    data={chartData}
                                    margin={{
                                      top: 10,
                                      right: 30,
                                      left: 0,
                                      bottom: 0,
                                    }}
                                  >
                                    <defs>
                                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip
                                      contentStyle={{
                                        backgroundColor: "hsl(var(--background))",
                                        borderColor: "hsl(var(--border))",
                                      }}
                                    />
                                    <Area
                                      type="monotone"
                                      dataKey="value"
                                      stroke="hsl(var(--primary))"
                                      fillOpacity={1}
                                      fill="url(#colorValue)"
                                    />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                          className="md:col-span-3"
                        >
                          <Card>
                            <CardHeader>
                              <CardTitle>Allocation</CardTitle>
                              <CardDescription>How your funds are allocated</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie
                                      data={pieData}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={60}
                                      outerRadius={80}
                                      paddingAngle={5}
                                      dataKey="value"
                                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                      labelLine={false}
                                    >
                                      {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                      ))}
                                    </Pie>
                                    <Tooltip
                                      contentStyle={{
                                        backgroundColor: "hsl(var(--background))",
                                        borderColor: "hsl(var(--border))",
                                      }}
                                    />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                      >
                        <Card className="border-none shadow-md">
                          <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>Your latest stablecoin activity</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {transactions.map((transaction) => (
                                <div
                                  key={transaction.id}
                                  className="flex items-center justify-between rounded-lg bg-background p-3 shadow-sm transition-colors hover:bg-muted/50"
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                        transaction.type === "receive"
                                          ? "bg-green-100 text-green-600"
                                          : transaction.type === "send"
                                            ? "bg-red-100 text-red-600"
                                            : "bg-blue-100 text-blue-600"
                                      }`}
                                    >
                                      {transaction.type === "receive" ? (
                                        <ArrowUpDown className="h-5 w-5 rotate-90" />
                                      ) : transaction.type === "send" ? (
                                        <ArrowUpDown className="h-5 w-5 -rotate-90" />
                                      ) : (
                                        <ArrowUpDown className="h-5 w-5" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {transaction.type === "receive"
                                          ? `Received from ${transaction.from}`
                                          : transaction.type === "send"
                                            ? `Sent to ${transaction.to}`
                                            : `Converted to ${transaction.to}`}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {new Date(transaction.date).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p
                                      className={`font-medium ${
                                        transaction.type === "receive"
                                          ? "text-green-600"
                                          : transaction.type === "send"
                                            ? "text-red-600"
                                            : "text-blue-600"
                                      }`}
                                    >
                                      {transaction.type === "receive" ? "+" : "-"}${transaction.amount.toFixed(2)}
                                    </p>
                                    <p className="text-sm text-muted-foreground capitalize">{transaction.status}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button variant="outline" className="w-full">
                              View All Transactions
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="transactions">
                      <Card>
                        <CardHeader>
                          <CardTitle>Transaction History</CardTitle>
                          <CardDescription>View all your past transactions</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>Transaction history content will go here...</p>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="analytics">
                      <Card>
                        <CardHeader>
                          <CardTitle>Analytics</CardTitle>
                          <CardDescription>Detailed insights into your financial activity</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>Analytics content will go here...</p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}

