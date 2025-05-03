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

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal")
  const [isEditing, setIsEditing] = useState(false)

  const user = {
    name: "Tendai Moyo",
    email: "tendai.moyo@example.com",
    phone: "+263 77 123 4567",
    address: "123 Samora Machel Ave, Harare, Zimbabwe",
    bio: "Entrepreneur and tech enthusiast based in Harare. Passionate about digital currencies and financial inclusion in Zimbabwe.",
    avatar: "/placeholder.svg?height=128&width=128",
    joinDate: "January 2023",
    verificationStatus: "Verified",
    occupation: "Business Owner",
    website: "www.tendaimoyo.com",
    socialMedia: {
      twitter: "@tendai_moyo",
      linkedin: "tendaimoyo",
      facebook: "tendaimoyo",
    },
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
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
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
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.occupation}</p>
                  <div className="mt-2 flex items-center gap-1">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Verified className="h-3 w-3 text-blue-500" />
                      <span>{user.verificationStatus}</span>
                    </Badge>
                  </div>
                  <div className="mt-4 w-full space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.website}</span>
                    </div>
                  </div>
                  <div className="mt-6 w-full">
                    <h3 className="mb-2 text-sm font-medium">Bio</h3>
                    <p className="text-sm text-muted-foreground">{user.bio}</p>
                  </div>
                  <div className="mt-6 w-full">
                    <h3 className="mb-2 text-sm font-medium">Member Since</h3>
                    <p className="text-sm text-muted-foreground">{user.joinDate}</p>
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
                            <Input id="first-name" defaultValue="Tendai" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last-name">Last Name</Label>
                            <Input id="last-name" defaultValue="Moyo" />
                          </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue={user.email} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" type="tel" defaultValue={user.phone} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input id="address" defaultValue={user.address} />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="occupation">Occupation</Label>
                            <Input id="occupation" defaultValue={user.occupation} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input id="website" defaultValue={user.website} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea id="bio" rows={4} defaultValue={user.bio} />
                        </div>
                        <div className="space-y-2">
                          <Label>Social Media</Label>
                          <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                              <Label htmlFor="twitter" className="text-xs">
                                Twitter
                              </Label>
                              <Input id="twitter" defaultValue={user.socialMedia.twitter} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="linkedin" className="text-xs">
                                LinkedIn
                              </Label>
                              <Input id="linkedin" defaultValue={user.socialMedia.linkedin} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="facebook" className="text-xs">
                                Facebook
                              </Label>
                              <Input id="facebook" defaultValue={user.socialMedia.facebook} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                            <p className="mt-1">{user.name}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                            <p className="mt-1">{user.email}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                            <p className="mt-1">{user.phone}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                            <p className="mt-1">{user.address}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Occupation</h3>
                            <p className="mt-1">{user.occupation}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
                            <p className="mt-1">{user.website}</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
                          <p className="mt-1">{user.bio}</p>
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
                              <span>{user.socialMedia.twitter}</span>
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
                              <span>{user.socialMedia.linkedin}</span>
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
                              <span>{user.socialMedia.facebook}</span>
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
                            date: "Today, 10:30 AM",
                            details: "Chrome on Windows • Harare, Zimbabwe",
                          },
                          {
                            action: "Password Changed",
                            date: "March 15, 2023",
                            details: "Chrome on Windows • Harare, Zimbabwe",
                          },
                          {
                            action: "Profile Updated",
                            date: "February 28, 2023",
                            details: "Chrome on Windows • Harare, Zimbabwe",
                          },
                          {
                            action: "Account Created",
                            date: "January 10, 2023",
                            details: "Chrome on Windows • Harare, Zimbabwe",
                          },
                        ].map((activity, index) => (
                          <div key={index} className="flex items-start gap-4 rounded-lg border p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{activity.action}</p>
                              <p className="text-sm text-muted-foreground">{activity.date}</p>
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
                  <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}

