'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Category = use('App/Models/Category')
const transformer = use('App/Transformers/Admin/CategoryTransformer')

class CategoryController {

  async index ({ request, response, transform ,pagination }) {

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
    var categories = await query.paginate(pagination.page, pagination.limit)
    categories = await transform.paginate(categories, transformer)
    return response.send(categories)
  }

  async store ({ request, transform, response }) {
    try {
      const { title, description, image_id } = request.all()
      var category = await Category.create({ title, description, image_id })
      category = await transform.item(category, transformer)

      return response.status(201).send(category)
    } catch (error) {
      return response.status(400).send({
        message: 'Erro ao processar a sua solicitação.'
      })
    }
  }

  async show ({ params: { id }, response, transform }) {
    var category = await Category.findOrFail(id)
    category = await transform.item(category, transformer)
    return response.send(category)
  }

  async update ({ params: { id },transform, request, response }) {
    var category = await Category.findOrFail(id)
    try {
      const { title, description, image_id } = request.all()
      category.merge({ title, description, image_id })
      await category.save()
      category = await transform.item(category, transformer)
      return response.send(category)
    } catch (error) {
      return response.status(400).send({
        message: 'Erro ao processar a sua solicitação.'
      })
    }
  }

  async destroy ({ params: { id }, response }) {
    const category = await Category.findOrFail(id)
    try {
      await category.delete()
      return response.status(204).send()
    } catch (error) {
      return response.status(500).send('Não foi possível deletar esta categoria.')
    }
  }
}

module.exports = CategoryController
