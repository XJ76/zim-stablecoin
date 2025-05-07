"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Camera, Edit, Globe, Mail, MapPin, Phone, Shield, User, Verified } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThemeSelector } from "@/components/theme-selector"
import DashboardLayout from "@/components/dashboard-layout"
import { useApp } from "@/context/app-context"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"

export default function ProfilePage() {
  const { user, updateUserProfile } = useApp()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("personal")
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    occupation: user?.occupation || "",
    website: user?.website || "",
    bio: user?.bio || "",
    socialMedia: {
      twitter: user?.socialMedia?.twitter || "",
      linkedin: user?.socialMedia?.linkedin || "",
      facebook: user?.socialMedia?.facebook || "",
    },
  })

  const handleSaveProfile = async () => {
    setIsUpdating(true)
    try {
      await updateUserProfile({
        ...formData,
      })
      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
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
            <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSelector />
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-1"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.firstName} />
                      <AvatarFallback>
                        {user?.firstName && user?.lastName ? `${user.firstName[0]}${user.lastName[0]}` : "U"}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <h2 className="text-xl font-bold">{user ? `${user.firstName} ${user.lastName}` : ""}</h2>
                  <p className="text-sm text-muted-foreground">{user?.occupation}</p>
                  <div className="mt-2 flex items-center gap-1">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Verified className="h-3 w-3 text-blue-500" />
                      <span>{user?.verificationStatus}</span>
                    </Badge>
                  </div>
                  <div className="mt-4 w-full space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user?.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user?.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user?.website}</span>
                    </div>
                  </div>
                  <div className="mt-6 w-full">
                    <h3 className="mb-2 text-sm font-medium">Bio</h3>
                    <p className="text-sm text-muted-foreground">{user?.bio}</p>
                  </div>
                  <div className="mt-6 w-full">
                    <h3 className="mb-2 text-sm font-medium">Member Since</h3>
                    <p className="text-sm text-muted-foreground">{user?.joinDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  {isEditing ? "Edit your profile information" : "View and manage your profile details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="mt-6 space-y-6">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="first-name">First Name</Label>
                            <Input
                              id="first-name"
                              value={formData.firstName}
                              onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last-name">Last Name</Label>
                            <Input
                              id="last-name"
                              value={formData.lastName}
                              onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                          />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="occupation">Occupation</Label>
                            <Input
                              id="occupation"
                              value={formData.occupation}
                              onChange={(e) => setFormData((prev) => ({ ...prev, occupation: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                              id="website"
                              value={formData.website}
                              onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            rows={4}
                            value={formData.bio}
                            onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Social Media</Label>
                          <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                              <Label htmlFor="twitter" className="text-xs">
                                Twitter
                              </Label>
                              <Input
                                id="twitter"
                                value={formData.socialMedia.twitter}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    socialMedia: { ...prev.socialMedia, twitter: e.target.value },
                                  }))
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="linkedin" className="text-xs">
                                LinkedIn
                              </Label>
                              <Input
                                id="linkedin"
                                value={formData.socialMedia.linkedin}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    socialMedia: { ...prev.socialMedia, linkedin: e.target.value },
                                  }))
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="facebook" className="text-xs">
                                Facebook
                              </Label>
                              <Input
                                id="facebook"
                                value={formData.socialMedia.facebook}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    socialMedia: { ...prev.socialMedia, facebook: e.target.value },
                                  }))
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                            <p className="mt-1">{user ? `${user.firstName} ${user.lastName}` : ""}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                            <p className="mt-1">{user?.email}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                            <p className="mt-1">{user?.phone}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                            <p className="mt-1">{user?.address}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Occupation</h3>
                            <p className="mt-1">{user?.occupation}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
                            <p className="mt-1">{user?.website}</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
                          <p className="mt-1">{user?.bio}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Social Media</h3>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-3 w-3"
                              >
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                              </svg>
                              <span>{user?.socialMedia?.twitter}</span>
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-3 w-3"
                              >
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                <rect width="4" height="12" x="2" y="9" />
                                <circle cx="4" cy="4" r="2" />
                              </svg>
                              <span>{user?.socialMedia?.linkedin}</span>
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-3 w-3"
                              >
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                              </svg>
                              <span>{user?.socialMedia?.facebook}</span>
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="security" className="mt-6 space-y-6">
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Password</h3>
                            <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            Change
                          </Button>
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Two-Factor Authentication</h3>
                            <p className="text-sm text-muted-foreground">Not enabled</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Shield className="mr-2 h-4 w-4" />
                            Enable
                          </Button>
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Active Sessions</h3>
                            <p className="text-sm text-muted-foreground">1 active session</p>
                          </div>
                          <Button variant="outline" size="sm">
                            View All
                          </Button>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-2">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-sm">Chrome on Windows • Harare, Zimbabwe</span>
                            </div>
                            <span className="text-xs text-muted-foreground">Current</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="activity" className="mt-6 space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Recent Activity</h3>
                      <div className="space-y-4">
                        {[
                          {
                            action: "Login",
                            date: new Date().toISOString(),
                            details: "Chrome on Windows • Harare, Zimbabwe",
                          },
                          {
                            action: "Password Changed",
                            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                            details: "Chrome on Windows • Harare, Zimbabwe",
                          },
                          {
                            action: "Profile Updated",
                            date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                            details: "Chrome on Windows • Harare, Zimbabwe",
                          },
                          {
                            action: "Account Created",
                            date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
                            details: "Chrome on Windows • Harare, Zimbabwe",
                          },
                        ].map((activity, index) => (
                          <div key={index} className="flex items-start gap-4 rounded-lg border p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{activity.action}</p>
                              <p className="text-sm text-muted-foreground">{format(new Date(activity.date), "PPp")}</p>
                              <p className="text-sm text-muted-foreground">{activity.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              {isEditing && (
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={isUpdating}>
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
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
