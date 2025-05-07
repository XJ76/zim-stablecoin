"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

// Types
export type TransactionType = "send" | "receive" | "convert" | "add_funds" | "payment_request"
export type NotificationType = "transaction" | "security" | "system"

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  date: string
  from?: string
  to?: string
  status: "pending" | "completed" | "failed"
  description?: string
}

export interface Card {
  id: string
  type: "virtual" | "physical"
  number: string
  fullNumber: string
  name: string
  expiry: string
  cvv: string
  fullCvv: string
  balance: number
  limit: number
  status: "active" | "inactive" | "frozen"
}

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  date: string
  read: boolean
}

export interface PaymentRequest {
  id: string
  amount: number
  description: string
  from?: string
  to?: string
  date: string
  status: "pending" | "completed" | "cancelled"
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  bio: string
  avatar: string
  joinDate: string
  verificationStatus: "verified" | "unverified" | "pending"
  occupation: string
  website: string
  socialMedia: {
    twitter: string
    linkedin: string
    facebook: string
  }
  settings: {
    language: string
    currency: string
    dateFormat: string
    theme: string
    accentColor: string
    notifications: {
      email: boolean
      push: boolean
      marketing: boolean
    }
    security: {
      twoFactor: boolean
      biometricLogin: boolean
      autoLock: boolean
    }
    display: {
      compactMode: boolean
      largeText: boolean
      reduceMotion: boolean
    }
  }
  sessions: {
    id: string
    device: string
    location: string
    lastActive: string
    current: boolean
  }[]
}

