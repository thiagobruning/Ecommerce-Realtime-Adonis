'use strict'

const Database = use('Database')

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
    return await this.model.items().createMany(items, this.trx)
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
      item.fill(items.filter(n => n.id === item.id)[0])
      await item.save(this.trx)
    }))
  }

  /**
   * Check if the passed coupon can ble applied
   * in the order
   */
  async canApplyDiscount(coupon)
  {

    /**
     * Validate if discount has expired
     */

    const now = new Date().getTime()
    /**
     * if has intered in the validation period
     * if have a date to expires
     * if passed the time of expiration
     */
    if(now > coupon.valid_from.getTime() || (typeof coupon.valid_until == 'object' && coupon.valid_until.getTime() < now)) {
      return false
    }

    /**
     *  take the products with this coupon
     **/
    const couponProducts = await Database
      .from('coupon_product')
      .where('coupon_id', coupon.id)
      .pluck('product_id')

    /**
     * take the clients with this coupon
     */
    const couponClients = await Database
      .from('coupon_user')
      .where('coupon_id', coupon.id)
      .pluck('user_id')

    /**
     * check if the coupon is NOT associated to
     * products and clients especifcs
     */
    if(Array.isArray(couponProducts) && couponProducts < 1 && Array.isArray(couponClients) && couponClients < 1) {
      return true
    }

    let isAssociatedToProducts, isAssociatedToClients = false

    if(Array.isArray(couponProducts) && couponProducts.length > 0) {
      isAssociatedToProducts = true
    }

    if(Array.isArray(couponClients) && couponClients.length > 0) {
      isAssociatedToClients = true
    }

    const productsMatch = await Database
      .from('order_items')
      .where('order_id', this.model.id)
      .whereIn('product_id', couponProducts)
      .pluck('product_id')

    /** case 1 - the coupon is associeted
     * with clients and products
     */
    if(isAssociatedToClients && isAssociatedToProducts) {
      const clientMatch = couponClients.find(
        client => client === this.model.user_id
      )

      if(clientMatch && Array.isArray(productsMatch) && productsMatch.length > 0) {
        return true
      }
    }

    /** case 2 - the coupon is just associated
     * with product
     */
    if(isAssociatedToProducts && Array.isArray(productsMatch) && productsMatch.length > 0) {
      return true
    }

    /** case 3 - the coupon is just associated
     * with clients
     */
    if(isAssociatedToClients && Array.isArray(couponClients) && couponClients.length > 0) {
      const match = couponClients.find(client => client === this.model.user_id)

      if(match) {
        return true
      }
    }

    /** case 4 - coupon is not ready to be applied
     * in this order
     */
  }
}

module.exports = OrderService
