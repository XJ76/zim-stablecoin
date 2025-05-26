"use client"

import type React from 'react';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { motion } from 'framer-motion';
import {
  Check,
  DollarSign,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  UserPlus,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useTheme } from '@/components/theme-provider';
import { ThemeSelector } from '@/components/theme-selector';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useApp } from '@/context/app-context';

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { register, isAuthenticated } = useApp()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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

    // First name and last name validation
    if (!formState.firstName) {
      errors.firstName = "First name is required"
    }
    if (!formState.lastName) {
      errors.lastName = "Last name is required"
    }

    setFormErrors(errors)
    return !Object.values(errors).some((error) => error)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
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
              Create an account
            </motion.h1>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Join thousands of Zimbabweans using our stablecoin
            </motion.p>
          </div>

          <Card>
            <CardContent className="pt-6">
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
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      Password
                    </Label>
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
                    Already have an account?{" "}
                    <Link href="/login" className="underline underline-offset-2 hover:text-primary">
                      Sign in
                    </Link>
                  </p>
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
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 