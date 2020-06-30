'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const ImageTransformer = use('App/Transformers/Admin/ImageTransformer')

class ProductTransformer extends BumblebeeTransformer {

  static get defaultInclude() {
    return ['image']
  }

  transform (product) {
    return {
     id: product.id,
     name: product.name,
     description: product.description,
     price: product.price
    }
  }

  includeImage(product) {
    return this.item(product.getRelated('image'), ImageTransformer)
  }
}

module.exports = ProductTransformer