interface AppContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  balance: number
  setBalance: React.Dispatch<React.SetStateAction<number>>
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, "id" | "date" | "status">) => void
  cards: Card[]
  addCard: (card: Omit<Card, "id">) => void
  updateCard: (id: string, updates: Partial<Card>) => void
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "date" | "read">) => void
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: () => void
  unreadNotificationsCount: number
  paymentRequests: PaymentRequest[]
  createPaymentRequest: (request: Omit<PaymentRequest, "id" | "date" | "status">) => void
  updatePaymentRequest: (id: string, status: PaymentRequest["status"]) => void
  walletAddress: string
  zwlRate: number
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  logoutAllDevices: () => Promise<boolean>
  register: (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) => Promise<boolean>
  addFunds: (amount: number) => void
  sendMoney: (amount: number, recipient: string, note?: string) => Promise<boolean>
  receiveMoney: (amount: number, sender: string, note?: string) => Promise<boolean>
  convertCurrency: (amount: number, from: string, to: string) => Promise<boolean>
  exportTransactions: () => void
  updateUserProfile: (updates: Partial<User>) => Promise<boolean>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  updateSecuritySettings: (settings: Partial<User["settings"]["security"]>) => Promise<boolean>
  updateDisplaySettings: (settings: Partial<User["settings"]["display"]>) => Promise<boolean>
  updateAccentColor: (color: string) => Promise<boolean>
  searchTransactions: (query: string) => Transaction[]
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([])
  const [walletAddress] = useState("zsc1q8c6fshw2zzd5k5ym4h7wakn6v9sfyjq9u7xyv")
  const [zwlRate] = useState(3500)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0)

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const storedBalance = localStorage.getItem("balance")
    const storedTransactions = localStorage.getItem("transactions")
    const storedCards = localStorage.getItem("cards")
    const storedNotifications = localStorage.getItem("notifications")
    const storedPaymentRequests = localStorage.getItem("paymentRequests")
    const storedAuth = localStorage.getItem("isAuthenticated")

    if (storedUser) setUser(JSON.parse(storedUser))
    if (storedBalance) setBalance(Number(storedBalance))
    if (storedTransactions) setTransactions(JSON.parse(storedTransactions))
    if (storedCards) setCards(JSON.parse(storedCards))
    if (storedNotifications) setNotifications(JSON.parse(storedNotifications))
    if (storedPaymentRequests) setPaymentRequests(JSON.parse(storedPaymentRequests))
    if (storedAuth) setIsAuthenticated(storedAuth === "true")
  }, [])

  // Update unread notifications count
  useEffect(() => {
    setUnreadNotificationsCount(notifications.filter((n) => !n.read).length)
  }, [notifications])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("balance", String(balance))
    localStorage.setItem("transactions", JSON.stringify(transactions))
    localStorage.setItem("cards", JSON.stringify(cards))
    localStorage.setItem("notifications", JSON.stringify(notifications))
    localStorage.setItem("paymentRequests", JSON.stringify(paymentRequests))
    localStorage.setItem("isAuthenticated", String(isAuthenticated))
  }, [user, balance, transactions, cards, notifications, paymentRequests, isAuthenticated])

  const addTransaction = (transaction: Omit<Transaction, "id" | "date" | "status">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
      date: new Date().toISOString(),
      status: "completed",
    }

    setTransactions((prev) => [newTransaction, ...prev])

    // Add notification for transaction
    let notificationTitle = ""
    let notificationMessage = ""

    switch (transaction.type) {
      case "send":
        notificationTitle = "Money Sent"
        notificationMessage = `You sent $${transaction.amount.toFixed(2)} to ${transaction.to}`
        break
      case "receive":
        notificationTitle = "Money Received"
        notificationMessage = `You received $${transaction.amount.toFixed(2)} from ${transaction.from}`
        break
      case "convert":
        notificationTitle = "Currency Converted"
        notificationMessage = `You converted ${transaction.amount} ${transaction.from} to ${transaction.to}`
        break
      case "add_funds":
        notificationTitle = "Funds Added"
        notificationMessage = `$${transaction.amount.toFixed(2)} has been added to your wallet`
        break
      case "payment_request":
        notificationTitle = "Payment Request"
        notificationMessage = `A payment request for $${transaction.amount.toFixed(2)} has been created`
        break
    }

    addNotification({
      type: "transaction",
      title: notificationTitle,
      message: notificationMessage,
    })
  }

  const addCard = (card: Omit<Card, "id">) => {
    const newCard: Card = {
      ...card,
      id: uuidv4(),
    }

    setCards((prev) => [...prev, newCard])

    addNotification({
      type: "system",
      title: "New Card Added",
      message: `A new ${card.type} card has been added to your account`,
    })
  }

  const updateCard = (id: string, updates: Partial<Card>) => {
    setCards((prev) =>
      prev.map((card) => {
        if (card.id === id) {
          return { ...card, ...updates }
        }
        return card
      }),
    )
  }

  const addNotification = (notification: Omit<Notification, "id" | "date" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      date: new Date().toISOString(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => {
        if (notification.id === id) {
          return { ...notification, read: true }
        }
        return notification
      }),
    )
  }

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const createPaymentRequest = (request: Omit<PaymentRequest, "id" | "date" | "status">) => {
    const newRequest: PaymentRequest = {
      ...request,
      id: uuidv4(),
      date: new Date().toISOString(),
      status: "pending",
    }

    setPaymentRequests((prev) => [newRequest, ...prev])

    addNotification({
      type: "transaction",
      title: "Payment Request Created",
      message: `You created a payment request for $${request.amount.toFixed(2)}`,
    })
  }

  const updatePaymentRequest = (id: string, status: PaymentRequest["status"]) => {
    setPaymentRequests((prev) =>
      prev.map((request) => {
        if (request.id === id) {
          return { ...request, status }
        }
        return request
      }),
    )

    const request = paymentRequests.find((r) => r.id === id)
    if (request) {
      addNotification({
        type: "transaction",
        title: `Payment Request ${status === "completed" ? "Completed" : "Cancelled"}`,
        message: `Your payment request for $${request.amount.toFixed(2)} has been ${status}`,
      })
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // For demo purposes, any email/password combination works
        const storedUser = localStorage.getItem("registeredUser")

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          if (parsedUser.email === email) {
            const defaultSettings = {
              language: "en",
              currency: "USD",
              dateFormat: "MM/DD/YYYY",
              theme: "system",
              accentColor: "#0ea5e9",
              notifications: {
                email: true,
                push: true,
                marketing: false,
              },
              security: {
                twoFactor: false,
                biometricLogin: true,
                autoLock: true,
              },
              display: {
                compactMode: false,
                largeText: false,
                reduceMotion: false,
              },
            }

            const defaultSession = {
              id: uuidv4(),
              device: "Chrome on Windows",
              location: "Harare, Zimbabwe",
              lastActive: new Date().toISOString(),
              current: true,
            }

            setUser({
              id: parsedUser.id || uuidv4(),
              firstName: parsedUser.firstName,
              lastName: parsedUser.lastName,
              email: parsedUser.email,
              phone: parsedUser.phone || "+263 77 123 4567",
              address: parsedUser.address || "123 Samora Machel Ave, Harare, Zimbabwe",
              bio: parsedUser.bio || "New user on Zimbabwe Stablecoin platform.",
              avatar: "/placeholder.svg?height=128&width=128",
              joinDate:
                parsedUser.joinDate || new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
              verificationStatus: "verified",
              occupation: parsedUser.occupation || "Not specified",
              website: parsedUser.website || "",
              socialMedia: {
                twitter: parsedUser.socialMedia?.twitter || "",
                linkedin: parsedUser.socialMedia?.linkedin || "",
                facebook: parsedUser.socialMedia?.facebook || "",
              },
              settings: parsedUser.settings || defaultSettings,
              sessions: parsedUser.sessions || [defaultSession],
            })
            setIsAuthenticated(true)

            // Initialize with empty transactions for new users
            if (!localStorage.getItem("transactions")) {
              setTransactions([])
            }

            // Initialize with default balance if not set
            if (!localStorage.getItem("balance")) {
              setBalance(0)
            }

            // Initialize with default virtual card
            if (!localStorage.getItem("cards")) {
              const defaultCard: Card = {
                id: uuidv4(),
                type: "virtual",
                number: "4539 **** **** 5271",
                fullNumber: "4539 7852 3641 5271",
                name: `${parsedUser.firstName.toUpperCase()} ${parsedUser.lastName.toUpperCase()}`,
                expiry: "09/27",
                cvv: "***",
                fullCvv: "123",
                balance: 0,
                limit: 2000,
                status: "active",
              }
              setCards([defaultCard])
            }

            // Add welcome notification
            if (!localStorage.getItem("notifications")) {
              addNotification({
                type: "system",
                title: "Welcome to Zimbabwe Stablecoin",
                message: "Thank you for joining our platform. Start exploring our features!",
              })
            }

            resolve(true)
          } else {
            resolve(false)
          }
        } else {
          resolve(false)
        }
      }, 1000)
    })
  }

  const register = async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const defaultSettings = {
          language: "en",
          currency: "USD",
          dateFormat: "MM/DD/YYYY",
          theme: "system",
          accentColor: "#0ea5e9",
          notifications: {
            email: true,
            push: true,
            marketing: false,
          },
          security: {
            twoFactor: false,
            biometricLogin: true,
            autoLock: true,
          },
          display: {
            compactMode: false,
            largeText: false,
            reduceMotion: false,
          },
        }

        const defaultSession = {
          id: uuidv4(),
          device: "Chrome on Windows",
          location: "Harare, Zimbabwe",
          lastActive: new Date().toISOString(),
          current: true,
        }

        const newUser = {
          id: uuidv4(),
          ...userData,
          phone: "",
          address: "",
          bio: "New user on Zimbabwe Stablecoin platform.",
          avatar: "/placeholder.svg?height=128&width=128",
          joinDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          verificationStatus: "unverified",
          occupation: "",
          website: "",
          socialMedia: {
            twitter: "",
            linkedin: "",
            facebook: "",
          },
          settings: defaultSettings,
          sessions: [defaultSession],
        }

        // Store registered user
        localStorage.setItem("registeredUser", JSON.stringify(newUser))

        // Auto login after registration
        setUser(newUser)
        setIsAuthenticated(true)
        setBalance(0)
        setTransactions([])

        // Create default virtual card
        const defaultCard: Card = {
          id: uuidv4(),
          type: "virtual",
          number: "4539 **** **** 5271",
          fullNumber: "4539 7852 3641 5271",
          name: `${userData.firstName.toUpperCase()} ${userData.lastName.toUpperCase()}`,
          expiry: "09/27",
          cvv: "***",
          fullCvv: "123",
          balance: 0,
          limit: 2000,
          status: "active",
        }
        setCards([defaultCard])

        // Add welcome notification
        addNotification({
          type: "system",
          title: "Welcome to Zimbabwe Stablecoin",
          message: "Thank you for joining our platform. Start exploring our features!",
        })

        resolve(true)
      }, 1000)
    })
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
  }

  const logoutAllDevices = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (user) {
          const updatedUser = {
            ...user,
            sessions: user.sessions.map((session) => ({
              ...session,
              current: false,
            })),
          }
          setUser(updatedUser)
          setIsAuthenticated(false)
          addNotification({
            type: "security",
            title: "Logged Out From All Devices",
            message: "You have been logged out from all devices",
          })
          resolve(true)
        } else {
          resolve(false)
        }
      }, 1000)
    })
  }

  const addFunds = (amount: number) => {
    setBalance((prev) => prev + amount)

    // Update card balance
    if (cards.length > 0) {
      const virtualCard = cards.find((card) => card.type === "virtual")
      if (virtualCard) {
        updateCard(virtualCard.id, { balance: virtualCard.balance + amount })
      }
    }

    addTransaction({
      type: "add_funds",
      amount,
      description: "Added funds to wallet",
    })
  }

  const sendMoney = async (amount: number, recipient: string, note?: string): Promise<boolean> => {
    // Check if user has enough balance
    if (balance < amount) return false

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        setBalance((prev) => prev - amount)

        // Update card balance
        if (cards.length > 0) {
          const virtualCard = cards.find((card) => card.type === "virtual")
          if (virtualCard) {
            updateCard(virtualCard.id, { balance: virtualCard.balance - amount })
          }
        }

        addTransaction({
          type: "send",
          amount,
          to: recipient,
          description: note || `Sent to ${recipient}`,
        })

        resolve(true)
      }, 1000)
    })
  }

  const receiveMoney = async (amount: number, sender: string, note?: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        setBalance((prev) => prev + amount)

        // Update card balance
        if (cards.length > 0) {
          const virtualCard = cards.find((card) => card.type === "virtual")
          if (virtualCard) {
            updateCard(virtualCard.id, { balance: virtualCard.balance + amount })
          }
        }

        addTransaction({
          type: "receive",
          amount,
          from: sender,
          description: note || `Received from ${sender}`,
        })

        resolve(true)
      }, 1000)
    })
  }

  const convertCurrency = async (amount: number, from: string, to: string): Promise<boolean> => {
    // Check if user has enough balance
    if (from === "USD" && balance < amount) return false

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        if (from === "USD") {
          setBalance((prev) => prev - amount)

          // Update card balance
          if (cards.length > 0) {
            const virtualCard = cards.find((card) => card.type === "virtual")
            if (virtualCard) {
              updateCard(virtualCard.id, { balance: virtualCard.balance - amount })
            }
          }
        }

        addTransaction({
          type: "convert",
          amount,
          from,
          to,
          description: `Converted ${amount} ${from} to ${to}`,
        })

        resolve(true)
      }, 1000)
    })
  }

  const exportTransactions = () => {
    // Create CSV content
    const headers = ["ID", "Type", "Amount", "Date", "From", "To", "Status", "Description"]
    const csvRows = [headers]

    transactions.forEach((transaction) => {
      const row = [
        transaction.id,
        transaction.type,
        transaction.amount,
        new Date(transaction.date).toLocaleString(),
        transaction.from || "",
        transaction.to || "",
        transaction.status,
        transaction.description || "",
      ]
      csvRows.push(row)
    })

    // Convert to CSV string
    const csvContent = csvRows.map((row) => row.join(",")).join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `transactions_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    addNotification({
      type: "system",
      title: "Transactions Exported",
      message: "Your transactions have been exported successfully",
    })
  }

  const updateUserProfile = async (updates: Partial<User>): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (user) {
          const updatedUser = { ...user, ...updates }
          setUser(updatedUser)
          localStorage.setItem("registeredUser", JSON.stringify(updatedUser))

          addNotification({
            type: "system",
            title: "Profile Updated",
            message: "Your profile has been updated successfully",
          })

          resolve(true)
        } else {
          resolve(false)
        }
      }, 1000)
    })
  }

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, we would verify the current password
        // For demo purposes, we'll just simulate success
        addNotification({
          type: "security",
          title: "Password Changed",
          message: "Your password has been changed successfully",
        })
        resolve(true)
      }, 1000)
    })
  }

  const updateSecuritySettings = async (settings: Partial<User["settings"]["security"]>): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (user) {
          const updatedUser = {
            ...user,
            settings: {
              ...user.settings,
              security: {
                ...user.settings.security,
                ...settings,
              },
            },
          }
          setUser(updatedUser)
          localStorage.setItem("registeredUser", JSON.stringify(updatedUser))

          addNotification({
            type: "security",
            title: "Security Settings Updated",
            message: "Your security settings have been updated successfully",
          })

          resolve(true)
        } else {
          resolve(false)
        }
      }, 1000)
    })
  }

  const updateDisplaySettings = async (settings: Partial<User["settings"]["display"]>): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (user) {
          const updatedUser = {
            ...user,
            settings: {
              ...user.settings,
              display: {
                ...user.settings.display,
                ...settings,
              },
            },
          }
          setUser(updatedUser)
          localStorage.setItem("registeredUser", JSON.stringify(updatedUser))

          addNotification({
            type: "system",
            title: "Display Settings Updated",
            message: "Your display settings have been updated successfully",
          })

          resolve(true)
        } else {
          resolve(false)
        }
      }, 1000)
    })
  }

  const updateAccentColor = async (color: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (user) {
          const updatedUser = {
            ...user,
            settings: {
              ...user.settings,
              accentColor: color,
            },
          }
          setUser(updatedUser)
          localStorage.setItem("registeredUser", JSON.stringify(updatedUser))

          addNotification({
            type: "system",
            title: "Accent Color Updated",
            message: "Your accent color has been updated successfully",
          })

          resolve(true)
        } else {
          resolve(false)
        }
      }, 1000)
    })
  }

  const searchTransactions = (query: string): Transaction[] => {
    if (!query) return transactions

    const lowerCaseQuery = query.toLowerCase()
    return transactions.filter((transaction) => {
      return (
        transaction.type.includes(lowerCaseQuery) ||
        transaction.description?.toLowerCase().includes(lowerCaseQuery) ||
        transaction.from?.toLowerCase().includes(lowerCaseQuery) ||
        transaction.to?.toLowerCase().includes(lowerCaseQuery) ||
        transaction.amount.toString().includes(lowerCaseQuery) ||
        new Date(transaction.date).toLocaleString().toLowerCase().includes(lowerCaseQuery)
      )
    })
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        balance,
        setBalance,
        transactions,
        addTransaction,
        cards,
        addCard,
        updateCard,
        notifications,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        paymentRequests,
        createPaymentRequest,
        updatePaymentRequest,
        walletAddress,
        zwlRate,
        isAuthenticated,
        login,
        logout,
        logoutAllDevices,
        register,
        addFunds,
        sendMoney,
        receiveMoney,
        convertCurrency,
        exportTransactions,
        updateUserProfile,
        updatePassword,
        updateSecuritySettings,
        updateDisplaySettings,
        updateAccentColor,
        searchTransactions,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
