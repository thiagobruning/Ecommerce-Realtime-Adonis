'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const ImageTransformer = use('App/Transformers/Admin/ImageTransformer')

class ProductTransformer extends BumblebeeTransformer {

  defaultInclude() {
    return ['image']
  }

  transform (model) {
    return {
     id: model.id,
     name: model.name,
     description: model.description,
     price: model.price
    }
  }

  includeImage() {
    return this.item(model.getRelated('image'), ImageTransformer)
  }
}

module.exports = ProductTransformer
