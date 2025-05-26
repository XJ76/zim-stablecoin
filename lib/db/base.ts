import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'local_db')

export const generateId = () => crypto.randomBytes(16).toString('hex')
export const getTimestamp = () => new Date().toISOString()

export const db = {
  create: async <T extends { id: string }>(collection: string, data: Omit<T, 'id'>): Promise<T> => {
    const id = generateId()
    const timestamp = getTimestamp()
    const newItem = {
      ...data,
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
    } as T

    const filePath = path.join(DB_PATH, collection, `${id}.json`)
    await fs.promises.writeFile(filePath, JSON.stringify(newItem, null, 2))
    return newItem
  },

  read: async <T>(collection: string, id: string): Promise<T | null> => {
    try {
      const filePath = path.join(DB_PATH, collection, `${id}.json`)
      const data = await fs.promises.readFile(filePath, 'utf-8')
      return JSON.parse(data) as T
    } catch (error) {
      return null
    }
  },

  readAll: async <T>(collection: string): Promise<T[]> => {
    try {
      const dirPath = path.join(DB_PATH, collection)
      const files = await fs.promises.readdir(dirPath)
      const items = await Promise.all(
        files.map(async (file) => {
          const data = await fs.promises.readFile(path.join(dirPath, file), 'utf-8')
          return JSON.parse(data) as T
        })
      )
      return items
    } catch (error) {
      return []
    }
  },

  update: async <T extends { id: string }>(collection: string, id: string, data: Partial<T>): Promise<T | null> => {
    try {
      const filePath = path.join(DB_PATH, collection, `${id}.json`)
      const existing = await db.read<T>(collection, id)
      if (!existing) return null

      const updated = {
        ...existing,
        ...data,
        updatedAt: getTimestamp(),
      }

      await fs.promises.writeFile(filePath, JSON.stringify(updated, null, 2))
      return updated
    } catch (error) {
      return null
    }
  },

  delete: async (collection: string, id: string): Promise<boolean> => {
    try {
      const filePath = path.join(DB_PATH, collection, `${id}.json`)
      await fs.promises.unlink(filePath)
      return true
    } catch (error) {
      return false
    }
  },

  findByField: async <T>(collection: string, field: keyof T, value: any): Promise<T | null> => {
    const items = await db.readAll<T>(collection)
    return items.find((item) => item[field] === value) || null
  },

  findAllByField: async <T>(collection: string, field: keyof T, value: any): Promise<T[]> => {
    const items = await db.readAll<T>(collection)
    return items.filter((item) => item[field] === value)
  },
} 