"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Moon, Palette, Sun, Check } from "lucide-react"
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
import { useApp } from "@/context/app-context"
import { useToast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const {
    user,
    updateUserProfile,
    updateSecuritySettings,
    updateDisplaySettings,
    updateAccentColor,
    logoutAllDevices,
  } = useApp()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("general")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isLoggingOutAllDevices, setIsLoggingOutAllDevices] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Form states
  const [formData, setFormData] = useState({
    language: user?.settings?.language || "en",
    currency: user?.settings?.currency || "USD",
    dateFormat: user?.settings?.dateFormat || "MM/DD/YYYY",
    email: user?.email || "",
    phone: user?.phone || "",
    notifications: {
      email: user?.settings?.notifications?.email ?? true,
      push: user?.settings?.notifications?.push ?? true,
      marketing: user?.settings?.notifications?.marketing ?? false,
    },
    security: {
      twoFactor: user?.settings?.security?.twoFactor ?? false,
      biometricLogin: user?.settings?.security?.biometricLogin ?? true,
      autoLock: user?.settings?.security?.autoLock ?? true,
    },
    display: {
      compactMode: user?.settings?.display?.compactMode ?? false,
      largeText: user?.settings?.display?.largeText ?? false,
      reduceMotion: user?.settings?.display?.reduceMotion ?? false,
    },
    accentColor: user?.settings?.accentColor || "#0ea5e9",
  })

  const handleSaveGeneralSettings = async () => {
    setIsUpdating(true)
    try {
      await updateUserProfile({
        email: formData.email,
        phone: formData.phone,
        settings: {
          ...user?.settings,
          language: formData.language,
          currency: formData.currency,
          dateFormat: formData.dateFormat,
        },
      })
      toast({
        title: "Settings saved",
        description: "Your general settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSaveNotificationSettings = async () => {
    setIsUpdating(true)
    try {
      await updateUserProfile({
        settings: {
          ...user?.settings,
          notifications: formData.notifications,
        },
      })
      toast({
        title: "Notification settings saved",
        description: "Your notification preferences have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your notification settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSaveSecuritySettings = async () => {
    setIsUpdating(true)
    try {
      await updateSecuritySettings(formData.security)
      toast({
        title: "Security settings saved",
        description: "Your security settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your security settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSaveDisplaySettings = async () => {
    setIsUpdating(true)
    try {
      await updateDisplaySettings(formData.display)
      toast({
        title: "Display settings saved",
        description: "Your display settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your display settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      })
      return
    }

    setIsChangingPassword(true)
    try {
      // In a real app, we would call an API to change the password
      // For demo purposes, we'll just simulate success
      setTimeout(() => {
        toast({
          title: "Password changed",
          description: "Your password has been changed successfully.",
        })
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        setIsChangingPassword(false)
      }, 1000)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error changing your password. Please try again.",
        variant: "destructive",
      })
      setIsChangingPassword(false)
    }
  }

  const handleLogoutAllDevices = async () => {
    setIsLoggingOutAllDevices(true)
    try {
      await logoutAllDevices()
      toast({
        title: "Logged out from all devices",
        description: "You have been logged out from all devices successfully.",
      })
      // Redirect to login page
      window.location.href = "/login"
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error logging out from all devices. Please try again.",
        variant: "destructive",
      })
      setIsLoggingOutAllDevices(false)
    }
  }

  const handleAccentColorChange = async (color: string) => {
    setFormData((prev) => ({ ...prev, accentColor: color }))
    try {
      await updateAccentColor(color)
      toast({
        title: "Accent color updated",
        description: "Your accent color has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your accent color. Please try again.",
        variant: "destructive",
      })
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
                        <Select
                          value={formData.language}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, language: value }))}
                        >
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
                        <Select
                          value={formData.currency}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
                        >
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
                      <RadioGroup
                        value={formData.dateFormat}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, dateFormat: value }))}
                        className="flex flex-col space-y-2"
                      >
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
                          value={formData.email}
                          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+263 77 123 4567"
                          value={formData.phone}
                          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveGeneralSettings} disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
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
                        checked={formData.notifications.email}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            notifications: { ...prev.notifications, email: checked },
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketing-emails">Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about new features and promotions
                        </p>
                      </div>
                      <Switch
                        id="marketing-emails"
                        checked={formData.notifications.marketing}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            notifications: { ...prev.notifications, marketing: checked },
                          }))
                        }
                      />
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
                        checked={formData.notifications.push}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            notifications: { ...prev.notifications, push: checked },
                          }))
                        }
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
                <Button onClick={handleSaveNotificationSettings} disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Preferences"
                  )}
                </Button>
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
                      <Input
                        id="current-password"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleChangePassword}
                    disabled={
                      isChangingPassword ||
                      !passwordData.currentPassword ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword
                    }
                  >
                    {isChangingPassword ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        Changing...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Enable 2FA</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      id="two-factor"
                      checked={formData.security.twoFactor}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          security: { ...prev.security, twoFactor: checked },
                        }))
                      }
                    />
                  </div>
                  {formData.security.twoFactor && (
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
                      <Switch
                        id="biometric-login"
                        checked={formData.security.biometricLogin}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            security: { ...prev.security, biometricLogin: checked },
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-lock">Auto-Lock</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically lock the app after 5 minutes of inactivity
                        </p>
                      </div>
                      <Switch
                        id="auto-lock"
                        checked={formData.security.autoLock}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            security: { ...prev.security, autoLock: checked },
                          }))
                        }
                      />
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogoutAllDevices}
                      disabled={isLoggingOutAllDevices}
                    >
                      {isLoggingOutAllDevices ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                          Logging out...
                        </>
                      ) : (
                        "Log Out of All Other Devices"
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSecuritySettings} disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Security Settings"
                  )}
                </Button>
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
                      <Switch
                        id="compact-mode"
                        checked={formData.display.compactMode}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            display: { ...prev.display, compactMode: checked },
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="large-text">Large Text</Label>
                        <p className="text-sm text-muted-foreground">Increase text size for better readability</p>
                      </div>
                      <Switch
                        id="large-text"
                        checked={formData.display.largeText}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            display: { ...prev.display, largeText: checked },
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="reduce-motion">Reduce Motion</Label>
                        <p className="text-sm text-muted-foreground">Minimize animations throughout the app</p>
                      </div>
                      <Switch
                        id="reduce-motion"
                        checked={formData.display.reduceMotion}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            display: { ...prev.display, reduceMotion: checked },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Accent Color</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { color: "#000000", name: "Black" },
                      { color: "#0ea5e9", name: "Blue" },
                      { color: "#10b981", name: "Green" },
                      { color: "#f59e0b", name: "Amber" },
                      { color: "#ef4444", name: "Red" },
                    ].map((colorOption) => (
                      <div
                        key={colorOption.color}
                        className={`flex h-10 w-full cursor-pointer items-center justify-center rounded-md border ${
                          formData.accentColor === colorOption.color ? "ring-2 ring-offset-2" : ""
                        }`}
                        style={{ backgroundColor: colorOption.color }}
                        onClick={() => handleAccentColorChange(colorOption.color)}
                        title={colorOption.name}
                      >
                        {formData.accentColor === colorOption.color && (
                          <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
                            <Check className="h-4 w-4 text-black" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveDisplaySettings} disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Appearance Settings"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
