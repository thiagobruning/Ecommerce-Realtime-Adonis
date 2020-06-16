'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OrderItem extends Model {

  static boot() {
    super.boot()

    this.addHook('beforeSave', 'OrderItemHook.updateSubtotal')
  }

  /**
   * use this trait to models that does not have timestamp
   */
  static get traits()
  {
    return ['App/Models/Traits/NoTimestamp']
  }

  /**
   * Relationships
   */
  product()
  {
    return this.belongsTo('App/Models/Product')
  }

  order()
  {
    return this.belongsTo('App/Models/Order')
  }
}

module.exports = OrderItem
