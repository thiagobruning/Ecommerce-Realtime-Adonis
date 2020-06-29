'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

class ImageTransformer extends BumblebeeTransformer {
  transform (image) {

    image = image.toJSON()
    return {
     id: image.id,
     url: image.url
    }
  }
}

module.exports = ImageTransformer
