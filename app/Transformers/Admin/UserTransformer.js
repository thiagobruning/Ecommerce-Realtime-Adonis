'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const ImageTransformer = use('App/Transformers/Admin/ImageTransformer')

class UserTransformer extends BumblebeeTransformer {

  static get defaultInclude() {
    return ['image']
  }

  transform (user) {
    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email
    }
  }

  includeImage(user) {
    return this.item(user.getRelated('image'), ImageTransformer)
  }
}

module.exports = UserTransformer
