"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Moon, Palette, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ThemeSelector } from "@/components/theme-selector"
import { useTheme } from "@/components/theme-provider"
import DashboardLayout from "@/components/dashboard-layout"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("general")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const [biometricLogin, setBiometricLogin] = useState(true)
  const [autoLock, setAutoLock] = useState(true)
  const [language, setLanguage] = useState("en")
  const [currency, setCurrency] = useState("USD")
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY")

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
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSelector />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Language & Region</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="sn">Shona</SelectItem>
                            <SelectItem value="nd">Ndebele</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={currency} onValueChange={setCurrency}>
                          <SelectTrigger id="currency">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD (US Dollar)</SelectItem>
                            <SelectItem value="ZWL">ZWL (Zimbabwean Dollar)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Date & Time</h3>
                    <div className="space-y-2">
                      <Label htmlFor="date-format">Date Format</Label>
                      <RadioGroup value={dateFormat} onValueChange={setDateFormat} className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="MM/DD/YYYY" id="date-format-1" />
                          <Label htmlFor="date-format-1">MM/DD/YYYY</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="DD/MM/YYYY" id="date-format-2" />
                          <Label htmlFor="date-format-2">DD/MM/YYYY</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="YYYY-MM-DD" id="date-format-3" />
                          <Label htmlFor="date-format-3">YYYY-MM-DD</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Contact Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          defaultValue="tendai.moyo@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+263 77 123 4567" defaultValue="+263 77 123 4567" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Transaction Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive email notifications for all transactions
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketing-emails">Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about new features and promotions
                        </p>
                      </div>
                      <Switch id="marketing-emails" checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Push Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">Mobile Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive push notifications on your mobile device
                        </p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Types</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="notify-deposits"
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                      <Label htmlFor="notify-deposits">Deposits</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="notify-withdrawals"
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                      <Label htmlFor="notify-withdrawals">Withdrawals</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="notify-transfers"
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                      <Label htmlFor="notify-transfers">Transfers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="notify-security"
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                      <Label htmlFor="notify-security">Security Alerts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="notify-news" className="h-4 w-4 rounded border-gray-300" />
                      <Label htmlFor="notify-news">News & Updates</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Enable 2FA</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch id="two-factor" checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                  </div>
                  {twoFactorAuth && (
                    <div className="rounded-lg border p-4">
                      <p className="mb-4 text-sm">
                        Two-factor authentication adds an extra layer of security to your account. In addition to your
                        password, you'll need to enter a code from your mobile device when signing in.
                      </p>
                      <Button variant="outline" size="sm">
                        Set Up Two-Factor Authentication
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Device Security</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="biometric-login">Biometric Login</Label>
                        <p className="text-sm text-muted-foreground">
                          Use fingerprint or face recognition to log in on mobile
                        </p>
                      </div>
                      <Switch id="biometric-login" checked={biometricLogin} onCheckedChange={setBiometricLogin} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-lock">Auto-Lock</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically lock the app after 5 minutes of inactivity
                        </p>
                      </div>
                      <Switch id="auto-lock" checked={autoLock} onCheckedChange={setAutoLock} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Login Sessions</h3>
                  <div className="rounded-lg border p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">Harare, Zimbabwe • Chrome on Windows</p>
                      </div>
                      <div className="flex h-2 w-2 items-center justify-center rounded-full bg-green-500"></div>
                    </div>
                    <Button variant="outline" size="sm">
                      Log Out of All Other Devices
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Security Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how the app looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Theme</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className={`cursor-pointer rounded-lg border p-4 text-center transition-all hover:border-primary ${
                        theme === "light" ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setTheme("light")}
                    >
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-background mx-auto">
                        <Sun className="h-5 w-5" />
                      </div>
                      <p className="font-medium">Light</p>
                    </div>
                    <div
                      className={`cursor-pointer rounded-lg border p-4 text-center transition-all hover:border-primary ${
                        theme === "dark" ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setTheme("dark")}
                    >
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-background mx-auto">
                        <Moon className="h-5 w-5" />
                      </div>
                      <p className="font-medium">Dark</p>
                    </div>
                    <div
                      className={`cursor-pointer rounded-lg border p-4 text-center transition-all hover:border-primary ${
                        theme === "system" ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setTheme("system")}
                    >
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-background mx-auto">
                        <Palette className="h-5 w-5" />
                      </div>
                      <p className="font-medium">System</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Display</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="compact-mode">Compact Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Reduce spacing and padding throughout the interface
                        </p>
                      </div>
                      <Switch id="compact-mode" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="large-text">Large Text</Label>
                        <p className="text-sm text-muted-foreground">Increase text size for better readability</p>
                      </div>
                      <Switch id="large-text" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="reduce-motion">Reduce Motion</Label>
                        <p className="text-sm text-muted-foreground">Minimize animations throughout the app</p>
                      </div>
                      <Switch id="reduce-motion" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Accent Color</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {["#000000", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"].map((color) => (
                      <div
                        key={color}
                        className="flex h-10 w-full cursor-pointer items-center justify-center rounded-md border"
                        style={{ backgroundColor: color }}
                      >
                        <div className="h-6 w-6 rounded-full bg-white"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Appearance Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

