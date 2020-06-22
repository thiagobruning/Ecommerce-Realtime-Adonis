'use strict'

const User = use('App/Models/User')

class UserController {

  async index ({ request, response, pagination }) {
    const name = request.input('name')
    const query = User.query()

    /** also use surname and email to search */
    if(name) {
      query.where('name', 'LIKE', `%${name}%`)
      query.orWhere('surname', 'LIKE', `%${name}%`)
      query.orWhere('email', 'LIKE', `%${name}%`)
    }

    const users = await query.paginate(pagination.page, pagination.limit)
    return response.send(users)
  }

  async store ({ request, response }) {
    try {
      const userData = request.only(['name', 'surname', 'email', 'password', 'image_id'])
      const user = await User.create(userData)
      return response.status(201).send(user)
    } catch (error) {
      return response.status(400).send({
        message: 'Erro ao processar a sua solicitação.'
      })
    }
  }

  async show ({ params: { id }, response }) {
    const user = await User.findOrFail(id)

    return response.send(user)
  }

  async update ({ params: { id }, request, response }) {
    const user = await User.findOrFail(id)
    try {
      const userData = request.only(['name', 'surname', 'email', 'password', 'image_id'])
      user.merge(userData)
      await user.save()

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
