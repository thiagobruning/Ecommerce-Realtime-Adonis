'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Welcome to Adonis.js Ecommerce API!' }
})

Route.get('v1/me', 'UserController.me')
  .as('me')
  .middleware('auth')

Route.get('v1/admin/dashboard', 'Admin/DashboardController.index').as('dashboard')

/**
 * import routes
 */
require('./auth')
require('./admin')
require('./client')
