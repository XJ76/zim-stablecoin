"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data
const dailyData = [
  { name: "Jan", value: 1000 },
  { name: "Feb", value: 1200 },
  { name: "Mar", value: 1100 },
  { name: "Apr", value: 1300 },
  { name: "May", value: 1500 },
  { name: "Jun", value: 1400 },
  { name: "Jul", value: 1600 },
  { name: "Aug", value: 1800 },
  { name: "Sep", value: 2000 },
  { name: "Oct", value: 2200 },
  { name: "Nov", value: 2400 },
  { name: "Dec", value: 2600 },
]

const weeklyData = [
  { name: "Week 1", value: 1200 },
  { name: "Week 2", value: 1400 },
  { name: "Week 3", value: 1600 },
  { name: "Week 4", value: 1800 },
]

const monthlyData = [
  { name: "Jan", value: 1000 },
  { name: "Feb", value: 1200 },
  { name: "Mar", value: 1100 },
  { name: "Apr", value: 1300 },
  { name: "May", value: 1500 },
  { name: "Jun", value: 1400 },
  { name: "Jul", value: 1600 },
  { name: "Aug", value: 1800 },
  { name: "Sep", value: 2000 },
  { name: "Oct", value: 2200 },
  { name: "Nov", value: 2400 },
  { name: "Dec", value: 2600 },
]

export default function StablecoinStats() {
  const [activeTab, setActiveTab] = useState("monthly")
  const [chartData, setChartData] = useState(monthlyData)
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    transactions: 0,
    volume: 0,
    marketCap: 0,
  })

  useEffect(() => {
    switch (activeTab) {
      case "daily":
        setChartData(dailyData)
        break
      case "weekly":
        setChartData(weeklyData)
        break
      case "monthly":
        setChartData(monthlyData)
        break
      default:
        setChartData(monthlyData)
    }
  }, [activeTab])

  useEffect(() => {
    const targetStats = {
      users: 25000,
      transactions: 150000,
      volume: 5000000,
      marketCap: 10000000,
    }

    const interval = setInterval(() => {
      setAnimatedStats((prev) => ({
        users: Math.min(prev.users + 250, targetStats.users),
        transactions: Math.min(prev.transactions + 1500, targetStats.transactions),
        volume: Math.min(prev.volume + 50000, targetStats.volume),
        marketCap: Math.min(prev.marketCap + 100000, targetStats.marketCap),
      }))

      if (
        animatedStats.users === targetStats.users &&
        animatedStats.transactions === targetStats.transactions &&
        animatedStats.volume === targetStats.volume &&
        animatedStats.marketCap === targetStats.marketCap
      ) {
        clearInterval(interval)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [animatedStats])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(animatedStats.users)}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(animatedStats.transactions)}</div>
              <p className="text-xs text-muted-foreground">+18% from last month</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trading Volume</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${formatNumber(animatedStats.volume)}</div>
              <p className="text-xs text-muted-foreground">+7% from last month</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${formatNumber(animatedStats.marketCap)}</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="rounded-lg border bg-background p-4"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Stablecoin Growth</h3>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
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
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  )
}
