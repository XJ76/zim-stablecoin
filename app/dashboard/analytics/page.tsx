"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, BarChart3, Calendar, DollarSign, Download, PieChart, TrendingDown, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { ThemeSelector } from "@/components/theme-selector"
import DashboardLayout from "@/components/dashboard-layout"

// Sample data for charts
const monthlyData = [
  { name: "Jan", income: 1200, expenses: 900 },
  { name: "Feb", income: 1400, expenses: 1000 },
  { name: "Mar", income: 1300, expenses: 1100 },
  { name: "Apr", income: 1700, expenses: 1300 },
  { name: "May", income: 1600, expenses: 1200 },
  { name: "Jun", income: 1800, expenses: 1400 },
  { name: "Jul", income: 2000, expenses: 1500 },
  { name: "Aug", income: 2200, expenses: 1600 },
  { name: "Sep", income: 1900, expenses: 1400 },
  { name: "Oct", income: 2100, expenses: 1700 },
  { name: "Nov", income: 2300, expenses: 1800 },
  { name: "Dec", income: 2500, expenses: 2000 },
]

const categoryData = [
  { name: "Food & Dining", value: 30 },
  { name: "Transportation", value: 15 },
  { name: "Entertainment", value: 10 },
  { name: "Utilities", value: 20 },
  { name: "Shopping", value: 15 },
  { name: "Other", value: 10 },
]

const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280"]

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("year")
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <DashboardLayout>
      <div className="container px-4 py-6 md:px-6 md:py-8">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <ThemeSelector />
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$4,550.25</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-500">+12.5%</span> from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$2,250.00</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-500">+8.2%</span> from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$1,750.50</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-red-500">+5.1%</span> from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
                    <PieChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">22.2%</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-500">+2.5%</span> from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Income vs Expenses</CardTitle>
                    <CardDescription>Monthly comparison for {new Date().getFullYear()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={monthlyData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
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
                            dataKey="income"
                            stackId="1"
                            stroke="#10b981"
                            fill="#10b981"
                            fillOpacity={0.5}
                          />
                          <Area
                            type="monotone"
                            dataKey="expenses"
                            stackId="2"
                            stroke="#ef4444"
                            fill="#ef4444"
                            fillOpacity={0.5}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Expense Categories</CardTitle>
                    <CardDescription>Breakdown of your spending</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--background))",
                              borderColor: "hsl(var(--border))",
                            }}
                          />
                          <Legend />
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Spending</CardTitle>
                    <CardDescription>Your expenses by month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={monthlyData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--background))",
                              borderColor: "hsl(var(--border))",
                            }}
                          />
                          <Bar dataKey="expenses" fill="#ef4444" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Insights</CardTitle>
                    <CardDescription>Key observations about your finances</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Income Growth</h3>
                            <p className="text-sm text-muted-foreground">
                              Your income has increased by 15% compared to last year.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                            <BarChart3 className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Spending Pattern</h3>
                            <p className="text-sm text-muted-foreground">
                              Food & Dining is your highest expense category at 30% of total spending.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Seasonal Trends</h3>
                            <p className="text-sm text-muted-foreground">
                              Your spending tends to increase during December and January.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Detailed Analysis
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="income">
            <Card>
              <CardHeader>
                <CardTitle>Income Analysis</CardTitle>
                <CardDescription>Detailed breakdown of your income sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlyData}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                          }}
                        />
                        <Bar dataKey="income" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Income Sources</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-primary"></div>
                          <span>Salary</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">$1,800.00</span>
                          <span className="text-sm text-muted-foreground">80%</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-2 w-4/5 rounded-full bg-primary"></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                          <span>Freelance Work</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">$300.00</span>
                          <span className="text-sm text-muted-foreground">13%</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-2 w-[13%] rounded-full bg-blue-500"></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                          <span>Investments</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">$150.00</span>
                          <span className="text-sm text-muted-foreground">7%</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-2 w-[7%] rounded-full bg-amber-500"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Download Income Report
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="expenses">
            <Card>
              <CardHeader>
                <CardTitle>Expense Analysis</CardTitle>
                <CardDescription>Detailed breakdown of your spending</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                          }}
                        />
                        <Legend />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Top Expenses</h3>
                    <div className="space-y-4">
                      {[
                        { merchant: "Supermarket", date: "2023-03-15", amount: 120.5, category: "Food & Dining" },
                        { merchant: "Fuel Station", date: "2023-03-12", amount: 45.0, category: "Transportation" },
                        { merchant: "Internet Provider", date: "2023-03-10", amount: 60.0, category: "Utilities" },
                        { merchant: "Shopping Mall", date: "2023-03-05", amount: 85.75, category: "Shopping" },
                        { merchant: "Cinema", date: "2023-03-02", amount: 25.0, category: "Entertainment" },
                      ].map((expense, index) => (
                        <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <p className="font-medium">{expense.merchant}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(expense.date).toLocaleDateString()} • {expense.category}
                            </p>
                          </div>
                          <p className="font-medium text-red-600">-${expense.amount.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Download Expense Report
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="savings">
            <Card>
              <CardHeader>
                <CardTitle>Savings Analysis</CardTitle>
                <CardDescription>Track your savings progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <h3 className="mb-2 text-lg font-medium">Savings Rate</h3>
                      <div className="text-3xl font-bold">22.2%</div>
                      <p className="text-sm text-muted-foreground">of your income is being saved</p>
                      <div className="mt-4 h-2 rounded-full bg-muted">
                        <div className="h-2 w-[22%] rounded-full bg-primary"></div>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Target: 25% • <span className="text-green-500">+2.5%</span> from last month
                      </p>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="mb-2 text-lg font-medium">Emergency Fund</h3>
                      <div className="text-3xl font-bold">$3,000</div>
                      <p className="text-sm text-muted-foreground">of $6,000 target (3 months expenses)</p>
                      <div className="mt-4 h-2 rounded-full bg-muted">
                        <div className="h-2 w-1/2 rounded-full bg-amber-500"></div>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">50% complete • Est. completion in 6 months</p>
                    </div>
                  </div>

                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={monthlyData}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                          }}
                        />
                        <Area type="monotone" dataKey="income" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                        <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="mb-4 text-lg font-medium">Savings Goals</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <div>
                            <p className="font-medium">Emergency Fund</p>
                            <p className="text-sm text-muted-foreground">$3,000 of $6,000</p>
                          </div>
                          <p className="text-sm font-medium">50%</p>
                        </div>
                        <div className="h-2 rounded-full bg-muted">
                          <div className="h-2 w-1/2 rounded-full bg-amber-500"></div>
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <div>
                            <p className="font-medium">New Laptop</p>
                            <p className="text-sm text-muted-foreground">$800 of $1,200</p>
                          </div>
                          <p className="text-sm font-medium">67%</p>
                        </div>
                        <div className="h-2 rounded-full bg-muted">
                          <div className="h-2 w-[67%] rounded-full bg-blue-500"></div>
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <div>
                            <p className="font-medium">Vacation</p>
                            <p className="text-sm text-muted-foreground">$500 of $2,000</p>
                          </div>
                          <p className="text-sm font-medium">25%</p>
                        </div>
                        <div className="h-2 rounded-full bg-muted">
                          <div className="h-2 w-1/4 rounded-full bg-purple-500"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Add New Savings Goal
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
