"use client"

import type React from 'react';
import { useState } from 'react';

import {
  BarChart3,
  CreditCard,
  History,
  Home,
  LogOut,
  Menu,
  ReceiptText,
  Search,
  Send,
  Settings,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LogoutModal } from '@/components/logout-modal';
import { Notifications } from '@/components/notifications';
import { ThemeSelector } from '@/components/theme-selector';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useApp } from '@/context/app-context';

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const { user, balance, searchTransactions, logout, showLogoutModal, cancelLogout, confirmLogout } = useApp()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchTransactions>>([])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const results = searchTransactions(searchQuery)
      setSearchResults(results)
    }
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Send",
      href: "/dashboard/send",
      icon: <Send className="h-5 w-5" />,
    },
    {
      title: "Receive",
      href: "/dashboard/receive",
      icon: <ReceiptText className="h-5 w-5" />,
    },
    {
      title: "Convert",
      href: "/dashboard/convert",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "History",
      href: "/dashboard/history",
      icon: <History className="h-5 w-5" />,
    },
    {
      title: "Cards",
      href: "/dashboard/cards",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <div className="flex items-center border-b p-4">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <CreditCard className="h-5 w-5" />
                <span>Zimbabwe Stablecoin</span>
              </Link>
              <div className="ml-auto flex items-center gap-2">
                <ThemeSelector />
              </div>
            </div>
            <nav className="flex-1 overflow-auto py-4">
              <div className="grid gap-2 px-4 text-sm">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                      pathname === item.href
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                ))}
                <button
                  onClick={logout}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </nav>
            <div className="border-t p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <CreditCard className="h-5 w-5" />
          <span>Zimbabwe Stablecoin</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Notifications />
          <ThemeSelector />
          <div className="hidden md:flex">
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="hidden border-b md:block">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-full items-center gap-2 border-b-2 px-3 text-sm transition-colors ${
                  pathname === item.href
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </div>
          <div className="ml-auto flex items-center">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Balance:</span>
              <span className="font-medium">${balance.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      <main className="flex-1">{children}</main>
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
      />

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Search Transactions</DialogTitle>
            <DialogDescription>Search for transactions by type, amount, date, or description.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </form>
          <ScrollArea className="h-[300px] mt-4">
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((transaction) => (
                  <div key={transaction.id} className="rounded-lg border p-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium capitalize">{transaction.type.replace("_", " ")}</p>
                        <p className="text-sm text-muted-foreground">{transaction.description}</p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-medium ${transaction.type === "receive" || transaction.type === "add_funds" ? "text-green-600" : "text-red-600"}`}
                        >
                          {transaction.type === "receive" || transaction.type === "add_funds" ? "+" : "-"}$
                          {transaction.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Search className="mb-2 h-10 w-10 text-muted-foreground/50" />
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            ) : null}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
