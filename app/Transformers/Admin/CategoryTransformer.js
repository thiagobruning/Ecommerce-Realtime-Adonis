'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const ImageTransformer = use('App/Transformers/Admin/ImageTransformer')

class CategoryTransformer extends BumblebeeTransformer {

  static get defaultInclude() {
    return ['image']
  }

  // optional includes
  // availableInclude() {
  //   return ['posts']
  // }

  transform (category) {
    return {
     id: category.id,
     title: category.title,
     description: category.description
    }
  }

  includeImage(category) {
    return this.item(category.getRelated('image'), ImageTransformer) // Take the relation name in the model
  }
}

module.exports = CategoryTransformer
