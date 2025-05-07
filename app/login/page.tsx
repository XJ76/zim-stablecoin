"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { DollarSign, Eye, EyeOff, ArrowRight, Check, Lock, Mail, User, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeSelector } from "@/components/theme-selector"
import { useTheme } from "@/components/theme-provider"
import { useApp } from "@/context/app-context"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { login, register, isAuthenticated } = useApp()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  })
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  })
  const [passwordStrength, setPasswordStrength] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  // Background animation using canvas directly instead of React state
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const devicePixelRatio = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * devicePixelRatio
      canvas.height = window.innerHeight * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Create particles
    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
    const particles: Array<{
      x: number
      y: number
      size: number
      vx: number
      vy: number
      color: string
    }> = []

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: isDark
          ? `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`
          : `rgba(0, 0, 0, ${Math.random() * 0.1 + 0.05})`,
      })
    }

    // Animation loop
    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)"
      ctx.lineWidth = 1

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i]

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x > canvas.width || particle.x < 0) {
          particle.vx = -particle.vx
        }
        if (particle.y > canvas.height || particle.y < 0) {
          particle.vy = -particle.vy
        }

        // Draw particle
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [theme]) // Only re-run when theme changes

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))

    // Clear errors when typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // Password strength check
    if (name === "password") {
      let strength = 0
      if (value.length > 6) strength += 1
      if (/[A-Z]/.test(value)) strength += 1
      if (/[0-9]/.test(value)) strength += 1
      if (/[^A-Za-z0-9]/.test(value)) strength += 1
      setPasswordStrength(strength)
    }
  }

  const validateForm = () => {
    const errors = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    }

    // Email validation
    if (!formState.email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errors.email = "Email is invalid"
    }

    // Password validation
    if (!formState.password) {
      errors.password = "Password is required"
    } else if (formState.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    // First name and last name validation for registration
    if (activeTab === "register") {
      if (!formState.firstName) {
        errors.firstName = "First name is required"
      }
      if (!formState.lastName) {
        errors.lastName = "Last name is required"
      }
    }

    setFormErrors(errors)
    return !Object.values(errors).some((error) => error)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      if (activeTab === "login") {
        const success = await login(formState.email, formState.password)
        if (success) {
          router.push("/dashboard")
        } else {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          })
        }
      } else {
        const success = await register({
          firstName: formState.firstName,
          lastName: formState.lastName,
          email: formState.email,
          password: formState.password,
        })
        if (success) {
          toast({
            title: "Registration Successful",
            description: "Your account has been created. Welcome to Zimbabwe Stablecoin!",
          })
          router.push("/dashboard")
        } else {
          toast({
            title: "Registration Failed",
            description: "There was an error creating your account. Please try again.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30 relative overflow-hidden">
      {/* Animated background particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full" />

      <div className="absolute top-4 right-4 z-50">
        <ThemeSelector />
      </div>

      <div className="container relative z-10 flex flex-1 items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex flex-col items-center text-center">
            <Link href="/" className="mb-6 flex items-center gap-2 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground group-hover:scale-110 transition-transform">
                <DollarSign className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold">Zimbabwe Stablecoin</span>
            </Link>
            <motion.h1
              className="text-2xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {activeTab === "login" ? "Welcome back" : "Create an account"}
            </motion.h1>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {activeTab === "login"
                ? "Sign in to your account to continue"
                : "Join thousands of Zimbabweans using our stablecoin"}
            </motion.p>
          </div>

          <Card className="border-none shadow-xl overflow-hidden bg-background/95 backdrop-blur-sm">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <div className="p-6">
                  {activeTab === "login" && (
                    <motion.div
                      key="login-form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              Email
                            </Label>
                            <div className="relative">
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                value={formState.email}
                                onChange={handleInputChange}
                                className={formErrors.email ? "border-red-500" : ""}
                              />
                              {formState.email && !formErrors.email && (
                                <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                              )}
                            </div>
                            {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="password" className="flex items-center gap-2">
                                <Lock className="h-4 w-4 text-muted-foreground" />
                                Password
                              </Label>
                              <Link href="#" className="text-xs text-primary hover:underline">
                                Forgot password?
                              </Link>
                            </div>
                            <div className="relative">
                              <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formState.password}
                                onChange={handleInputChange}
                                className={formErrors.password ? "border-red-500" : ""}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                              </Button>
                            </div>
                            {formErrors.password && <p className="text-xs text-red-500">{formErrors.password}</p>}
                          </div>
                          <Button type="submit" className="w-full group" disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                                Signing in...
                              </>
                            ) : (
                              <>
                                Sign in
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {activeTab === "register" && (
                    <motion.div
                      key="register-form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="first-name" className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                First name
                              </Label>
                              <Input
                                id="first-name"
                                name="firstName"
                                placeholder="Tendai"
                                value={formState.firstName}
                                onChange={handleInputChange}
                                className={formErrors.firstName ? "border-red-500" : ""}
                              />
                              {formErrors.firstName && <p className="text-xs text-red-500">{formErrors.firstName}</p>}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="last-name">Last name</Label>
                              <Input
                                id="last-name"
                                name="lastName"
                                placeholder="Moyo"
                                value={formState.lastName}
                                onChange={handleInputChange}
                                className={formErrors.lastName ? "border-red-500" : ""}
                              />
                              {formErrors.lastName && <p className="text-xs text-red-500">{formErrors.lastName}</p>}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="register-email" className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              Email
                            </Label>
                            <div className="relative">
                              <Input
                                id="register-email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                value={formState.email}
                                onChange={handleInputChange}
                                className={formErrors.email ? "border-red-500" : ""}
                              />
                              {formState.email && !formErrors.email && (
                                <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                              )}
                            </div>
                            {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="register-password" className="flex items-center gap-2">
                              <Lock className="h-4 w-4 text-muted-foreground" />
                              Password
                            </Label>
                            <div className="relative">
                              <Input
                                id="register-password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formState.password}
                                onChange={handleInputChange}
                                className={formErrors.password ? "border-red-500" : ""}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                              </Button>
                            </div>
                            {formState.password && (
                              <div className="mt-1">
                                <div className="flex gap-1 mb-1">
                                  {[...Array(4)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`h-1 flex-1 rounded-full ${
                                        i < passwordStrength
                                          ? passwordStrength === 1
                                            ? "bg-red-500"
                                            : passwordStrength === 2
                                              ? "bg-orange-500"
                                              : passwordStrength === 3
                                                ? "bg-yellow-500"
                                                : "bg-green-500"
                                          : "bg-muted"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {passwordStrength === 0 && "Very weak"}
                                  {passwordStrength === 1 && "Weak"}
                                  {passwordStrength === 2 && "Medium"}
                                  {passwordStrength === 3 && "Strong"}
                                  {passwordStrength === 4 && "Very strong"}
                                </p>
                              </div>
                            )}
                            {formErrors.password && <p className="text-xs text-red-500">{formErrors.password}</p>}
                          </div>
                          <Button type="submit" className="w-full group" disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                                Creating account...
                              </>
                            ) : (
                              <>
                                Create account
                                <UserPlus className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                          <p className="text-center text-xs text-muted-foreground">
                            By creating an account, you agree to our{" "}
                            <Link href="#" className="underline underline-offset-2 hover:text-primary">
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="#" className="underline underline-offset-2 hover:text-primary">
                              Privacy Policy
                            </Link>
                            .
                          </p>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </div>
              </Tabs>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              {activeTab === "login" ? "Don't have an account? " : "Already have an account? "}
              <Button
                variant="link"
                className="p-0 text-primary"
                onClick={() => setActiveTab(activeTab === "login" ? "register" : "login")}
              >
                {activeTab === "login" ? "Sign up" : "Sign in"}
              </Button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
