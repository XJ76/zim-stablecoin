"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  Eye,
  EyeOff,
  Plus,
  RefreshCw,
  Shield,
  Wallet,
  Check,
  AlertTriangle,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ThemeSelector } from "@/components/theme-selector"
import DashboardLayout from "@/components/dashboard-layout"
import { useApp } from "@/context/app-context"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CardsPage() {
  const {
    cards,
    updateCard,
    addCard,
    topUpCard,
    freezeCard: freezeCardAction,
    updateCardSettings,
    requestLimitIncrease: requestLimitIncreaseAction,
    requestPhysicalCard: requestPhysicalCardAction,
    makeCardPayment,
  } = useApp()
  const { toast } = useToast()

  const [showCardDetails, setShowCardDetails] = useState(false)
  const [activeTab, setActiveTab] = useState("virtual")
  const [isCardFrozen, setIsCardFrozen] = useState(false)
  const [onlinePayments, setOnlinePayments] = useState(true)
  const [internationalPayments, setInternationalPayments] = useState(false)

  const [isRequestingCard, setIsRequestingCard] = useState(false)
  const [isTopUpDialogOpen, setIsTopUpDialogOpen] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState(100)

  const [isRequestingLimitIncrease, setIsRequestingLimitIncrease] = useState(false)
  const [limitIncreaseAmount, setLimitIncreaseAmount] = useState(500)

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSecurityDialogOpen, setIsSecurityDialogOpen] = useState(false)

  const [isSimulatePaymentOpen, setIsSimulatePaymentOpen] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState(50)
  const [paymentMerchant, setPaymentMerchant] = useState("Amazon")
  const [paymentCategory, setPaymentCategory] = useState("Shopping")
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // Get the virtual card from the cards array
  const virtualCard = cards.find((card) => card.type === "virtual") || {
    id: "default-card",
    type: "virtual",
    number: "4539 **** **** 5271",
    fullNumber: "4539 7852 3641 5271",
    name: "CARD HOLDER",
    expiry: "09/27",
    cvv: "***",
    fullCvv: "123",
    balance: 750.25,
    limit: 2000,
    status: "active",
    settings: {
      onlinePayments: true,
      internationalPayments: false,
      contactlessPayments: true,
      atmWithdrawals: true,
    },
  }

  const physicalCard = cards.find((card) => card.type === "physical")

  // Initialize state from card data
  useEffect(() => {
    if (virtualCard) {
      setIsCardFrozen(virtualCard.status === "frozen")
      setOnlinePayments(virtualCard.settings?.onlinePayments ?? true)
      setInternationalPayments(virtualCard.settings?.internationalPayments ?? false)
    }
  }, [virtualCard])

  const handleFreezeCard = async (checked: boolean) => {
    setIsCardFrozen(checked)
    try {
      await freezeCardAction(virtualCard.id, checked)
    } catch (error) {
      // Revert state if action fails
      setIsCardFrozen(!checked)
      toast({
        title: "Error",
        description: "Failed to update card status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleOnlinePayments = async (checked: boolean) => {
    setOnlinePayments(checked)
    try {
      await updateCardSettings(virtualCard.id, { onlinePayments: checked })
    } catch (error) {
      // Revert state if action fails
      setOnlinePayments(!checked)
      toast({
        title: "Error",
        description: "Failed to update card settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInternationalPayments = async (checked: boolean) => {
    setInternationalPayments(checked)
    try {
      await updateCardSettings(virtualCard.id, { internationalPayments: checked })
    } catch (error) {
      // Revert state if action fails
      setInternationalPayments(!checked)
      toast({
        title: "Error",
        description: "Failed to update card settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRequestCard = async () => {
    setIsRequestingCard(true)
    try {
      await requestPhysicalCardAction()
      // Switch to virtual tab after requesting physical card
      setTimeout(() => {
        setActiveTab("physical")
      }, 500)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request physical card. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRequestingCard(false)
    }
  }

  const handleTopUp = async () => {
    if (topUpAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      })
      return
    }

    try {
      await topUpCard(virtualCard.id, topUpAmount)
      setIsTopUpDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to top up card. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "Card Refreshed",
        description: "Your card information has been refreshed.",
      })
    }, 1000)
  }

  const handleRequestLimitIncrease = async () => {
    setIsRequestingLimitIncrease(true)
    try {
      const newLimit = virtualCard.limit + limitIncreaseAmount
      await requestLimitIncreaseAction(virtualCard.id, newLimit)
      setIsRequestingLimitIncrease(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to increase card limit. Please try again.",
        variant: "destructive",
      })
      setIsRequestingLimitIncrease(false)
    }
  }

  const handleSecuritySettings = () => {
    setIsSecurityDialogOpen(true)
  }

  const handleSimulatePayment = async () => {
    if (paymentAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      })
      return
    }

    setIsProcessingPayment(true)
    try {
      await makeCardPayment(virtualCard.id, paymentAmount, paymentMerchant, paymentCategory)
      setIsSimulatePaymentOpen(false)
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessingPayment(false)
    }
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
            <Button size="sm" onClick={() => setActiveTab("physical")}>
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
                      {isCardFrozen && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                          <div className="flex flex-col items-center gap-2 rounded-lg bg-black/50 p-4 text-white">
                            <Lock className="h-8 w-8" />
                            <p className="text-lg font-bold">Card Frozen</p>
                            <p className="text-sm">This card is temporarily disabled</p>
                          </div>
                        </div>
                      )}
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
                          virtualCard.status === "active" ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-sm capitalize">{virtualCard.status}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                        {isRefreshing ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                            Refreshing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refresh
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setIsTopUpDialogOpen(true)}>
                        <Wallet className="mr-2 h-4 w-4" />
                        Top Up
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setIsSimulatePaymentOpen(true)}>
                        <DollarSign className="mr-2 h-4 w-4" />
                        Simulate Payment
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
                      <Switch id="freeze-card" checked={isCardFrozen} onCheckedChange={handleFreezeCard} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="online-payments">Online Payments</Label>
                        <p className="text-sm text-muted-foreground">Allow online and e-commerce transactions</p>
                      </div>
                      <Switch
                        id="online-payments"
                        checked={onlinePayments}
                        onCheckedChange={handleOnlinePayments}
                        disabled={isCardFrozen}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="international-payments">International Payments</Label>
                        <p className="text-sm text-muted-foreground">Allow transactions outside Zimbabwe</p>
                      </div>
                      <Switch
                        id="international-payments"
                        checked={internationalPayments}
                        onCheckedChange={handleInternationalPayments}
                        disabled={isCardFrozen}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={handleSecuritySettings}>
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
                        <span className="text-sm font-medium">
                          ${virtualCard.balance.toFixed(2)} / ${virtualCard.limit.toFixed(2)}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${Math.min(100, (virtualCard.balance / virtualCard.limit) * 100)}%` }}
                        ></div>
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
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsRequestingLimitIncrease(true)}
                      disabled={isRequestingLimitIncrease || isCardFrozen}
                    >
                      {isRequestingLimitIncrease ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                          Processing...
                        </>
                      ) : (
                        "Request Limit Increase"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="physical">
            {physicalCard ? (
              <Card>
                <CardHeader>
                  <CardTitle>Physical Card</CardTitle>
                  <CardDescription>Your physical card for ATMs and in-store payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative h-56 bg-gradient-to-r from-slate-800 to-slate-700 p-6 text-white rounded-lg mb-6">
                    {physicalCard.status === "frozen" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-lg">
                        <div className="flex flex-col items-center gap-2 rounded-lg bg-black/50 p-4 text-white">
                          <Lock className="h-8 w-8" />
                          <p className="text-lg font-bold">Card Frozen</p>
                          <p className="text-sm">This card is temporarily disabled</p>
                        </div>
                      </div>
                    )}
                    <div className="mt-6 space-y-6">
                      <div>
                        <p className="text-sm text-white/70">Card Number</p>
                        <p className="font-mono text-xl font-medium">{physicalCard.number}</p>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-white/70">Card Holder</p>
                          <p className="font-medium">{physicalCard.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white/70">Expires</p>
                          <p className="font-medium">{physicalCard.expiry}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white/70">CVV</p>
                          <p className="font-medium">{physicalCard.cvv}</p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-6 right-6">
                      <div className="flex h-10 w-16 items-center justify-center rounded-md bg-white/20 backdrop-blur-sm">
                        <CreditCard className="h-6 w-6" />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <h3 className="mb-2 font-medium">Card Status</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant={physicalCard.status === "active" ? "success" : "destructive"}>
                          {physicalCard.status === "active" ? (
                            <Check className="mr-1 h-3 w-3" />
                          ) : (
                            <AlertTriangle className="mr-1 h-3 w-3" />
                          )}
                          <span className="capitalize">{physicalCard.status}</span>
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {physicalCard.status === "active"
                          ? "Your card is active and ready to use."
                          : "Your card is currently inactive or frozen."}
                      </p>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="mb-2 font-medium">Card Details</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Balance:</span>
                          <span className="font-medium">${physicalCard.balance.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Limit:</span>
                          <span className="font-medium">${physicalCard.limit.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Card Type:</span>
                          <span className="font-medium capitalize">{physicalCard.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <h3 className="font-medium">Card Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="physical-freeze-card">Freeze Card</Label>
                          <p className="text-sm text-muted-foreground">Temporarily disable your physical card</p>
                        </div>
                        <Switch
                          id="physical-freeze-card"
                          checked={physicalCard.status === "frozen"}
                          onCheckedChange={(checked) => freezeCardAction(physicalCard.id, checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="physical-contactless">Contactless Payments</Label>
                          <p className="text-sm text-muted-foreground">Enable tap-to-pay functionality</p>
                        </div>
                        <Switch
                          id="physical-contactless"
                          checked={physicalCard.settings?.contactlessPayments ?? true}
                          onCheckedChange={(checked) =>
                            updateCardSettings(physicalCard.id, { contactlessPayments: checked })
                          }
                          disabled={physicalCard.status === "frozen"}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="physical-atm">ATM Withdrawals</Label>
                          <p className="text-sm text-muted-foreground">Allow cash withdrawals at ATMs</p>
                        </div>
                        <Switch
                          id="physical-atm"
                          checked={physicalCard.settings?.atmWithdrawals ?? true}
                          onCheckedChange={(checked) =>
                            updateCardSettings(physicalCard.id, { atmWithdrawals: checked })
                          }
                          disabled={physicalCard.status === "frozen"}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsTopUpDialogOpen(true)}
                    disabled={physicalCard.status === "frozen"}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Top Up Card
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleSecuritySettings}>
                    <Shield className="mr-2 h-4 w-4" />
                    Security Settings
                  </Button>
                </CardFooter>
              </Card>
            ) : (
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
                  <Button onClick={handleRequestCard} disabled={isRequestingCard}>
                    {isRequestingCard ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                        Processing Request...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Request Physical Card
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
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
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    toast({ title: "Coming Soon", description: "Transaction history export will be available soon." })
                  }
                >
                  View All Transactions
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Top Up Dialog */}
        <Dialog open={isTopUpDialogOpen} onOpenChange={setIsTopUpDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Top Up Your Card</DialogTitle>
              <DialogDescription>
                Add funds to your card. The amount will be immediately available for use.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="top-up-amount">Amount (USD)</Label>
                <Input
                  id="top-up-amount"
                  type="number"
                  min="1"
                  step="1"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Quick Select</Label>
                <div className="flex flex-wrap gap-2">
                  {[50, 100, 200, 500, 1000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setTopUpAmount(amount)}
                      className={topUpAmount === amount ? "bg-primary text-primary-foreground" : ""}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTopUpDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleTopUp}>Top Up Card</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Limit Increase Dialog */}
        <Dialog open={isRequestingLimitIncrease} onOpenChange={setIsRequestingLimitIncrease}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Limit Increase</DialogTitle>
              <DialogDescription>
                Increase your card spending limit. This will be processed immediately for this demo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="limit-increase">Increase Amount</Label>
                  <span className="text-sm font-medium">${limitIncreaseAmount}</span>
                </div>
                <Slider
                  id="limit-increase"
                  min={100}
                  max={5000}
                  step={100}
                  value={[limitIncreaseAmount]}
                  onValueChange={(value) => setLimitIncreaseAmount(value[0])}
                />
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm">
                  Your current limit: <span className="font-medium">${virtualCard.limit.toFixed(2)}</span>
                </p>
                <p className="text-sm">
                  New limit after increase:{" "}
                  <span className="font-medium">${(virtualCard.limit + limitIncreaseAmount).toFixed(2)}</span>
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRequestingLimitIncrease(false)}>
                Cancel
              </Button>
              <Button onClick={handleRequestLimitIncrease}>Confirm Increase</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Security Settings Dialog */}
        <Dialog open={isSecurityDialogOpen} onOpenChange={setIsSecurityDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Card Security Settings</DialogTitle>
              <DialogDescription>Configure advanced security settings for your card.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="cvv-required">Require CVV for All Transactions</Label>
                  <p className="text-sm text-muted-foreground">
                    Always require CVV verification, even for saved merchants
                  </p>
                </div>
                <Switch id="cvv-required" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="transaction-alerts">Transaction Alerts</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications for all card transactions</p>
                </div>
                <Switch id="transaction-alerts" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="geo-restrictions">Geographic Restrictions</Label>
                  <p className="text-sm text-muted-foreground">Limit card usage to specific countries</p>
                </div>
                <Switch id="geo-restrictions" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="merchant-categories">Merchant Category Restrictions</Label>
                  <p className="text-sm text-muted-foreground">Block transactions for certain merchant categories</p>
                </div>
                <Switch id="merchant-categories" />
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <Label>Blocked Countries</Label>
                <Select defaultValue="none">
                  <SelectTrigger>
                    <SelectValue placeholder="Select countries to block" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No restrictions</SelectItem>
                    <SelectItem value="high-risk">High-risk countries only</SelectItem>
                    <SelectItem value="all-except-local">All except Zimbabwe</SelectItem>
                    <SelectItem value="custom">Custom selection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Transaction Verification Method</Label>
                <Select defaultValue="sms">
                  <SelectTrigger>
                    <SelectValue placeholder="Select verification method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sms">SMS Code</SelectItem>
                    <SelectItem value="email">Email Code</SelectItem>
                    <SelectItem value="app">Mobile App</SelectItem>
                    <SelectItem value="biometric">Biometric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  setIsSecurityDialogOpen(false)
                  toast({
                    title: "Security Settings Updated",
                    description: "Your card security settings have been updated successfully.",
                  })
                }}
              >
                Save Settings
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Simulate Payment Dialog */}
        <Dialog open={isSimulatePaymentOpen} onOpenChange={setIsSimulatePaymentOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Simulate Card Payment</DialogTitle>
              <DialogDescription>Simulate a payment with your card for testing purposes.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="payment-amount">Amount (USD)</Label>
                <Input
                  id="payment-amount"
                  type="number"
                  min="1"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-merchant">Merchant</Label>
                <Input
                  id="payment-merchant"
                  value={paymentMerchant}
                  onChange={(e) => setPaymentMerchant(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment-category">Category</Label>
                <Select value={paymentCategory} onValueChange={setPaymentCategory}>
                  <SelectTrigger id="payment-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Shopping">Shopping</SelectItem>
                    <SelectItem value="Food">Food & Dining</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-lg border p-4 bg-muted/50">
                <p className="text-sm">
                  Card balance: <span className="font-medium">${virtualCard.balance.toFixed(2)}</span>
                </p>
                <p className="text-sm">
                  Balance after payment:{" "}
                  <span className="font-medium">${Math.max(0, virtualCard.balance - paymentAmount).toFixed(2)}</span>
                </p>
                {virtualCard.balance < paymentAmount && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Insufficient funds for this payment
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSimulatePaymentOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSimulatePayment}
                disabled={isProcessingPayment || virtualCard.balance < paymentAmount || isCardFrozen}
              >
                {isProcessingPayment ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    Processing...
                  </>
                ) : (
                  "Make Payment"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
