'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Discount extends Model {

  /**
   * set table name for the model
   */
  static get table()
  {
    return 'coupon_order'
  }

  /**
   * Relationships
   */
  order()
  {
    return this.belongsTo('App/Models/Order', 'order_id', 'id')
  }

  coupon()
  {
    return this.belongsTo('App/Models/Coupon', 'coupon_id', 'id')
  }

}

module.exports = Discount
