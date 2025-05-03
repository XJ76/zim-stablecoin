"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeftRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

export default function CurrencyConverter({ className }: { className?: string }) {
  const [amount, setAmount] = useState("100")
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("ZWL")
  const [result, setResult] = useState("350,000")

  // Exchange rates (simplified)
  const rates = {
    USD: { ZWL: 3500, USD: 1 },
    ZWL: { USD: 0.000286, ZWL: 1 },
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
    calculateResult(e.target.value, fromCurrency, toCurrency)
  }

  const handleFromCurrencyChange = (value: string) => {
    setFromCurrency(value)
    calculateResult(amount, value, toCurrency)
  }

  const handleToCurrencyChange = (value: string) => {
    setToCurrency(value)
    calculateResult(amount, fromCurrency, value)
  }

  const calculateResult = (amount: string, from: string, to: string) => {
    const numAmount = Number.parseFloat(amount) || 0
    const rate = rates[from as keyof typeof rates][to as keyof (typeof rates)[keyof typeof rates]]
    const calculatedResult = (numAmount * rate).toLocaleString()
    setResult(calculatedResult)
  }

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    calculateResult(amount, toCurrency, fromCurrency)
  }

  return (
    <div className={cn("w-full max-w-md", className)}>
      <div className="mb-4 text-center">
        <h3 className="text-lg font-bold">Currency Converter</h3>
        <p className="text-sm text-muted-foreground">Get real-time exchange rates</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="bg-background/50 border-input/50 focus-visible:ring-primary/50"
          />
        </div>

        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2">
          <Select value={fromCurrency} onValueChange={handleFromCurrencyChange}>
            <SelectTrigger className="bg-background/50 border-input/50">
              <SelectValue placeholder="From" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="ZWL">ZWL</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwapCurrencies}
            className="rounded-full hover:bg-primary/10"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>

          <Select value={toCurrency} onValueChange={handleToCurrencyChange}>
            <SelectTrigger className="bg-background/50 border-input/50">
              <SelectValue placeholder="To" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="ZWL">ZWL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg bg-primary/5 p-4 text-center">
          <p className="text-sm text-muted-foreground">Converted Amount</p>
          <div className="mt-1 text-2xl font-bold">
            {result} {toCurrency}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            1 {fromCurrency} ={" "}
            {rates[fromCurrency as keyof typeof rates][
              toCurrency as keyof (typeof rates)[keyof typeof rates]
            ].toLocaleString()}{" "}
            {toCurrency}
          </p>
        </div>
      </div>
    </div>
  )
}

