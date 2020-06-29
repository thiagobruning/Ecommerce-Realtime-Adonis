'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Product = use('App/Models/Product')
const transformer = use('App/Transformers/Admin/ProductTransformer')

class ProductController {

  async index ({ request, response, pagination, transform }) {
      const name = request.input('name')
      const query = Product.query()
      if(name) {
        query.where('name', 'LIKE', `%${name}%`)
      }

      /** default page and limit por page */
      var products = await query.paginate(pagination.page, pagination.limit)
      products = await transform.paginate(products, transformer)
      return response.send(products)
  }

  async store ({ request, response, transform }) {
    const { name, image_id, description, price } = request.all()
    try {
      var product = await Product.create({ name, image_id, description, price })
      product = await transform.item(product, transformer)
      return response.status(201).send(product)
    } catch (error) {
      return response.status(400).send({
        message: 'Erro ao processar a sua solicitação.'
      })
    }
  }

  async show ({ params: { id }, response, transform }) {
    var product = await Product.findOrFail(id)
    product = await transform.item(product, transformer)

    return response.send(product)
  }

  async update ({ params: { id }, request, response, transform }) {
    var product = await Product.findOrFail(id)
    try {
      const { name, image_id, description, price } = request.all()
      product.merge({ name, image_id, description, price })
      await product.save()
      product = await transform.item(product, transformer)

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
