'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

class ImageTransformer extends BumblebeeTransformer {
  transform (image) {

    image = image.toJSON()
    return {
     id: image.id,
     url: image.url,
     size: image.size,
     original_name: image.original_name,
     extension: image.extension
    }
  }
}

module.exports = ImageTransformer
