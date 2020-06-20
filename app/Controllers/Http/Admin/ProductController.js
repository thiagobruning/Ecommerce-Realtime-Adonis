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
    
  }

  async show ({ params: { id }, request, response }) {
  }

  async update ({ params: { id }, request, response }) {
  }

  async destroy ({ params: { id }, request, response }) {
  }
}

module.exports = ProductController
