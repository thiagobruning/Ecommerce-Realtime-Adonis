'use strict'

const Route = use('Route')

Route.group(() => {
  Route.get('products', 'ProductController.index')
  Route.get('products/:id', 'ProductController.show')

  Route.resource('orders', 'OrderController').apiOnly().except('destroy')
}).prefix('v1')
  .namespace('Client')
