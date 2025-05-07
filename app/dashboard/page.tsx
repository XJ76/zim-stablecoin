"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpDown, BarChart3, CreditCard, Download, History, Plus, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import DashboardLayout from "@/components/dashboard-layout"
import { useApp } from "@/context/app-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

export default function DashboardPage() {
  const { user, balance, transactions, zwlRate, exportTransactions, addFunds } = useApp()
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [addFundsAmount, setAddFundsAmount] = useState("")
  const [isAddingFunds, setIsAddingFunds] = useState(false)
  const [isAddFundsDialogOpen, setIsAddFundsDialogOpen] = useState(false)
  const [hasTransactions, setHasTransactions] = useState(false)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    // Check if user has transactions
    setHasTransactions(transactions.length > 0)

    return () => clearTimeout(timer)
  }, [transactions])

  const handleAddFunds = async () => {
    const amount = Number.parseFloat(addFundsAmount)
    if (isNaN(amount) || amount <= 0) return

    setIsAddingFunds(true)

    // Simulate API call
    setTimeout(() => {
      addFunds(amount)
      setIsAddingFunds(false)
      setAddFundsAmount("")
      setIsAddFundsDialogOpen(false)
    }, 1500)
  }

  return (
    <DashboardLayout>
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
                  <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.firstName || "User"}</h1>
                  <p className="text-muted-foreground">Here&apos;s an overview of your stablecoin wallet</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={exportTransactions}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Dialog open={isAddFundsDialogOpen} onOpenChange={setIsAddFundsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Funds
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Funds to Your Wallet</DialogTitle>
                        <DialogDescription>Enter the amount you want to add to your wallet balance.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount (USD)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input
                              id="amount"
                              type="number"
                              placeholder="0.00"
                              className="pl-8"
                              value={addFundsAmount}
                              onChange={(e) => setAddFundsAmount(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddFundsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddFunds}
                          disabled={isAddingFunds || !addFundsAmount || Number.parseFloat(addFundsAmount) <= 0}
                        >
                          {isAddingFunds ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                              Processing...
                            </>
                          ) : (
                            "Add Funds"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
                          <div className="text-2xl font-bold">{transactions.length}</div>
                          <p className="text-xs text-muted-foreground">
                            {transactions.length === 0 ? "No transactions yet" : "+8% from last month"}
                          </p>
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
                          <div className="text-2xl font-bold">
                            {balance > 0 ? Math.min(Math.round((balance / 2000) * 100), 100) : 0}%
                          </div>
                          <p className="text-xs text-muted-foreground">${balance.toFixed(2)} of $2,000 target</p>
                        </CardContent>
                        <div
                          className={`h-1 bg-gradient-to-r from-green-500 to-green-500/60`}
                          style={{ width: `${balance > 0 ? Math.min((balance / 2000) * 100, 100) : 0}%` }}
                        ></div>
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
                          {hasTransactions ? (
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
                          ) : (
                            <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
                              <BarChart3 className="mb-2 h-10 w-10 text-muted-foreground" />
                              <p className="mb-2 text-lg font-medium">No balance history yet</p>
                              <p className="text-sm text-muted-foreground">
                                Your balance history will appear here once you start using your wallet.
                              </p>
                            </div>
                          )}
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
                          {hasTransactions ? (
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
                          ) : (
                            <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
                              <CreditCard className="mb-2 h-10 w-10 text-muted-foreground" />
                              <p className="mb-2 text-lg font-medium">No allocation data yet</p>
                              <p className="text-sm text-muted-foreground">
                                Your fund allocation will appear here once you start using your wallet.
                              </p>
                            </div>
                          )}
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
                        {transactions.length > 0 ? (
                          <div className="space-y-4">
                            {transactions.slice(0, 4).map((transaction) => (
                              <div
                                key={transaction.id}
                                className="flex items-center justify-between rounded-lg bg-background p-3 shadow-sm transition-colors hover:bg-muted/50"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                      transaction.type === "receive" || transaction.type === "add_funds"
                                        ? "bg-green-100 text-green-600"
                                        : transaction.type === "send"
                                          ? "bg-red-100 text-red-600"
                                          : "bg-blue-100 text-blue-600"
                                    }`}
                                  >
                                    {transaction.type === "receive" || transaction.type === "add_funds" ? (
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
                                          : transaction.type === "add_funds"
                                            ? "Added funds to wallet"
                                            : transaction.from
                                              ? `Converted from ${transaction.from}`
                                              : `Converted to ${transaction.to}`}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(transaction.date).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p
                                    className={`font-medium ${
                                      transaction.type === "receive" || transaction.type === "add_funds"
                                        ? "text-green-600"
                                        : transaction.type === "send"
                                          ? "text-red-600"
                                          : "text-blue-600"
                                    }`}
                                  >
                                    {transaction.type === "receive" || transaction.type === "add_funds" ? "+" : "-"}$
                                    {transaction.amount.toFixed(2)}
                                  </p>
                                  <p className="text-sm text-muted-foreground capitalize">{transaction.status}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
                            <p className="mb-2 text-lg font-medium">No transactions yet</p>
                            <p className="text-sm text-muted-foreground">
                              Your transaction history will appear here once you start using your wallet.
                            </p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/dashboard/history">View All Transactions</Link>
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
                      {transactions.length > 0 ? (
                        <div className="space-y-4">
                          {transactions.map((transaction) => (
                            <div
                              key={transaction.id}
                              className="flex items-center justify-between rounded-lg border p-4"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                    transaction.type === "receive" || transaction.type === "add_funds"
                                      ? "bg-green-100 text-green-600"
                                      : transaction.type === "send"
                                        ? "bg-red-100 text-red-600"
                                        : "bg-blue-100 text-blue-600"
                                  }`}
                                >
                                  {transaction.type === "receive" || transaction.type === "add_funds" ? (
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
                                        : transaction.type === "add_funds"
                                          ? "Added funds to wallet"
                                          : transaction.from
                                            ? `Converted from ${transaction.from}`
                                            : `Converted to ${transaction.to}`}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(transaction.date).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p
                                  className={`font-medium ${
                                    transaction.type === "receive" || transaction.type === "add_funds"
                                      ? "text-green-600"
                                      : transaction.type === "send"
                                        ? "text-red-600"
                                        : "text-blue-600"
                                  }`}
                                >
                                  {transaction.type === "receive" || transaction.type === "add_funds" ? "+" : "-"}$
                                  {transaction.amount.toFixed(2)}
                                </p>
                                <p className="text-sm text-muted-foreground capitalize">{transaction.status}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
                          <p className="mb-2 text-lg font-medium">No transactions yet</p>
                          <p className="text-sm text-muted-foreground">
                            Your transaction history will appear here once you start using your wallet.
                          </p>
                        </div>
                      )}
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
                      {transactions.length > 0 ? (
                        <p>Analytics content will go here...</p>
                      ) : (
                        <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
                          <p className="mb-2 text-lg font-medium">No data to analyze yet</p>
                          <p className="text-sm text-muted-foreground">
                            Start using your wallet to see analytics and insights about your spending habits.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}
