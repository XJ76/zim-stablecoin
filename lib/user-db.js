const db = require('./db')
const crypto = require('crypto')

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex')
}

const userDb = {
  async create({ email, password, name }) {
    const existingUser = await db.findByField('users', 'email', email)
    if (existingUser) {
      throw new Error('User already exists')
    }

    return db.create('users', {
      email,
      password: hashPassword(password),
      name
    })
  },

  async findByEmail(email) {
    return db.findByField('users', 'email', email)
  },

  async findById(id) {
    return db.read('users', id)
  },

  async update(id, data) {
    if (data.password) {
      data.password = hashPassword(data.password)
    }
    return db.update('users', id, data)
  },

  async delete(id) {
    return db.delete('users', id)
  },

  async verifyPassword(email, password) {
    const user = await this.findByEmail(email)
    if (!user) return false
    return user.password === hashPassword(password)
  }
}

module.exports = userDb 