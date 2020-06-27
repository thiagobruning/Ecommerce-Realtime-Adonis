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

  get messages() {
    return {
      'items.exists': 'O item já existe no pedido!',
      'items.min': 'O pedido necessita de ao menos um item!'
    }
  }
}

module.exports = AdminStoreOrder
