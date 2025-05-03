"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, CreditCard, DollarSign, Eye, EyeOff, Plus, RefreshCw, Shield, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ThemeSelector } from "@/components/theme-selector"
import DashboardLayout from "@/components/dashboard-layout"

export default function CardsPage() {
  const [showCardDetails, setShowCardDetails] = useState(false)
  const [activeTab, setActiveTab] = useState("virtual")
  const [freezeCard, setFreezeCard] = useState(false)
  const [onlinePayments, setOnlinePayments] = useState(true)
  const [internationalPayments, setInternationalPayments] = useState(false)

  const virtualCard = {
    number: "4539 **** **** 5271",
    fullNumber: "4539 7852 3641 5271",
    name: "TENDAI MOYO",
    expiry: "09/27",
    cvv: "***",
    fullCvv: "123",
    balance: 750.25,
    limit: 2000,
    status: "Active",
  }

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
            <h1 className="text-2xl font-bold tracking-tight">Cards</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSelector />
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Request New Card
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="virtual">Virtual Card</TabsTrigger>
            <TabsTrigger value="physical">Physical Card</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="virtual" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="md:col-span-2 overflow-hidden">
                  <CardHeader className="bg-primary text-primary-foreground">
                    <CardTitle className="flex items-center justify-between">
                      <span>Virtual Debit Card</span>
                      <DollarSign className="h-6 w-6" />
                    </CardTitle>
                    <CardDescription className="text-primary-foreground/80">
                      For online and international payments
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="relative h-56 bg-gradient-to-r from-primary to-primary/60 p-6 text-primary-foreground">
                      <div className="absolute right-6 top-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-primary-foreground"
                          onClick={() => setShowCardDetails(!showCardDetails)}
                        >
                          {showCardDetails ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                      </div>
                      <div className="mt-6 space-y-6">
                        <div>
                          <p className="text-sm text-primary-foreground/70">Card Number</p>
                          <p className="font-mono text-xl font-medium">
                            {showCardDetails ? virtualCard.fullNumber : virtualCard.number}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm text-primary-foreground/70">Card Holder</p>
                            <p className="font-medium">{virtualCard.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-primary-foreground/70">Expires</p>
                            <p className="font-medium">{virtualCard.expiry}</p>
                          </div>
                          <div>
                            <p className="text-sm text-primary-foreground/70">CVV</p>
                            <p className="font-medium">{showCardDetails ? virtualCard.fullCvv : virtualCard.cvv}</p>
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-6 right-6">
                        <div className="flex h-10 w-16 items-center justify-center rounded-md bg-white/20 backdrop-blur-sm">
                          <CreditCard className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 divide-x border-t">
                      <div className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">Available Balance</p>
                        <p className="text-2xl font-bold">${virtualCard.balance.toFixed(2)}</p>
                      </div>
                      <div className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">Monthly Limit</p>
                        <p className="text-2xl font-bold">${virtualCard.limit.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t p-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          virtualCard.status === "Active" ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-sm">{virtualCard.status}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                      </Button>
                      <Button variant="outline" size="sm">
                        <Wallet className="mr-2 h-4 w-4" />
                        Top Up
                      </Button>
                    </div>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Card Settings</CardTitle>
                    <CardDescription>Manage your virtual card settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="freeze-card">Freeze Card</Label>
                        <p className="text-sm text-muted-foreground">Temporarily disable your card for security</p>
                      </div>
                      <Switch id="freeze-card" checked={freezeCard} onCheckedChange={setFreezeCard} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="online-payments">Online Payments</Label>
                        <p className="text-sm text-muted-foreground">Allow online and e-commerce transactions</p>
                      </div>
                      <Switch id="online-payments" checked={onlinePayments} onCheckedChange={setOnlinePayments} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="international-payments">International Payments</Label>
                        <p className="text-sm text-muted-foreground">Allow transactions outside Zimbabwe</p>
                      </div>
                      <Switch
                        id="international-payments"
                        checked={internationalPayments}
                        onCheckedChange={setInternationalPayments}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <Shield className="mr-2 h-4 w-4" />
                      Security Settings
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Card Limits</CardTitle>
                    <CardDescription>Manage your spending limits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <Label>Daily Withdrawal</Label>
                        <span className="text-sm font-medium">$500 / $1,000</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-2 w-1/2 rounded-full bg-primary"></div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <Label>Monthly Spending</Label>
                        <span className="text-sm font-medium">$750 / $2,000</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-2 w-[37.5%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <Label>International Transactions</Label>
                        <span className="text-sm font-medium">$200 / $1,000</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-2 w-[20%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Request Limit Increase
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="physical">
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>Physical Card</CardTitle>
                <CardDescription>
                  You don't have a physical card yet. Request one to use at ATMs and POS terminals.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="mb-4 rounded-full bg-muted p-6">
                  <CreditCard className="h-10 w-10 text-muted-foreground" />
                </div>
                <p className="mb-6 max-w-md text-center text-muted-foreground">
                  Get a physical card to withdraw cash at ATMs and make payments at stores across Zimbabwe.
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Request Physical Card
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Card Transactions</CardTitle>
                <CardDescription>Recent transactions made with your cards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      merchant: "Netflix",
                      date: "2023-03-15",
                      amount: 12.99,
                      type: "Subscription",
                      card: "Virtual",
                    },
                    {
                      merchant: "Amazon",
                      date: "2023-03-12",
                      amount: 34.5,
                      type: "Online Shopping",
                      card: "Virtual",
                    },
                    {
                      merchant: "Spotify",
                      date: "2023-03-10",
                      amount: 9.99,
                      type: "Subscription",
                      card: "Virtual",
                    },
                    {
                      merchant: "Uber",
                      date: "2023-03-08",
                      amount: 15.75,
                      type: "Transportation",
                      card: "Virtual",
                    },
                    {
                      merchant: "Steam",
                      date: "2023-03-05",
                      amount: 29.99,
                      type: "Entertainment",
                      card: "Virtual",
                    },
                  ].map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{transaction.merchant}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()} • {transaction.type}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-red-600">-${transaction.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{transaction.card} Card</p>
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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

