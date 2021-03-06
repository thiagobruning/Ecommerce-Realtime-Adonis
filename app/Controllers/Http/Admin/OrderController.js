'use strict'

const Order = use('App/Models/Order')
const Coupon = use('App/Models/Coupon')
const Discount = use('App/Models/Discount')
const Database = use('Database')
const Service = use('App/Services/Order/OrderService')
const transformer = use('App/Transformers/Admin/OrderTransformer')

class OrderController {

  async index ({ request, response, pagination, transform }) {
    const query = Order.query()
    const { status, id } = request.only(['status', 'id'])

    // do a search with status and id
    if(status && id) {
      query.where('status', status)
      query.orWhere('id', 'LIKE', `%${id}%`)
    }
    // search with just status
    else if(status && !id) {
      query.where('status', status)
    }
    //search with just id
    else if(id && !status) {
      query.orWhere('id', 'LIKE', `%${id}%`)
    }

    var orders = await query.paginate(pagination.page, pagination.limit)
    orders = await transform.paginate(orders, transformer)
    return response.send(orders)
  }

  async store ({ request, response, transform }) {
    const trx = await Database.beginTransaction()

    try {
      const { user_id, items, status } = request.all()
      var order = await Order.create({ user_id, status }, trx)
      const service = new Service(order, trx)

      if(items && items.length > 0) {
        await service.syncItems(items)
      }

      await trx.commit()

      order = await Order.find(order.id)
      order = await transform
        .include('user, items')
        .item(order, transformer)
      return response.status(201).send(order)

    } catch (error) {
      await trx.rollback()
      return response.status(400).send({
        message: 'Não foi possível criar este pedido no momento.'
      })
    }
  }

  async show ({ params: { id }, response, transform }) {
    var order = await Order.findOrFail(id)

    order = await transform
      .include('user', 'items', 'discounts')
      .item(order, transformer)
    return response.send(order)
  }

  async update ({ params: { id }, request, response, transform }) {
    var order = await Order.findOrFail(id)
    const trx = await Database.beginTransaction()

    try {
      const { user_id, items, status } = request.all()
      order.merge({ user_id, status })

      const service = new Service(order, trx)
      await service.updateItems(items)
      await order.save(trx)

      await trx.commit()
      order = await transform
        .include('users', 'items', 'discounts', 'coupons')
        .item(order, transformer)
      return response.send(order)
    } catch (error) {
      await trx.rollback()
      return response.status(400).send({
        message: 'Não foi possível atualizar este pedido.'
      })
    }
  }

  async destroy ({ params: { id }, request, response }) {
    const order = await Order.findOrFail(id)
    const trx = await Database.beginTransaction()

    try {
      await order.items().delete(trx)
      await order.coupons().delete(trx)
      await order.delete(trx)
      await trx.commit()

      return response.status(204).send()
    } catch (error) {
      await trx.rollback()

      return response.status(500).send({
        message: 'Não foi possível deletar este pedido.'
      })
    }
  }

  async applyDiscount({ params: { id }, request, response, transform }) {
    const { code } = request.all()
    var order = await Order.findOrFail(id)
    const coupon = await Coupon.findOrFail('code', code.toUpperCase())

    var discount, info = {}
    const service = new Service(order)
    try {
      const canAddDiscount = await service.canApplyDiscount(coupon)
      const orderDiscounts = await order.coupons().getCount()

      /** if have a coupon in this order ou se pode ser somado a outros descontos */
      const canApplyToOrder = orderDiscounts < 1 || (orderDiscounts >= 1 && coupon.recursive)
      if(canAddDiscount && canApplyToOrder) {
        discount = await Discount.findOrCreate({
          order_id: order.id,
          coupon_id: coupon.id
        })

        info.message = 'Cupom aplicado com sucesso!'
        info.success = true
      } else {
        info.message = 'Não foi possível aplicar este cupom.'
        info.success = false
      }

      order = await transform
        .include('users', 'items', 'discounts', 'coupons')
        .item(order, transformer)
      return response.send({order, info})
    } catch (error) {
      return response.status(400).send({
        message: 'Erro ao aplicar este cupom.'
      })
    }
  }

  async removeDiscount({request, response }) {
    const { discount_id } = request.all()
    const discount = await Discount.findOrFail(discount_id)
    await discount.delete()

    return response.status(204).send()
  }
}

module.exports = OrderController
