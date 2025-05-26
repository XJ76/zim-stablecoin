import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Types
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

// Database paths
const DB_PATH = path.join(process.cwd(), 'local_db')
const USERS_PATH = path.join(DB_PATH, 'users')
const WALLETS_PATH = path.join(DB_PATH, 'wallets')
const TRANSACTIONS_PATH = path.join(DB_PATH, 'transactions')
const FEEDBACK_PATH = path.join(DB_PATH, 'feedback')

// Helper functions
const generateId = () => crypto.randomBytes(16).toString('hex')
const getTimestamp = () => new Date().toISOString()

// Generic CRUD operations
export const db = {
  // Create
  create: async (collection: string, data: any) => {
    const id = generateId()
    const item = {
      ...data,
      id,
      createdAt: getTimestamp(),
      updatedAt: getTimestamp(),
    }
    
    const filePath = path.join(DB_PATH, collection, `${id}.json`)
    await fs.promises.writeFile(filePath, JSON.stringify(item, null, 2))
    return item
  },

  // Read
  read: async (collection: string, id: string) => {
    try {
      const filePath = path.join(DB_PATH, collection, `${id}.json`)
      const data = await fs.promises.readFile(filePath, 'utf-8')
      return JSON.parse(data)
    } catch {
      return null
    }
  },

  // Read all
  readAll: async (collection: string) => {
    try {
      const dirPath = path.join(DB_PATH, collection)
      const files = await fs.promises.readdir(dirPath)
      const items = await Promise.all(
        files.map(async (file) => {
          const data = await fs.promises.readFile(path.join(dirPath, file), 'utf-8')
          return JSON.parse(data)
        })
      )
      return items
    } catch {
      return []
    }
  },

  // Update
  update: async (collection: string, id: string, data: any) => {
    try {
      const filePath = path.join(DB_PATH, collection, `${id}.json`)
      const existing = await db.read(collection, id)
      if (!existing) return null

      const updated = {
        ...existing,
        ...data,
        updatedAt: getTimestamp(),
      }

      await fs.promises.writeFile(filePath, JSON.stringify(updated, null, 2))
      return updated
    } catch {
      return null
    }
  },

  // Delete
  delete: async (collection: string, id: string) => {
    try {
      const filePath = path.join(DB_PATH, collection, `${id}.json`)
      await fs.promises.unlink(filePath)
      return true
    } catch {
      return false
    }
  },

  // Find by field
  findByField: async (collection: string, field: string, value: any) => {
    const items = await db.readAll(collection)
    return items.find(item => item[field] === value) || null
  },

  // Find all by field
  findAllByField: async (collection: string, field: string, value: any) => {
    const items = await db.readAll(collection)
    return items.filter(item => item[field] === value)
  }
}

// User-specific operations
export const userDb = {
  create: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
    return db.create<User>('users', data)
  },
  findByEmail: async (email: string): Promise<User | null> => {
    return db.findByField<User>('users', 'email', email)
  },
  findById: async (id: string): Promise<User | null> => {
    return db.read<User>('users', id)
  },
  update: async (id: string, data: Partial<User>): Promise<User | null> => {
    return db.update<User>('users', id, data)
  },
  delete: async (id: string): Promise<boolean> => {
    return db.delete('users', id)
  },
}

// Wallet-specific operations
export const walletDb = {
  create: async (data: Omit<Wallet, 'id' | 'createdAt' | 'updatedAt'>): Promise<Wallet> => {
    return db.create<Wallet>('wallets', data)
  },
  findByUserId: async (userId: string): Promise<Wallet | null> => {
    return db.findByField<Wallet>('wallets', 'userId', userId)
  },
  update: async (id: string, data: Partial<Wallet>): Promise<Wallet | null> => {
    return db.update<Wallet>('wallets', id, data)
  },
}

// Transaction-specific operations
export const transactionDb = {
  create: async (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> => {
    return db.create<Transaction>('transactions', data)
  },
  findByUserId: async (userId: string): Promise<Transaction[]> => {
    const sent = await db.findAllByField<Transaction>('transactions', 'fromUserId', userId)
    const received = await db.findAllByField<Transaction>('transactions', 'toUserId', userId)
    return [...sent, ...received].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },
  update: async (id: string, data: Partial<Transaction>): Promise<Transaction | null> => {
    return db.update<Transaction>('transactions', id, data)
  },
}

// Feedback-specific operations
export const feedbackDb = {
  create: async (data: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>): Promise<Feedback> => {
    return db.create<Feedback>('feedback', data)
  },
  findByUserId: async (userId: string): Promise<Feedback[]> => {
    return db.findAllByField<Feedback>('feedback', 'userId', userId)
  },
  update: async (id: string, data: Partial<Feedback>): Promise<Feedback | null> => {
    return db.update<Feedback>('feedback', id, data)
  },
  delete: async (id: string): Promise<boolean> => {
    return db.delete('feedback', id)
  },
} 