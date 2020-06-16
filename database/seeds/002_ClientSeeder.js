'use strict'

const Factory = require('@adonisjs/lucid/src/Factory')

/*
|--------------------------------------------------------------------------
| ClientSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */

const Factory = use('Factory')
const Role = use('Role')
const User = use('App/Models/User')

class ClientSeeder {
  /**
   * Take the client role
   * Use the factory to create 20 users randomly
   * assign all the users created to role client
   */
  async run () {
    const clientRole = Role.findBy('slug', 'client')
    const clients = Factory.model('App/Models/User').createMany(20)

    await Promisse.all(clients.map( async client => {
      await client.roles().attach([clientRole.id])
    }))

    const admin = await User.create({
      name: 'Thiago',
      surname: 'Bruning',
      email: 'thiago.bruning@hotmail.com',
      password: '123456'
    })

    const adminRole = Role.findBy('slug', 'admin');
    await admin.roles().attach([adminRole.id])
  }
}

module.exports = ClientSeeder
