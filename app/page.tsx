"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  ChevronDown,
  DollarSign,
  Shield,
  Zap,
  ArrowUpDown,
  BarChart3,
  Globe,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useInView } from "react-intersection-observer"
import MainNav from "@/components/main-nav"
import CurrencyConverter from "@/components/currency-converter"
import LiveRatesTicker from "@/components/live-rates-ticker"
import ZimbabweMap from "@/components/zimbabwe-map"
import CountUp from "@/components/count-up"
import { ThemeSelector } from "@/components/theme-selector"
import { useTheme } from "@/components/theme-provider"

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: "Tendai Moyo",
    role: "Small Business Owner",
    content:
      "This stablecoin has transformed how I run my business. I no longer worry about inflation eating away my profits overnight. Transactions are fast and reliable.",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Chiedza Nyathi",
    role: "Teacher",
    content:
      "As someone who sends money to family in rural areas, this platform has been a lifesaver. The fees are minimal, and my relatives can easily convert to local currency when needed.",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Farai Mutasa",
    role: "Tech Entrepreneur",
    content:
      "The stability this coin provides has allowed me to focus on growing my startup instead of constantly worrying about currency fluctuations. The user experience is also excellent.",
    avatar: "/placeholder.svg?height=80&width=80",
  },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState("about")
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [autoplayTestimonials, setAutoplayTestimonials] = useState(true)
  const { theme } = useTheme()

  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  const { ref: statsRef, inView: statsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const { ref: featuresRef, inView: featuresInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const { ref: howItWorksRef, inView: howItWorksInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const { ref: testimonialsRef, inView: testimonialsInView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  // Autoplay testimonials
  useEffect(() => {
    if (!autoplayTestimonials) return

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplayTestimonials])

  // Particle animation for hero section
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const devicePixelRatio = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * devicePixelRatio
      canvas.height = rect.height * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 2 - 1
        this.speedY = Math.random() * 2 - 1
        this.color = isDark
          ? `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`
          : `rgba(0, 0, 0, ${Math.random() * 0.1 + 0.05})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY
        }
      }

      draw() {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles
    const particlesArray: Particle[] = []
    const numberOfParticles = Math.min(100, Math.floor((canvas.width * canvas.height) / 9000))

    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)"
      ctx.lineWidth = 1

      for (let i = 0; i < particlesArray.length; i++) {
        for (let j = i + 1; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x
          const dy = particlesArray[i].y - particlesArray[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y)
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y)
            ctx.stroke()
          }
        }
      }

      // Update and draw particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update()
        particlesArray[i].draw()
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [theme])

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      {/* Hero Section with Parallax Effect */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-primary/10 to-background pt-20 md:pt-24">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        <motion.div className="container relative z-10 px-4 md:px-6" style={{ opacity: heroOpacity, scale: heroScale }}>
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <motion.div
              className="flex flex-col justify-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                <span className="animate-pulse mr-2">●</span> Now Live in Zimbabwe
              </div>
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl xl:text-6xl/none">
                A Stable Digital Currency for{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Zimbabwe&apos;s Future
                </span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Secure, stable, and simple. Our stablecoin provides Zimbabweans with a reliable alternative to combat
                hyperinflation and economic instability.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="h-12 gap-1 bg-primary text-primary-foreground hover:bg-primary/90 group">
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 gap-1 group">
                  Learn More
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-primary/60 opacity-75 blur-lg"></div>
                <div className="relative overflow-hidden rounded-3xl bg-background/80 backdrop-blur-sm shadow-lg">
                  <CurrencyConverter className="p-6" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="mt-12">
          <LiveRatesTicker />
        </div>

        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="bg-background py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Transforming Zimbabwe&apos;s Economy
            </h2>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
              Our stablecoin is already making a significant impact across the country.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <AnimatePresence>
              {statsInView && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="group flex flex-col items-center justify-center rounded-lg border bg-background p-8 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
                      <DollarSign className="h-8 w-8" />
                    </div>
                    <div className="text-4xl font-bold">
                      $<CountUp end={10} suffix="M+" />
                    </div>
                    <p className="mt-2 text-center text-sm text-muted-foreground">Transaction Volume</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="group flex flex-col items-center justify-center rounded-lg border bg-background p-8 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
                      <BarChart3 className="h-8 w-8" />
                    </div>
                    <div className="text-4xl font-bold">
                      <CountUp end={25} suffix="K+" />
                    </div>
                    <p className="mt-2 text-center text-sm text-muted-foreground">Active Users</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="group flex flex-col items-center justify-center rounded-lg border bg-background p-8 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
                      <ArrowUpDown className="h-8 w-8" />
                    </div>
                    <div className="text-4xl font-bold">
                      <CountUp end={150} suffix="K+" />
                    </div>
                    <p className="mt-2 text-center text-sm text-muted-foreground">Transactions</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="group flex flex-col items-center justify-center rounded-lg border bg-background p-8 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
                      <Globe className="h-8 w-8" />
                    </div>
                    <div className="text-4xl font-bold">
                      <CountUp end={10} />
                    </div>
                    <p className="mt-2 text-center text-sm text-muted-foreground">Provinces Covered</p>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <motion.div
              className="flex flex-col justify-center space-y-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                National Coverage
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Serving All of Zimbabwe</h2>
              <p className="text-muted-foreground md:text-lg">
                Our stablecoin platform is available throughout Zimbabwe, with active users in all provinces. We're
                committed to providing financial services to both urban and rural communities.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span>Major urban centers with full service support</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary/60"></div>
                  <span>Growing adoption in smaller cities</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary/30"></div>
                  <span>Expanding to rural communities</span>
                </li>
              </ul>
              <div className="pt-4">
                <Button variant="outline" className="gap-2 group">
                  View Coverage Details
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center justify-center"
            >
              <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                <ZimbabweMap />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="bg-background py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Designed for Zimbabwe</h2>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
              Our stablecoin platform addresses the unique financial challenges faced by Zimbabweans with innovative
              solutions.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-8 md:grid-cols-3">
            <AnimatePresence>
              {featuresInView && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 transition-all group-hover:scale-150"></div>
                    <div className="relative z-10">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Shield className="h-6 w-6" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold">Secure & Stable</h3>
                      <p className="text-muted-foreground">
                        Backed by real assets to maintain stability and protect your wealth from inflation.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ y: -5 }}
                    className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 transition-all group-hover:scale-150"></div>
                    <div className="relative z-10">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Zap className="h-6 w-6" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold">Fast Transactions</h3>
                      <p className="text-muted-foreground">
                        Send and receive funds instantly with minimal fees, regardless of location.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    whileHover={{ y: -5 }}
                    className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 transition-all group-hover:scale-150"></div>
                    <div className="relative z-10">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <DollarSign className="h-6 w-6" />
                      </div>
                      <h3 className="mb-2 text-xl font-bold">Easy Conversion</h3>
                      <p className="text-muted-foreground">
                        Seamlessly convert between stablecoins and Zimbabwean dollars when needed.
                      </p>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="bg-muted/30 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">How It Works</h2>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
              Getting started with our stablecoin is simple and straightforward.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-8 md:grid-cols-3">
            {howItWorksInView && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="relative flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    1
                  </div>
                  <h3 className="text-xl font-bold">Register & Verify</h3>
                  <p className="text-center text-muted-foreground">
                    Create an account and complete the KYC verification process to ensure security.
                  </p>
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/50"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    2
                  </div>
                  <h3 className="text-xl font-bold">Fund Your Wallet</h3>
                  <p className="text-center text-muted-foreground">
                    Deposit funds using mobile money, bank transfer, or other supported methods.
                  </p>
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/50"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.7 }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="relative flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    3
                  </div>
                  <h3 className="text-xl font-bold">Start Transacting</h3>
                  <p className="text-center text-muted-foreground">
                    Send, receive, and store your stablecoins with confidence and ease.
                  </p>
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/50"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.9 }}
                  />
                </motion.div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="bg-background py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mb-10 text-center">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">What Our Users Say</h2>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
              Hear from Zimbabweans who have already benefited from our stablecoin platform.
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-lg bg-background p-8 shadow-md">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5"></div>

              <div className="relative z-10">
                <div className="flex justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-full bg-primary/20 blur-sm"></div>
                      <motion.img
                        src={testimonials[currentTestimonial].avatar}
                        alt={testimonials[currentTestimonial].name}
                        className="relative h-16 w-16 rounded-full object-cover"
                        key={testimonials[currentTestimonial].id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div>
                      <motion.h3
                        className="text-lg font-bold"
                        key={`name-${testimonials[currentTestimonial].id}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        {testimonials[currentTestimonial].name}
                      </motion.h3>
                      <motion.p
                        className="text-sm text-muted-foreground"
                        key={`role-${testimonials[currentTestimonial].id}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        {testimonials[currentTestimonial].role}
                      </motion.p>
                    </div>
                  </div>
                  <div className="text-4xl text-primary/20">"</div>
                </div>

                <motion.blockquote
                  className="mb-8 text-lg md:text-xl"
                  key={`quote-${testimonials[currentTestimonial].id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {testimonials[currentTestimonial].content}
                </motion.blockquote>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        className={`h-2 w-8 rounded-full transition-colors ${
                          index === currentTestimonial ? "bg-primary" : "bg-muted"
                        }`}
                        onClick={() => setCurrentTestimonial(index)}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
                      }
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setAutoplayTestimonials(!autoplayTestimonials)
                      }}
                    >
                      {autoplayTestimonials ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Learn More</h2>
            <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
              Discover how our stablecoin platform can benefit you.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-auto max-w-4xl">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="technology">Technology</TabsTrigger>
            </TabsList>

            <Card className="mt-6 border-0 shadow-none">
              <CardContent className="p-0">
                <TabsContent value="about" className="mt-0 rounded-lg border bg-background p-6">
                  <motion.div
                    key="about"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="mb-3 text-xl font-bold">What is Zimbabwe Stablecoin?</h3>
                        <p className="text-muted-foreground">
                          Zimbabwe Stablecoin is a digital currency specifically designed for the Zimbabwean market. It
                          maintains a stable value by being pegged to a basket of stable assets, providing users with a
                          reliable alternative to the volatile local currency.
                        </p>
                      </div>
                      <div>
                        <h3 className="mb-3 text-xl font-bold">Why We Created It</h3>
                        <p className="text-muted-foreground">
                          After years of hyperinflation and economic instability in Zimbabwe, we recognized the need for
                          a stable, secure, and accessible financial tool that could help individuals and businesses
                          protect their wealth and conduct transactions with confidence.
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 rounded-lg bg-muted/50 p-4">
                      <h4 className="mb-2 font-semibold">Our Mission</h4>
                      <p className="text-muted-foreground">
                        To provide financial stability and inclusion to all Zimbabweans through innovative blockchain
                        technology, enabling economic growth and prosperity across the nation.
                      </p>
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="benefits" className="mt-0 rounded-lg border bg-background p-6">
                  <motion.div
                    key="benefits"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border p-4">
                        <h3 className="mb-2 text-lg font-semibold">For Individuals</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                            <span>Protection against inflation and currency devaluation</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                            <span>Secure storage of value without needing a bank account</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                            <span>Fast and affordable remittances from abroad</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                            <span>Easy conversion to local currency when needed</span>
                          </li>
                        </ul>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="mb-2 text-lg font-semibold">For Businesses</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                            <span>Stable pricing without daily adjustments</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                            <span>Reduced currency risk for imports and exports</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                            <span>Simplified payroll and vendor payments</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                            <span>Access to international markets and suppliers</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 rounded-lg bg-muted/50 p-4">
                      <h4 className="mb-2 font-semibold">Economic Impact</h4>
                      <p className="text-muted-foreground">
                        By providing a stable medium of exchange, our stablecoin helps reduce economic uncertainty,
                        encourages savings, and facilitates investment in Zimbabwe's future.
                      </p>
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="technology" className="mt-0 rounded-lg border bg-background p-6">
                  <motion.div
                    key="technology"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div>
                      <h3 className="mb-3 text-xl font-bold">Blockchain Technology</h3>
                      <p className="text-muted-foreground">
                        Our stablecoin is built on a secure, scalable blockchain that ensures transparency,
                        immutability, and fast transaction processing. Every transaction is recorded on a distributed
                        ledger, providing an unalterable history that can be verified by anyone.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-lg border p-4">
                        <h4 className="mb-2 font-semibold">Security</h4>
                        <p className="text-sm text-muted-foreground">
                          Advanced cryptography and multi-signature wallets protect user funds, while regular security
                          audits ensure the platform remains secure.
                        </p>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h4 className="mb-2 font-semibold">Stability Mechanism</h4>
                        <p className="text-sm text-muted-foreground">
                          Our stablecoin maintains its value through a combination of asset backing and algorithmic
                          stabilization mechanisms.
                        </p>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h4 className="mb-2 font-semibold">Scalability</h4>
                        <p className="text-sm text-muted-foreground">
                          The platform can handle thousands of transactions per second, ensuring it can grow with
                          Zimbabwe's needs.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-lg bg-muted/50 p-4">
                      <h4 className="mb-2 font-semibold">Regulatory Compliance</h4>
                      <p className="text-muted-foreground">
                        We work closely with Zimbabwean financial authorities to ensure full compliance with all
                        relevant regulations, including KYC and AML requirements.
                      </p>
                    </div>
                  </motion.div>
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=500&width=1000')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80"></div>
        <div className="container relative z-10 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Join the Financial Revolution
              </h2>
              <p className="mx-auto max-w-[700px] text-primary-foreground/90 md:text-xl">
                Be part of the solution to Zimbabwe&apos;s economic challenges. Start using our stablecoin today and
                take control of your financial future.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col gap-2 min-[400px]:flex-row"
            >
              <Button
                size="lg"
                variant="secondary"
                className="h-12 gap-1 bg-white text-primary hover:bg-white/90 group"
                asChild
              >
                <Link href="/dashboard">
                  Access Dashboard <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 gap-1 border-white text-white hover:bg-white/10">
                Contact Us
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
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
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
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
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
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
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
            <div className="flex items-center justify-center mb-4">
              <ThemeSelector />
            </div>
            <p>© {new Date().getFullYear()} Zimbabwe Stablecoin. All rights reserved.</p>
            <p className="mt-1">Regulated by the Reserve Bank of Zimbabwe.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
