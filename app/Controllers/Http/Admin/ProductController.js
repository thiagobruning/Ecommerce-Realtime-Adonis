'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Product = use('App/Models/Product')

class ProductController {

  async index ({ request, response, pagination }) {
      const name = request.input('name')
      const query = Product.query()
      if(name) {
        query.where('name', 'LIKE', `%${name}%`)
      }

      /** default page and limit por page */
      const products = await query.paginate(pagination.page, pagination.limit)
      return response.send(products)
  }

  async store ({ request, response }) {
    try {
      const { name, image_id, description, price } = request.all()
      const product = await Product.create({ name, image_id, description, price })
      return response.status(201).send(product)
    } catch (error) {
      return response.status(400).send({
        message: 'Erro ao processar a sua solicitação.'
      })
    }
  }

  async show ({ params: { id }, response }) {
    const product = await Product.findOrFail(id)

    return response.send(product)
  }

  async update ({ params: { id }, request, response }) {
    const product = await Product.findOrFail(id)
    try {
      const { name, image_id, description, price } = request.all()
      product.merge({ name, image_id, description, price })
      await product.save()

      return response.send(product)
    } catch (error) {
      return response.status(400).send({
        message: 'Erro ao processar a sua solicitação.'
      })
    }
  }

  async destroy ({ params: { id }, response }) {
    const product = await Product.findOrFail(id)
    try {
      await product.delete()
      return response.status(204).send()
    } catch (error) {
      return response.status(500).send({
        message: 'Não foi possível deletar este produto.'
      })
    }
  }
}

module.exports = ProductController
