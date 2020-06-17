'use strict'
const Database = use('Database')
const User = use('App/Models/User')
const Role = use('Role')

class AuthController {

    /**
     * Using transactions to avoid errors in database, and rollback the request
     * when occur a error
     */
  async register({ request, response })
  {
    const trx = await Database.beginTransaction()

    try {
      const { name, surname, email, password } = request.all()
      const user = await User.create({ name, surname, email, password }, trx)
      const clientRole = await Role.findBy('slug', 'client')
      await user.roles().attach([clientRole.id], null, trx)
      await trx.commit()

      return response.status(201).send({ data: user })
    } catch (error) {
      await trx.rollback()
      return response.status(400).send({ message: 'Erro ao realizar cadastro.' })
    }
  }

  async login({ auth, request, response })
  {
    const { email, password } = request.all()
    let data = await auth.withRefreshToken().attempt(email, password)

    return response.send({ data })
  }

  /** Refresh token */
  async refresh({ request, response })
  {
    //
  }

  async logout({ auth, request, response })
  {
    //
  }

  /** Refresh password methods */

  async forgotPassword({ request, response })
  {
    //
  }

  async remember({ request, response })
  {
    //
  }

  async reset({ request, response })
  {
    //
  }
}

module.exports = AuthController
