'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Order extends Model {

  /**
   * Relationships
   */
  items()
  {
    return this.hasMany('App/Models/OrderItem')
  }

  coupons()
  {
    return this.hasMany('App/Models/Coupons')
  }

  discounts()
  {
    return this.hasMany('App/Models/Discount')
  }

  user()
  {
    return this.belongsTo('App/Models/user', 'user_id', 'id')
  }
}

module.exports = Order
