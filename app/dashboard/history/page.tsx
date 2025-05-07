"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowUpDown, ChevronDown, Download, Filter, History, Search } from "lucide-react"
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
import { useApp } from "@/context/app-context"
import DashboardLayout from "@/components/dashboard-layout"

export default function HistoryPage() {
  const { transactions, exportTransactions } = useApp()
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState("all")
  const [filteredTransactions, setFilteredTransactions] = useState(transactions)
  const [hasTransactions, setHasTransactions] = useState(false)

  useEffect(() => {
    setHasTransactions(transactions.length > 0)

    // Filter transactions based on search, type, and date
    const filtered = transactions.filter((transaction) => {
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

    setFilteredTransactions(filtered)
  }, [transactions, searchQuery, typeFilter, dateFilter])

  return (
    <DashboardLayout>
      <div className="container px-4 py-6 md:px-6">
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
                      <DropdownMenuCheckboxItem
                        checked={typeFilter.includes("add_funds")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setTypeFilter([...typeFilter, "add_funds"])
                          } else {
                            setTypeFilter(typeFilter.filter((type) => type !== "add_funds"))
                          }
                        }}
                      >
                        Add Funds
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={typeFilter.includes("card_payment")}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setTypeFilter([...typeFilter, "card_payment"])
                          } else {
                            setTypeFilter(typeFilter.filter((type) => type !== "card_payment"))
                          }
                        }}
                      >
                        Card Payment
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

                  <Button variant="outline" size="icon" onClick={exportTransactions}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {hasTransactions ? (
                  filteredTransactions.length > 0 ? (
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
                                  : transaction.type === "convert"
                                    ? "bg-blue-100 text-blue-600"
                                    : transaction.type === "add_funds"
                                      ? "bg-purple-100 text-purple-600"
                                      : "bg-orange-100 text-orange-600"
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
                                  : transaction.type === "convert"
                                    ? transaction.from
                                      ? `Converted from ${transaction.from}`
                                      : `Converted to ${transaction.to}`
                                    : transaction.type === "add_funds"
                                      ? "Added funds to wallet"
                                      : `Payment to ${transaction.to}`}
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
                                : transaction.type === "send" || transaction.type === "card_payment"
                                  ? "text-red-600"
                                  : "text-blue-600"
                            }`}
                          >
                            {transaction.type === "receive" || transaction.type === "add_funds" ? "+" : "-"}$
                            {transaction.amount.toFixed(2)}
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
                  )
                ) : (
                  <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
                    <History className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="mb-2 text-lg font-medium">No transaction history yet</p>
                    <p className="mb-6 text-sm text-muted-foreground">
                      Your transactions will appear here once you start using your wallet.
                    </p>
                    <div className="flex gap-4">
                      <Button asChild>
                        <Link href="/dashboard/send">Send Money</Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/dashboard/receive">Receive Money</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
