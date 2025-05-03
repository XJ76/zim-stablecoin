"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { DollarSign, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import { ThemeSelector } from "@/components/theme-selector"

export default function MainNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
    { name: "Pricing", href: "#pricing" },
    {
      name: "Resources",
      href: "#resources",
      children: [
        { name: "Documentation", href: "#documentation" },
        { name: "API", href: "#api" },
        { name: "Support", href: "#support" },
      ],
    },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative">
            <div
              className={`absolute -inset-1 rounded-full ${isScrolled ? "bg-primary/20" : "bg-primary/30"} blur-sm transition-all duration-200`}
            ></div>
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <span className="text-lg font-bold">Zimbabwe Stablecoin</span>
        </Link>

        {!isMobile ? (
          <nav className="flex items-center gap-6">
            <ul className="flex gap-6">
              {navItems.map((item) => (
                <li key={item.name} className="relative group">
                  {item.children ? (
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        {item.name}
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <div className="absolute left-0 top-full z-50 mt-2 hidden w-48 rounded-md border bg-background shadow-md group-hover:block">
                        <ul className="py-1">
                          {item.children.map((child) => (
                            <li key={child.name}>
                              <Link
                                href={child.href}
                                className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                              >
                                {child.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2">
              <ThemeSelector />
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </nav>
        ) : (
          <div className="flex items-center gap-2">
            <ThemeSelector />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {mobileMenuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-background/95 backdrop-blur-sm shadow-md"
          >
            <div className="container px-4 py-4 md:px-6">
              <nav className="flex flex-col gap-4">
                <ul className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <li key={item.name}>
                      {item.children ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{item.name}</span>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <ul className="ml-4 space-y-1 border-l pl-4">
                            {item.children.map((child) => (
                              <li key={child.name}>
                                <Link
                                  href={child.href}
                                  className="text-sm text-muted-foreground hover:text-foreground"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {child.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className="text-sm font-medium hover:text-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-2 pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      Dashboard
                    </Link>
                  </Button>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

