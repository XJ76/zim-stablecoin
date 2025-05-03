"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowUpDown, ChevronDown, DollarSign, Download, Filter, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const transactions = [
  {
    id: "1",
    type: "receive",
    amount: 250,
    date: "2023-03-15T14:30:00",
    from: "Chiedza M.",
    status: "completed",
  },
  {
    id: "2",
    type: "send",
    amount: 100,
    date: "2023-03-14T09:15:00",
    to: "Farai N.",
    status: "completed",
  },
  {
    id: "3",
    type: "convert",
    amount: 500,
    date: "2023-03-12T16:45:00",
    to: "ZWL",
    status: "completed",
  },
  {
    id: "4",
    type: "receive",
    amount: 1000,
    date: "2023-03-10T11:20:00",
    from: "Business Account",
    status: "completed",
  },
  {
    id: "5",
    type: "send",
    amount: 75,
    date: "2023-03-08T13:10:00",
    to: "Tendai R.",
    status: "completed",
  },
  {
    id: "6",
    type: "convert",
    amount: 300,
    date: "2023-03-05T10:30:00",
    from: "ZWL",
    status: "completed",
  },
  {
    id: "7",
    type: "receive",
    amount: 450,
    date: "2023-03-01T15:45:00",
    from: "Tafadzwa M.",
    status: "completed",
  },
  {
    id: "8",
    type: "send",
    amount: 200,
    date: "2023-02-28T09:20:00",
    to: "Charity Fund",
    status: "completed",
  },
]

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState("all")

  const filteredTransactions = transactions.filter((transaction) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      searchQuery === "" ||
      transaction.id.toLowerCase().includes(searchLower) ||
      transaction.type.toLowerCase().includes(searchLower) ||
      (transaction.from && transaction.from.toLowerCase().includes(searchLower)) ||
      (transaction.to && transaction.to.toLowerCase().includes(searchLower))

    // Type filter
    const matchesType = typeFilter.length === 0 || typeFilter.includes(transaction.type)

    // Date filter
    let matchesDate = true
    const txDate = new Date(transaction.date)
    const now = new Date()

    if (dateFilter === "today") {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      matchesDate = txDate >= today
    } else if (dateFilter === "week") {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      matchesDate = txDate >= weekAgo
    } else if (dateFilter === "month") {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      matchesDate = txDate >= monthAgo
    }

    return matchesSearch && matchesType && matchesDate
  })

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">Zimbabwe Stablecoin</span>
          </Link>
          <nav className="hidden md:flex md:gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground">
              Dashboard
            </Link>
            <Link href="/dashboard/send" className="text-sm font-medium text-muted-foreground">
              Send
            </Link>
            <Link href="/dashboard/receive" className="text-sm font-medium text-muted-foreground">
              Receive
            </Link>
            <Link href="/dashboard/convert" className="text-sm font-medium text-muted-foreground">
              Convert
            </Link>
            <Link href="/dashboard/history" className="text-sm font-medium text-primary">
              History
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 py-6">
        <div className="container px-4 md:px-6">
          <div className="mb-6 flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Transaction History</h1>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Your Transactions</CardTitle>
                <CardDescription>View and filter your transaction history.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex gap-1">
                          <Filter className="h-4 w-4" />
                          Type
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                          checked={typeFilter.includes("send")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setTypeFilter([...typeFilter, "send"])
                            } else {
                              setTypeFilter(typeFilter.filter((type) => type !== "send"))
                            }
                          }}
                        >
                          Send
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={typeFilter.includes("receive")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setTypeFilter([...typeFilter, "receive"])
                            } else {
                              setTypeFilter(typeFilter.filter((type) => type !== "receive"))
                            }
                          }}
                        >
                          Receive
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={typeFilter.includes("convert")}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setTypeFilter([...typeFilter, "convert"])
                            } else {
                              setTypeFilter(typeFilter.filter((type) => type !== "convert"))
                            }
                          }}
                        >
                          Convert
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Date Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">Last 7 Days</SelectItem>
                        <SelectItem value="month">Last 30 Days</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between rounded-lg border p-4"
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
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
                      <p className="mb-2 text-lg font-medium">No transactions found</p>
                      <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

