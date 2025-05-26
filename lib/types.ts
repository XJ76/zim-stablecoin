export interface User {
  id: string
  email: string
  password: string // Hashed
  name: string
  createdAt: string
  updatedAt: string
}

export interface Wallet {
  id: string
  userId: string
  balance: number
  currency: string
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  fromUserId: string
  toUserId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  updatedAt: string
}

export interface Feedback {
  id: string
  userId: string
  type: 'bug' | 'feature' | 'support'
  title: string
  description: string
  status: 'open' | 'in-progress' | 'resolved'
  createdAt: string
  updatedAt: string
} 