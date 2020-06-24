'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Coupon = use('App/Models/Coupon')
const Database = use('Database')
const Service = use('App/Services/Coupon/CouponService')

class CouponController {

  async index ({ response, pagination }) {
    const code = request.input('code')
    const query = Coupon.query()

    if(code) {
      query.where('code', 'LIKE', `%${code}%`)
    }

    const coupons = await query.paginate(pagination.page, pagination.limit)
    return response.send(coupons)
  }

  async store ({ request, response }) {
    /**
     * 1 - products - Can be used in specifics products
     * 2 - clients - can be used by specifics clientes
     * 3 - can be used in any order
     */

     const trx = await Database.beginTransaction()
     var can_use_for = {
       product: false,
       client: false
     }

     try {
       const couponData = request.only([
         'code',
         'discount',
         'valid_from',
         'valid_until',
         'quantity',
         'type'
        ])

      const { users, products } = request.only([ 'users', 'products' ])
      const coupon = await Coupon.create(couponData, trx)
      const service = new Service(coupon, trx)

      // if coupon is to especifc users
      if(users && users.length > 0) {
        await service.syncUsers(users)
        can_use_for.client = true
      }

      // if coupon is to especifc products
      if(products && products.length > 0) {
        await service.syncProducts(products)
        can_use_for.product = true
      }

      // set value in database according
      if(can_use_for.product && can_use_for.client) {
        coupon.can_use_for = 'product_client'
      } else if(can_use_for.product && !can_use_for.client) {
        coupon.can_use_for = 'product'
      } else if(!can_use_for.product && can_use_for.client) {
        coupon.can_use_for = 'client'
      } else {
        coupon.can_use_for = 'all'
      }

      await coupon.save(trx)
      await trx.commit()

      return response.status(201).send(coupon)

     } catch (error) {
      await trx.rollback()
      return response.status(400).send({
        message: 'Não foi possível criar o cupom no momento.'
      })
     }
  }

  async show ({ params: { id }, response }) {
    const coupon = await Coupon.findOrFail(id)

    return response.send(coupon)
  }

  async update ({ params: { id }, request, response }) {
    var coupon = await Coupon.findOrFail(id)
    const trx = await Database.beginTransaction()

    var can_use_for = {
      product: false,
      client: false
    }

    try {
      const couponData = request.only([
        'code',
        'discount',
        'valid_from',
        'valid_until',
        'quantity',
        'type'
      ])

      coupon.merge(couponData)

      const { users, products } = request.only([ 'users', 'products' ])
      const service = new Service(coupon, trx)

       // if coupon is to especifc users
      if(users && users.length > 0) {
        await service.syncUsers(users)
        can_use_for.client = true
      }

      // if coupon is to especifc products
      if(products && products.length > 0) {
        await service.syncProducts(products)
        can_use_for.product = true
      }

      // set value in database according
      if(can_use_for.product && can_use_for.client) {
        coupon.can_use_for = 'product_client'
      } else if(can_use_for.product && !can_use_for.client) {
        coupon.can_use_for = 'product'
      } else if(!can_use_for.product && can_use_for.client) {
        coupon.can_use_for = 'client'
      } else {
        coupon.can_use_for = 'all'
      }

      await coupon.save(trx)
      await trx.commit()

      return response.status(200).send(coupon)

    } catch (error) {
      await trx.rollback()
      return response.status(400).send({
        message: 'Não foi possível atualizar este cupom no momento.'
      })
    }
  }

  async destroy ({ params: { id }, response }) {
    const coupon = await Coupon.findOrFail(id)
    const trx = await Database.beginTransaction()

    try {
      /** Detach all relationships before delete the coupon
       * to avoid orphan data
       */
      await coupon.products.detach([], trx)
      await coupon.orders.detach([], trx)
      await coupon.users.detach([], trx)

      await coupon.delete(trx)
      await trx.commit()
      return response.status(204).send()
    } catch (error) {
      await trx.rollback()
      return response.status(500).send({
        message: 'Não foi possível deletar este cupom'
      })
    }
  }
}

module.exports = CouponController
