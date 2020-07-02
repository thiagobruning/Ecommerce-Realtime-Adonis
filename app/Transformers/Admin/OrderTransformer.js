'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const UserTransformer = use('App/Transformers/Admin/UserTransformer')
const OrdemItemTransformer = use('App/Transformers/Admin/OrdemItemTransformer')
const CouponTransformer = use('App/Transformers/Admin/CouponTransformer')
const DiscountTransformer = use('App/Transformers/Admin/DiscountTransformer')

class OrderTransformer extends BumblebeeTransformer {

  static get availableInclude() {
    return ['user', 'coupons', 'items', 'discounts']
  }

  transform (order) {
    order = order.toJSON()
    return {
     id: order.id,
     status: order.status,
     total: order.total ? parseFloat(order.total.toFixed(2)) : 0,
     qty_items: order.__meta__ && order.__meta__.qty_items ? order.__meta__.qty_items : 0,
     date: order.created_at,
     // "__" uses to access hook data
     discount: order.__meta__ && order.__meta__.discount ? order.__meta__.discount : 0,
     subtotal: order.__meta__ && order.__meta__.subtotal ? order.__meta__.subtotal : 0

    }
  }

  includeUser(order) {
    return this.item(order.getRelated('user'), UserTransformer)
  }

  includeItems(order) {
    return this.collection(order.getRelated('items'), OrdemItemTransformer)
  }

  includeCoupons(order) {
    return this.collection(order.getRelated('coupons'), CouponTransformer)
  }

  includeDiscounts(order) {
    return this.collection(order.getRelated('discounts'), DiscountTransformer)
  }
}

module.exports = OrderTransformer
