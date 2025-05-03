"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Check, DollarSign, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeSelector } from "@/components/theme-selector"

const recentContacts = [
  { id: 1, name: "Chiedza M.", avatar: "/placeholder.svg?height=40&width=40", username: "@chiedza" },
  { id: 2, name: "Farai N.", avatar: "/placeholder.svg?height=40&width=40", username: "@farai" },
  { id: 3, name: "Tendai R.", avatar: "/placeholder.svg?height=40&width=40", username: "@tendai" },
  { id: 4, name: "Tafadzwa M.", avatar: "/placeholder.svg?height=40&width=40", username: "@tafadzwa" },
]

export default function SendPage() {
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [note, setNote] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContact, setSelectedContact] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
    } else {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false)
        setStep(3)
      }, 1500)
    }
  }

  const handleContactSelect = (contactId: number, contactName: string) => {
    setSelectedContact(contactId)
    setRecipient(contactName)
  }

  const filteredContacts = recentContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 md:mr-6">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="hidden text-lg font-bold md:inline-block">Zimbabwe Stablecoin</span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <ThemeSelector />
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-6">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-md">
            <div className="mb-6 flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                  <span className="sr-only">Back</span>
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">Send Money</h1>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-none shadow-lg">
                    <CardHeader>
                      <CardTitle>Send Stablecoins</CardTitle>
                      <CardDescription>
                        Enter the recipient&apos;s details and the amount you want to send.
                      </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                      <CardContent className="space-y-4">
                        <Tabs defaultValue="recent" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="recent">Recent</TabsTrigger>
                            <TabsTrigger value="new">New Recipient</TabsTrigger>
                          </TabsList>
                          <TabsContent value="recent" className="mt-4 space-y-4">
                            <div className="relative">
                              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Search contacts..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              {filteredContacts.length > 0 ? (
                                filteredContacts.map((contact) => (
                                  <div
                                    key={contact.id}
                                    className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${
                                      selectedContact === contact.id ? "border-primary bg-primary/5" : "hover:bg-muted"
                                    }`}
                                    onClick={() => handleContactSelect(contact.id, contact.name)}
                                  >
                                    <div className="flex items-center gap-3">
                                      <Avatar>
                                        <AvatarImage src={contact.avatar} alt={contact.name} />
                                        <AvatarFallback>
                                          {contact.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium">{contact.name}</p>
                                        <p className="text-sm text-muted-foreground">{contact.username}</p>
                                      </div>
                                    </div>
                                    {selectedContact === contact.id && <Check className="h-5 w-5 text-primary" />}
                                  </div>
                                ))
                              ) : (
                                <div className="flex h-20 flex-col items-center justify-center rounded-lg border border-dashed text-center">
                                  <p className="text-sm text-muted-foreground">No contacts found</p>
                                </div>
                              )}
                            </div>
                          </TabsContent>
                          <TabsContent value="new" className="mt-4 space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="recipient">Recipient Address or Username</Label>
                              <Input
                                id="recipient"
                                placeholder="Enter wallet address or username"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                required
                              />
                            </div>
                          </TabsContent>
                        </Tabs>

                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount (USD)</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input
                              id="amount"
                              type="number"
                              placeholder="0.00"
                              className="pl-8"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="note">Note (Optional)</Label>
                          <Textarea
                            id="note"
                            placeholder="Add a message for the recipient"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                          />
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
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-none shadow-lg">
                    <CardHeader>
                      <CardTitle>Confirm Transaction</CardTitle>
                      <CardDescription>Please review the details before confirming your transaction.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                      <CardContent className="space-y-4">
                        <div className="rounded-lg border p-4">
                          <div className="mb-4 flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Recipient</span>
                            <span className="font-medium">{recipient}</span>
                          </div>
                          <div className="mb-4 flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Amount</span>
                            <span className="font-medium">${Number.parseFloat(amount).toFixed(2)}</span>
                          </div>
                          <div className="mb-4 flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Fee</span>
                            <span className="font-medium">$0.00</span>
                          </div>
                          <div className="flex items-center justify-between border-t pt-4">
                            <span className="text-sm font-medium">Total</span>
                            <span className="font-bold">${Number.parseFloat(amount).toFixed(2)}</span>
                          </div>
                        </div>
                        {note && (
                          <div className="rounded-lg border p-4">
                            <span className="text-sm text-muted-foreground">Note</span>
                            <p className="mt-1">{note}</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex flex-col gap-2">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                              Processing...
                            </>
                          ) : (
                            "Confirm and Send"
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
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-none shadow-lg">
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <CardTitle>Transaction Successful!</CardTitle>
                      <CardDescription>Your transaction has been processed successfully.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Recipient</span>
                          <span className="font-medium">{recipient}</span>
                        </div>
                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Amount</span>
                          <span className="font-medium">${Number.parseFloat(amount).toFixed(2)}</span>
                        </div>
                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Transaction ID</span>
                          <span className="font-medium">
                            ZSC-{Math.random().toString(36).substring(2, 10).toUpperCase()}
                          </span>
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
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setStep(1)
                          setAmount("")
                          setRecipient("")
                          setNote("")
                          setSelectedContact(null)
                        }}
                      >
                        Send Another Transaction
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
}

