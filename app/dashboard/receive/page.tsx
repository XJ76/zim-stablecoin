"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Check, Copy, QrCode, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeSelector } from "@/components/theme-selector"
import { useToast } from "@/components/ui/use-toast"
import { useApp } from "@/context/app-context"
import { usePaymentRequestModal } from "@/hooks/use-payment-request-modal"
import { PaymentRequestModal } from "@/components/payment-request-modal"
import DashboardLayout from "@/components/dashboard-layout"

export default function ReceivePage() {
  const { walletAddress, paymentRequests } = useApp()
  const { toast } = useToast()
  const { isOpen, openPaymentRequestModal, closePaymentRequestModal } = usePaymentRequestModal()
  const [activeTab, setActiveTab] = useState("wallet")
  const [copied, setCopied] = useState(false)
  const addressRef = useRef<HTMLDivElement>(null)

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Zimbabwe Stablecoin Wallet",
          text: `Here's my Zimbabwe Stablecoin wallet address: ${walletAddress}`,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      handleCopyAddress()
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
            <h1 className="text-2xl font-bold tracking-tight">Receive</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSelector />
            <Button size="sm" onClick={openPaymentRequestModal}>
              Create Payment Request
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="wallet">Wallet Address</TabsTrigger>
            <TabsTrigger value="requests">Payment Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Your Wallet Address</CardTitle>
                  <CardDescription>Share this address to receive funds</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="mb-6 rounded-lg bg-muted p-4">
                    <QrCode className="h-40 w-40" />
                  </div>
                  <div
                    ref={addressRef}
                    className="mb-4 w-full overflow-hidden rounded-lg border bg-muted p-4 text-center font-mono text-sm"
                  >
                    {walletAddress}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyAddress}>
                      {copied ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Address
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start">
                  <h3 className="mb-2 text-lg font-medium">Instructions</h3>
                  <ol className="list-decimal pl-5 text-sm text-muted-foreground">
                    <li className="mb-1">Share your wallet address with the sender</li>
                    <li className="mb-1">The sender will need to specify this address as the recipient</li>
                    <li className="mb-1">Once the transaction is complete, funds will appear in your wallet</li>
                    <li>You will receive a notification when funds arrive</li>
                  </ol>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Requests</CardTitle>
                <CardDescription>Requests you've created for others to pay you</CardDescription>
              </CardHeader>
              <CardContent>
                {paymentRequests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="mb-4 rounded-full bg-muted p-6">
                      <QrCode className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <p className="mb-6 max-w-md text-muted-foreground">
                      You haven't created any payment requests yet. Create a request to share with others.
                    </p>
                    <Button onClick={openPaymentRequestModal}>Create Payment Request</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paymentRequests.map((request) => (
                      <div key={request.id} className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div>
                            <p className="font-medium">${request.amount.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">{request.description || "No description"}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                request.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  : request.status === "completed"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              }`}
                            >
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{request.to ? `To: ${request.to}` : "No recipient specified"}</span>
                          <span>{new Date(request.date).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm" onClick={handleCopyAddress} className="flex-1">
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Address
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleShare} className="flex-1">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={openPaymentRequestModal}>
                  Create New Request
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <PaymentRequestModal open={isOpen} onOpenChange={closePaymentRequestModal} />
      </div>
    </DashboardLayout>
  )
}
