'use strict'

const OrderHook = exports = module.exports = {}

  /**
   * hook that update order price according to the items added
   */
  OrderHook.updateValues = async (model) => {

    /**
     * set subtotal sum of all items inside a order
     */
    model.$sideLoaded.subtotal = await model.items().getSum('subtotal')
    /**
     * set quantity of items inside a order
     */
    model.$sideLoaded.qty_items = await model.items().getSum('quantity')
    /**
     * set total discount
     */
    model.$sideLoaded.discount = await model.discounts().getSum('discount')
    /**
     * set total value for the order
     */
    model.$sideLoaded.total = model.$sideLoaded.subtotal - model.$sideLoaded.discount
  }

  /**
   * When paginate, take all items and update the values
   * to the list
   */
  OrderHook.updateCollectionValues = async models => {
    for (let model of models) {
      model = await OrderHook.updateValues(model)
    }
  }

