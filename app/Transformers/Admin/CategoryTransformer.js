'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const ImageTransformer = use('App/Transformers/Admin/ImageTransformer')

class CategoryTransformer extends BumblebeeTransformer {

  static get defaultInclude() {
    return ['image']
  }

  // optional includes
  availableInclude() {
    return ['posts']
  }

  transform (model) {
    return {
     id: model.id,
     title: model.title,
     description: model.description
    }
  }

  includeImage(model) {
    return this.item(model.getRelated('image'), ImageTransformer) // Take the relation name in the model
  }
}

module.exports = CategoryTransformer
