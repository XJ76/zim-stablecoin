"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Copy, DollarSign, Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import DashboardLayout from "@/components/dashboard-layout"
import { useApp } from "@/context/app-context"
import { PaymentRequestModal } from "@/components/payment-request-modal"
import { usePaymentRequestModal } from "@/hooks/use-payment-request-modal"

export default function ReceivePage() {
  const { walletAddress, user } = useApp()
  const { toast } = useToast()
  const paymentRequestModal = usePaymentRequestModal()
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("address")
  const username = user ? `@${user.firstName.toLowerCase()}_${user.lastName.toLowerCase()}` : "@user"

  const handleCopy = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast({
      title: "Copied!",
      description: message,
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Zimbabwe Stablecoin Wallet",
          text: `Send me stablecoins using my wallet address: ${walletAddress}`,
          url: window.location.href,
        })
      } catch (error) {
        toast({
          title: "Error sharing",
          description: "There was an error sharing your wallet address.",
          variant: "destructive",
        })
      }
    } else {
      handleCopy(walletAddress, "Wallet address copied to clipboard")
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
            <h1 className="text-2xl font-bold">Receive Money</h1>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Receive Stablecoins</CardTitle>
                <CardDescription>Share your wallet address or QR code to receive stablecoins.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="address">Wallet Address</TabsTrigger>
                    <TabsTrigger value="qr">QR Code</TabsTrigger>
                  </TabsList>
                  <TabsContent value="address" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="wallet-address">Your Wallet Address</Label>
                      <div className="flex">
                        <Input id="wallet-address" value={walletAddress} readOnly className="rounded-r-none" />
                        <Button
                          type="button"
                          variant="secondary"
                          className="rounded-l-none"
                          onClick={() => handleCopy(walletAddress, "Wallet address copied to clipboard")}
                        >
                          {copied ? (
                            <span className="flex items-center gap-1">
                              <Check className="h-4 w-4" /> Copied
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Copy className="h-4 w-4" /> Copy
                            </span>
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Share this address with others to receive stablecoins.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Your Username</Label>
                      <div className="flex">
                        <Input id="username" value={username} readOnly className="rounded-r-none" />
                        <Button
                          type="button"
                          variant="secondary"
                          className="rounded-l-none"
                          onClick={() => handleCopy(username, "Username copied to clipboard")}
                        >
                          {copied ? (
                            <span className="flex items-center gap-1">
                              <Check className="h-4 w-4" /> Copied
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Copy className="h-4 w-4" /> Copy
                            </span>
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Others can also send you money using your username.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="qr" className="pt-4">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative rounded-lg border bg-white p-2">
                        <QRCodeCanvas
                          value={walletAddress}
                          size={200}
                          bgColor={"#ffffff"}
                          fgColor={"#000000"}
                          level={"L"}
                          includeMargin={false}
                        />
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full border-4 border-white bg-primary p-2">
                          <DollarSign className="h-6 w-6 text-primary-foreground" />
                        </div>
                      </div>
                      <p className="text-center text-sm text-muted-foreground">
                        Scan this QR code to receive stablecoins instantly.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(walletAddress, "Wallet address copied to clipboard")}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Address
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleShare}>
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <h3 className="mb-1 font-semibold">Request a Specific Amount</h3>
                  <p className="mb-4 text-sm text-muted-foreground">Create a payment request with a specific amount.</p>
                  <Button onClick={paymentRequestModal.onOpen}>Create Payment Request</Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
      <PaymentRequestModal open={paymentRequestModal.isOpen} onClose={paymentRequestModal.onClose} />
    </DashboardLayout>
  )
}

// QR Code component
function QRCodeCanvas({ value, size, bgColor, fgColor, level, includeMargin }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <QrCodeIcon className="h-full w-full" />
    </div>
  )
}

function QrCodeIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" className={className}>
      <rect width="8" height="8" x="16" y="16" />
      <rect width="8" height="8" x="24" y="16" />
      <rect width="8" height="8" x="32" y="16" />
      <rect width="8" height="8" x="40" y="16" />
      <rect width="8" height="8" x="48" y="16" />
      <rect width="8" height="8" x="56" y="16" />
      <rect width="8" height="8" x="64" y="16" />
      <rect width="8" height="8" x="16" y="24" />
      <rect width="8" height="8" x="64" y="24" />
      <rect width="8" height="8" x="16" y="32" />
      <rect width="8" height="8" x="32" y="32" />
      <rect width="8" height="8" x="40" y="32" />
      <rect width="8" height="8" x="48" y="32" />
      <rect width="8" height="8" x="64" y="32" />
      <rect width="8" height="8" x="16" y="40" />
      <rect width="8" height="8" x="32" y="40" />
      <rect width="8" height="8" x="40" y="40" />
      <rect width="8" height="8" x="48" y="40" />
      <rect width="8" height="8" x="64" y="40" />
      <rect width="8" height="8" x="16" y="48" />
      <rect width="8" height="8" x="32" y="48" />
      <rect width="8" height="8" x="40" y="48" />
      <rect width="8" height="8" x="48" y="48" />
      <rect width="8" height="8" x="64" y="48" />
      <rect width="8" height="8" x="16" y="56" />
      <rect width="8" height="8" x="64" y="56" />
      <rect width="8" height="8" x="16" y="64" />
      <rect width="8" height="8" x="24" y="64" />
      <rect width="8" height="8" x="32" y="64" />
      <rect width="8" height="8" x="40" y="64" />
      <rect width="8" height="8" x="48" y="64" />
      <rect width="8" height="8" x="56" y="64" />
      <rect width="8" height="8" x="64" y="64" />
      <rect width="8" height="8" x="128" y="16" />
      <rect width="8" height="8" x="136" y="16" />
      <rect width="8" height="8" x="144" y="16" />
      <rect width="8" height="8" x="152" y="16" />
      <rect width="8" height="8" x="160" y="16" />
      <rect width="8" height="8" x="168" y="16" />
      <rect width="8" height="8" x="176" y="16" />
      <rect width="8" height="8" x="128" y="24" />
      <rect width="8" height="8" x="176" y="24" />
      <rect width="8" height="8" x="128" y="32" />
      <rect width="8" height="8" x="144" y="32" />
      <rect width="8" height="8" x="152" y="32" />
      <rect width="8" height="8" x="160" y="32" />
      <rect width="8" height="8" x="176" y="32" />
      <rect width="8" height="8" x="128" y="40" />
      <rect width="8" height="8" x="144" y="40" />
      <rect width="8" height="8" x="152" y="40" />
      <rect width="8" height="8" x="160" y="40" />
      <rect width="8" height="8" x="176" y="40" />
      <rect width="8" height="8" x="128" y="48" />
      <rect width="8" height="8" x="144" y="48" />
      <rect width="8" height="8" x="152" y="48" />
      <rect width="8" height="8" x="160" y="48" />
      <rect width="8" height="8" x="176" y="48" />
      <rect width="8" height="8" x="128" y="56" />
      <rect width="8" height="8" x="176" y="56" />
      <rect width="8" height="8" x="128" y="64" />
      <rect width="8" height="8" x="136" y="64" />
      <rect width="8" height="8" x="144" y="64" />
      <rect width="8" height="8" x="152" y="64" />
      <rect width="8" height="8" x="160" y="64" />
      <rect width="8" height="8" x="168" y="64" />
      <rect width="8" height="8" x="176" y="64" />
      <rect width="8" height="8" x="16" y="128" />
      <rect width="8" height="8" x="24" y="128" />
      <rect width="8" height="8" x="32" y="128" />
      <rect width="8" height="8" x="40" y="128" />
      <rect width="8" height="8" x="48" y="128" />
      <rect width="8" height="8" x="56" y="128" />
      <rect width="8" height="8" x="64" y="128" />
      <rect width="8" height="8" x="80" y="128" />
      <rect width="8" height="8" x="96" y="128" />
      <rect width="8" height="8" x="104" y="128" />
      <rect width="8" height="8" x="112" y="128" />
      <rect width="8" height="8" x="128" y="128" />
      <rect width="8" height="8" x="136" y="128" />
      <rect width="8" height="8" x="144" y="128" />
      <rect width="8" height="8" x="152" y="128" />
      <rect width="8" height="8" x="160" y="128" />
      <rect width="8" height="8" x="168" y="128" />
      <rect width="8" height="8" x="176" y="128" />
      <rect width="8" height="8" x="16" y="136" />
      <rect width="8" height="8" x="64" y="136" />
      <rect width="8" height="8" x="80" y="136" />
      <rect width="8" height="8" x="88" y="136" />
      <rect width="8" height="8" x="96" y="136" />
      <rect width="8" height="8" x="128" y="136" />
      <rect width="8" height="8" x="176" y="136" />
      <rect width="8" height="8" x="16" y="144" />
      <rect width="8" height="8" x="32" y="144" />
      <rect width="8" height="8" x="40" y="144" />
      <rect width="8" height="8" x="48" y="144" />
      <rect width="8" height="8" x="64" y="144" />
      <rect width="8" height="8" x="80" y="144" />
      <rect width="8" height="8" x="96" y="144" />
      <rect width="8" height="8" x="112" y="144" />
      <rect width="8" height="8" x="128" y="144" />
      <rect width="8" height="8" x="144" y="144" />
      <rect width="8" height="8" x="152" y="144" />
      <rect width="8" height="8" x="160" y="144" />
      <rect width="8" height="8" x="176" y="144" />
      <rect width="8" height="8" x="16" y="152" />
      <rect width="8" height="8" x="32" y="152" />
      <rect width="8" height="8" x="40" y="152" />
      <rect width="8" height="8" x="48" y="152" />
      <rect width="8" height="8" x="64" y="152" />
      <rect width="8" height="8" x="80" y="152" />
      <rect width="8" height="8" x="104" y="152" />
      <rect width="8" height="8" x="128" y="152" />
      <rect width="8" height="8" x="144" y="152" />
      <rect width="8" height="8" x="152" y="152" />
      <rect width="8" height="8" x="160" y="152" />
      <rect width="8" height="8" x="176" y="152" />
      <rect width="8" height="8" x="16" y="160" />
      <rect width="8" height="8" x="32" y="160" />
      <rect width="8" height="8" x="40" y="160" />
      <rect width="8" height="8" x="48" y="160" />
      <rect width="8" height="8" x="64" y="160" />
      <rect width="8" height="8" x="80" y="160" />
      <rect width="8" height="8" x="88" y="160" />
      <rect width="8" height="8" x="96" y="160" />
      <rect width="8" height="8" x="104" y="160" />
      <rect width="8" height="8" x="112" y="160" />
      <rect width="8" height="8" x="128" y="160" />
      <rect width="8" height="8" x="144" y="160" />
      <rect width="8" height="8" x="152" y="160" />
      <rect width="8" height="8" x="160" y="160" />
      <rect width="8" height="8" x="176" y="160" />
      <rect width="8" height="8" x="16" y="168" />
      <rect width="8" height="8" x="64" y="168" />
      <rect width="8" height="8" x="80" y="168" />
      <rect width="8" height="8" x="128" y="168" />
      <rect width="8" height="8" x="176" y="168" />
      <rect width="8" height="8" x="16" y="176" />
      <rect width="8" height="8" x="24" y="176" />
      <rect width="8" height="8" x="32" y="176" />
      <rect width="8" height="8" x="40" y="176" />
      <rect width="8" height="8" x="48" y="176" />
      <rect width="8" height="8" x="56" y="176" />
      <rect width="8" height="8" x="64" y="176" />
      <rect width="8" height="8" x="80" y="176" />
      <rect width="8" height="8" x="96" y="176" />
      <rect width="8" height="8" x="112" y="176" />
      <rect width="8" height="8" x="128" y="176" />
      <rect width="8" height="8" x="136" y="176" />
      <rect width="8" height="8" x="144" y="176" />
      <rect width="8" height="8" x="152" y="176" />
      <rect width="8" height="8" x="160" y="176" />
      <rect width="8" height="8" x="168" y="176" />
      <rect width="8" height="8" x="176" y="176" />
    </svg>
  )
}
