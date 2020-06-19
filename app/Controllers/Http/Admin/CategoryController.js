'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Category = use('App/Models/Category')

class CategoryController {

  async index ({ request, response, pagination }) {

    /**
     * Get title property and add a query
     * to find categories by title
     */
    const title = request.input('title')
    const query = Category.query()
    if(title) {
      query.where('title', 'LIKE', `%${title}%`)
    }

    /** default page and limit por page */
    const categories = await query.paginate(pagination.page, pagination.limit)
    return response.send(categories)
  }

  async store ({ request, response }) {
  }

  async show ({ params, request, response, view }) {
  }

  /**
   * Update category details.
   * PUT or PATCH categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a category with id.
   * DELETE categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = CategoryController
