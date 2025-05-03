"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Copy, DollarSign, Share2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ReceivePage() {
  const [walletAddress, setWalletAddress] = useState("zsc1q8c6fshw2zzd5k5ym4h7wakn6v9sfyjq9u7xyv")
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("address")

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
            <Link href="/dashboard/receive" className="text-sm font-medium text-primary">
              Receive
            </Link>
            <Link href="/dashboard/convert" className="text-sm font-medium text-muted-foreground">
              Convert
            </Link>
            <Link href="/dashboard/history" className="text-sm font-medium text-muted-foreground">
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
                          <Button type="button" variant="secondary" className="rounded-l-none" onClick={handleCopy}>
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
                          <Input id="username" value="@tendai_moyo" readOnly className="rounded-r-none" />
                          <Button
                            type="button"
                            variant="secondary"
                            className="rounded-l-none"
                            onClick={() => {
                              navigator.clipboard.writeText("@tendai_moyo")
                              setCopied(true)
                              setTimeout(() => setCopied(false), 2000)
                            }}
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
                          <Button variant="outline" size="sm" onClick={handleCopy}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Address
                          </Button>
                          <Button variant="outline" size="sm">
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
                    <p className="mb-4 text-sm text-muted-foreground">
                      Create a payment request with a specific amount.
                    </p>
                    <Button>Create Payment Request</Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
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
      <rect width="8" height x="160" y="32" />
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

function Check({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

