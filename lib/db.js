const fs = require('fs').promises
const path = require('path')
const crypto = require('crypto')

const DB_PATH = path.join(process.cwd(), 'local_db')

const generateId = () => crypto.randomBytes(16).toString('hex')
const getTimestamp = () => new Date().toISOString()

const db = {
  async create(collection, data) {
    const id = generateId()
    const item = { ...data, id, createdAt: getTimestamp(), updatedAt: getTimestamp() }
    const filePath = path.join(DB_PATH, collection, `${id}.json`)
    await fs.writeFile(filePath, JSON.stringify(item, null, 2))
    return item
  },

  async read(collection, id) {
    try {
      const filePath = path.join(DB_PATH, collection, `${id}.json`)
      const data = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(data)
    } catch {
      return null
    }
  },

  async readAll(collection) {
    try {
      const dirPath = path.join(DB_PATH, collection)
      const files = await fs.readdir(dirPath)
      const items = await Promise.all(
        files.map(async (file) => {
          const data = await fs.readFile(path.join(dirPath, file), 'utf-8')
          return JSON.parse(data)
        })
      )
      return items
    } catch {
      return []
    }
  },

  async update(collection, id, data) {
    try {
      const filePath = path.join(DB_PATH, collection, `${id}.json`)
      const existing = await this.read(collection, id)
      if (!existing) return null
      const updated = { ...existing, ...data, updatedAt: getTimestamp() }
      await fs.writeFile(filePath, JSON.stringify(updated, null, 2))
      return updated
    } catch {
      return null
    }
  },

  async delete(collection, id) {
    try {
      const filePath = path.join(DB_PATH, collection, `${id}.json`)
      await fs.unlink(filePath)
      return true
    } catch {
      return false
    }
  },

  async findByField(collection, field, value) {
    const items = await this.readAll(collection)
    return items.find(item => item[field] === value) || null
  },

  async findAllByField(collection, field, value) {
    const items = await this.readAll(collection)
    return items.filter(item => item[field] === value)
  }
}

module.exports = db 