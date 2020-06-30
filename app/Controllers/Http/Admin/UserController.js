'use strict'

const User = use('App/Models/User')
const transformer = use('App/Transformers/Admin/UserTransformer')

class UserController {

  async index ({ request, response, pagination, transform }) {
    const name = request.input('name')
    const query = User.query()

    /** also use surname and email to search */
    if(name) {
      query.where('name', 'LIKE', `%${name}%`)
      query.orWhere('surname', 'LIKE', `%${name}%`)
      query.orWhere('email', 'LIKE', `%${name}%`)
    }

    var users = await query.paginate(pagination.page, pagination.limit)
    users = await transform.paginate(users, transformer)
    return response.send(users)
  }

  async store ({ request, response, transform }) {
    try {
      const userData = request.only(['name', 'surname', 'email', 'password', 'image_id'])
      var user = await User.create(userData)
      user = await user.item(user, transformer)
      return response.status(201).send(user)
    } catch (error) {
      return response.status(400).send({
        message: 'Erro ao processar a sua solicitação.'
      })
    }
  }

  async show ({ params: { id }, response, transform}) {
    var user = await User.findOrFail(id)
    user = await transform.item(user, transformer)
    return response.send(user)
  }

  async update ({ params: { id }, request, response, transform }) {
    var user = await User.findOrFail(id)
    try {
      const userData = request.only(['name', 'surname', 'email', 'password', 'image_id'])
      user.merge(userData)
      await user.save()

      user = await transform.item(user, transformer)
      return response.send(user)
    } catch (error) {
      return response.status(400).send({
        message: 'Erro ao processar a sua solicitação.'
      })
    }
  }

  async destroy ({ params: { id }, request, response }) {
    const user = await User.findOrFail(id)
    try {
      await user.delete()
      return response.status(204).send()
    } catch (error) {
      return response.status(500).send({
        message: 'Não foi possível deletar este usuário'
      })
    }
  }
}

module.exports = UserController
