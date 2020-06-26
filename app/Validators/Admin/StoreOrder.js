'use strict'

class AdminStoreOrder {
  get rules () {
    return {
      /**
       * For each item, check if already exists the product
       */
      'items.*.product_id': 'exists:products, id',
      'items.*.quantity': 'min:1'
    }
  }
}

module.exports = AdminStoreOrder
