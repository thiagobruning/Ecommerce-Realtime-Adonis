/**
 * Auth routes
 */

 'use strict'

const Route = use('Route')

Route.group( () =>{
  Route.post('register', 'AuthController.register').as('auth.register')
  Route.post('login', 'AuthController.login').as('auth.login')
  Route.post('refresh', 'AuthController.refresh').as('auth.refresh')
  Route.post('logout', 'AuthController.logout').as('auth.logout')

  /** receive email and generate token */
  Route.post('reset-password', 'AuthController.forgotPassword').as('auth.forgot')

  /** check if token is valid */
  Route.get('reset-password', 'AuthController.remember').as('auth.remember')

  /** receive new password and update the password */
  Route.put('reset-password', 'AuthController.reset').as('auth.reset')

}).prefix('v1/auth')
  .namespace('Auth') // namespace = folder of group
