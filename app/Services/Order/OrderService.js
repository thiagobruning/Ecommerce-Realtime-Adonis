'use strict'

class OrderService {
  constructor(model, trx = null) {
    this.model = model
    this.trx = trx
  }

  // delete all items before sync
  async syncItems(items)
  {
    if(!Array.isArray(items)) {
      return false
    }

    await this.model.items().delete(this.trx)
    await this.model.createMany(items, this.trx)
  }

  async updateItems(items) {
    // catch the current items into order
    let currentItems = await this.model
      .items()
      .whereIn('id', items.map(item => item.id))
      .fetch()

    // delete items that the user dont want more
    await this.model
      .items()
      .whereNotIn('id', items.map(item => item.id))
      .delete(this.trx)

    // update the items inside a order
    await Promise.all(currentItems.rows.map( async item => {
      item.fill(items.find(n => n.id === item.id))
      await item.save(this.trx)
    }))
  }
}

module.exports = OrderService
