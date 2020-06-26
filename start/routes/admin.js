'use strict'

const { route } = require("@adonisjs/framework/src/Route/Manager")

const Route = use('Route')
/**
 * Routes with admin permissions
 */
Route.group(() => {
  Route.resource('categories', 'CategoryController')
    .apiOnly()
    .validator(new Map([
      [['categories.store'], ['Admin/StoreCategory']],
      [['categories.update'], ['Admin/StoreCategory']]
    ]))

  Route.resource('products', 'ProductController')
    .apiOnly()

  Route.resource('coupons', 'CouponController')
    .apiOnly()

  Route.post('orders/:id/discount', 'OrderController.applyDiscount')
  Route.delete('orders/:id/discount', 'OrderController.removeDiscount')

  Route.resource('orders', 'OrderController')
    .apiOnly()
    .validator(new Map([
      [['orders.store'], ['Admin/StoreOrder']]
    ]))

  Route.resource('images', 'ImageController')
    .apiOnly()

  Route.resource('users', 'UserController')
  .apiOnly()

}).prefix('v1/admin')
  .namespace('Admin') // Admin folder
  .middleware(['auth', 'is: (admin || manager)'])
