'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Image = use('App/Models/Image')
const {manage_single_upload, manage_multiple_uploads} = use('App/Helpers')
const Helpers = use('Helpers')
const fs = use('fs')

class ImageController {

  async index ({ response, pagination }) {
    const images = await Image.query()
      .orderBy('id', 'DESC')
      .paginate(pagination.page, pagination.limit)

    return response.send(images)
  }

  async store ({ request, response }) {
    try {
      /** validate the file */
      const fileJar = request.file('images', {
        types: ['image'],
        size: '5mb'
      })

      let images = []

      // if not have multiple files
      if(!fileJar.files) {
        let file = await manage_single_upload(fileJar)
        if(file.moved()) {
          const image = await Image.create({
            path: file.filename,
            size: file.size,
            original_name: file.client_name,
            extension: file.subtype
           })

           images.push(image)

           return response.status(201).send({ successes: images, errors: {} })
        } else {
          return response.status(400).send({
            message: 'Não foi possível fazer upload deste arquivo.'
          })
        }
      }

      // if have multiple files
      let files = await manage_multiple_uploads(fileJar)

      await Promise.all(files.successes.map(async file => {
        const image = await Image.create({
          path: file.filename,
          size: file.size,
          original_name: file.client_name,
          extension: file.subtype
         })

         images.push(image)

      }))

      return response.status(201).send({ successes: images, errors: files.errors })

    } catch (error) {
      return response.status(400).send({
        message: 'Não foi possível processar sua solicitação.'
      })
    }
  }

  async show ({ params: { id }, response }) {
    const image = await Image.findOrFail(id)

    return response.send(image)
  }

  async update ({ params: { id }, request, response }) {
    const image = await Image.findOrFail(id)
    try {
      image.merge(request.only(['original_name']))
      await image.save()

      return response.status(200).send(image)
    } catch (error) {
      return response.status(400).send({
        message: 'Não foi possível processar sua solicitação.'
      })
    }

  }

  async destroy ({ params: { id }, request, response }) {
    const image = await Image.findOrFail(id)
    try {
      let filepath = Helpers.publicPath(`uploads/${image.path}`)

      await fs.unlinkSync(filepath)
      await image.delete()

      return response.status(204).send()
    } catch (error) {
      return response.stauts(500).send({
        message: 'Não foi possível apagar esta imagem.'
      })
    }
  }
}

module.exports = ImageController
