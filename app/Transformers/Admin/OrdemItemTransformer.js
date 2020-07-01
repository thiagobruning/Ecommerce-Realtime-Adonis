'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const ProductTransformer = use('App/Transformers/Admin/ProductTransformer')

class OrdemItemTransformer extends BumblebeeTransformer {

  static get defaultInclude() {
    return ['product']
  }

  transform (item) {
    return {
      id: item.id,
      subtotal: item.subtotal,
      quantity: item.quantity
    }
  }

  includeProduct(item) {
    return this.item(item.getRelated('product'), ProductTransformer)
  }
}

module.exports = OrdemItemTransformer
