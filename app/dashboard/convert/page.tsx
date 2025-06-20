"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Check, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardLayout from "@/components/dashboard-layout"
import { useApp } from "@/context/app-context"
import { useToast } from "@/components/ui/use-toast"

export default function ConvertPage() {
  const { balance, zwlRate, convertCurrency } = useApp()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState("")
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("ZWL")
  const [isLoading, setIsLoading] = useState(false)
  const [convertedAmount, setConvertedAmount] = useState(0)
  const [transactionId, setTransactionId] = useState("")

  const exchangeRates = {
    USD: {
      ZWL: zwlRate,
      USD: 1,
    },
    ZWL: {
      USD: 1 / zwlRate,
      ZWL: 1,
    },
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
    calculateConversion(e.target.value, fromCurrency, toCurrency)
  }

  const handleFromCurrencyChange = (value: string) => {
    setFromCurrency(value)
    calculateConversion(amount, value, toCurrency)
  }

  const handleToCurrencyChange = (value: string) => {
    setToCurrency(value)
    calculateConversion(amount, fromCurrency, value)
  }

  const calculateConversion = (amount: string, from: string, to: string) => {
    const numAmount = Number.parseFloat(amount) || 0
    const rate =
      exchangeRates[from as keyof typeof exchangeRates][to as keyof (typeof exchangeRates)[keyof typeof exchangeRates]]
    setConvertedAmount(numAmount * rate)
  }

  const handleSwapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
    calculateConversion(amount, toCurrency, fromCurrency)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1) {
      // Validate amount
      const numAmount = Number.parseFloat(amount)
      if (isNaN(numAmount) || numAmount <= 0) {
        toast({
          title: "Invalid amount",
          description: "Please enter a valid amount greater than zero.",
          variant: "destructive",
        })
        return
      }

      // Check if user has enough balance for USD conversions
      if (fromCurrency === "USD" && numAmount > balance) {
        toast({
          title: "Insufficient balance",
          description: "You don't have enough funds to complete this conversion.",
          variant: "destructive",
        })
        return
      }

      setStep(2)
    } else {
      setIsLoading(true)

      try {
        const success = await convertCurrency(Number.parseFloat(amount), fromCurrency, toCurrency)

        if (success) {
          // Generate a random transaction ID
          setTransactionId(`ZSC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`)
          setStep(3)
        } else {
          toast({
            title: "Conversion failed",
            description: "There was an error processing your conversion. Please try again.",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Conversion failed",
          description: "There was an error processing your conversion. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="container px-4 py-6 md:px-6">
        <div className="mx-auto max-w-md">
          <div className="mb-6 flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Convert Currency</h1>
          </div>

          {step === 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Currency Conversion</CardTitle>
                  <CardDescription>
                    Convert between stablecoins and Zimbabwean dollars at the current exchange rate.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <div className="relative">
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          value={amount}
                          onChange={handleAmountChange}
                          required
                        />
                      </div>
                      {fromCurrency === "USD" && (
                        <p className="text-xs text-muted-foreground">Available balance: ${balance.toFixed(2)}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="from-currency">From</Label>
                        <Select value={fromCurrency} onValueChange={handleFromCurrencyChange}>
                          <SelectTrigger id="from-currency">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD (Stablecoin)</SelectItem>
                            <SelectItem value="ZWL">ZWL (Zimbabwean Dollar)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button type="button" variant="ghost" size="icon" className="mt-8" onClick={handleSwapCurrencies}>
                        <RefreshCw className="h-4 w-4 rotate-90" />
                        <span className="sr-only">Swap currencies</span>
                      </Button>

                      <div className="space-y-2">
                        <Label htmlFor="to-currency">To</Label>
                        <Select value={toCurrency} onValueChange={handleToCurrencyChange}>
                          <SelectTrigger id="to-currency">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD (Stablecoin)</SelectItem>
                            <SelectItem value="ZWL">ZWL (Zimbabwean Dollar)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="rounded-lg border bg-muted/50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Conversion Rate</span>
                        <span className="font-medium">
                          1 {fromCurrency} ={" "}
                          {exchangeRates[fromCurrency as keyof typeof exchangeRates][
                            toCurrency as keyof (typeof exchangeRates)[keyof typeof exchangeRates]
                          ].toLocaleString()}{" "}
                          {toCurrency}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between border-t pt-2">
                        <span className="text-sm text-muted-foreground">You will receive</span>
                        <span className="text-xl font-bold">
                          {convertedAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          {toCurrency}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full">
                      Continue
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Confirm Conversion</CardTitle>
                  <CardDescription>Please review the details before confirming your conversion.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">From</span>
                        <span className="font-medium">
                          {amount} {fromCurrency}
                        </span>
                      </div>
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">To</span>
                        <span className="font-medium">
                          {convertedAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          {toCurrency}
                        </span>
                      </div>
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Rate</span>
                        <span className="font-medium">
                          1 {fromCurrency} ={" "}
                          {exchangeRates[fromCurrency as keyof typeof exchangeRates][
                            toCurrency as keyof (typeof exchangeRates)[keyof typeof exchangeRates]
                          ].toLocaleString()}{" "}
                          {toCurrency}
                        </span>
                      </div>
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Fee</span>
                        <span className="font-medium">0.00 {fromCurrency}</span>
                      </div>
                      <div className="flex items-center justify-between border-t pt-4">
                        <span className="text-sm font-medium">You will receive</span>
                        <span className="font-bold">
                          {convertedAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          {toCurrency}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                          Processing...
                        </>
                      ) : (
                        "Confirm Conversion"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setStep(1)}
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle>Conversion Successful!</CardTitle>
                  <CardDescription>Your currency conversion has been processed successfully.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">From</span>
                      <span className="font-medium">
                        {amount} {fromCurrency}
                      </span>
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">To</span>
                      <span className="font-medium">
                        {convertedAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        {toCurrency}
                      </span>
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Transaction ID</span>
                      <span className="font-medium">{transactionId}</span>
                    </div>
                    <div className="flex items-center justify-between border-t pt-4">
                      <span className="text-sm font-medium">Date & Time</span>
                      <span className="font-medium">{new Date().toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button asChild className="w-full">
                    <Link href="/dashboard">Return to Dashboard</Link>
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setStep(1)}>
                    New Conversion
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
