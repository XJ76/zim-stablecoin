const db = require('./db')

const walletDb = {
  async create(userId) {
    const existingWallet = await db.findByField('wallets', 'userId', userId)
    if (existingWallet) {
      throw new Error('Wallet already exists')
    }

    return db.create('wallets', {
      userId,
      balance: 0,
      currency: 'USD'
    })
  },

  async findByUserId(userId) {
    return db.findByField('wallets', 'userId', userId)
  },

  async update(id, data) {
    return db.update('wallets', id, data)
  },

  async updateBalance(id, amount) {
    const wallet = await db.read('wallets', id)
    if (!wallet) return null

    const newBalance = wallet.balance + amount
    if (newBalance < 0) {
      throw new Error('Insufficient funds')
    }

    return db.update('wallets', id, { balance: newBalance })
  },

  async transfer(fromWalletId, toWalletId, amount) {
    const fromWallet = await db.read('wallets', fromWalletId)
    const toWallet = await db.read('wallets', toWalletId)

    if (!fromWallet || !toWallet) {
      throw new Error('Wallet not found')
    }

    if (fromWallet.balance < amount) {
      throw new Error('Insufficient funds')
    }

    // Create transaction record
    await db.create('transactions', {
      fromUserId: fromWallet.userId,
      toUserId: toWallet.userId,
      amount,
      currency: fromWallet.currency,
      status: 'pending'
    })

    // Update balances
    await this.updateBalance(fromWalletId, -amount)
    await this.updateBalance(toWalletId, amount)

    return true
  }
}

module.exports = walletDb 