/**
 * Auth routes
 */

 'use strict'

const Route = use('Route')

Route.group( () =>{
  Route.post('register', 'AuthController.register')
    .as('auth.register')
    .middleware(['guest'])
    .validator(['Auth/Register'])

  Route.post('login', 'AuthController.login')
    .as('auth.login')
    .middleware(['guest'])
    .validator(['Auth/Login'])

  Route.post('refresh', 'AuthController.refresh')
    .as('auth.refresh')
    .middleware(['guest'])

  Route.post('logout', 'AuthController.logout')
    .as('auth.logout')
    .middleware(['auth'])

  /** receive email and generate token */
  Route.post('reset-password', 'AuthController.forgotPassword')
    .as('auth.forgot')
    .middleware(['guest'])

  /** check if token is valid */
  Route.get('reset-password', 'AuthController.remember')
    .as('auth.remember')
    .middleware(['guest'])

  /** receive new password and update the password */
  Route.put('reset-password', 'AuthController.reset')
    .as('auth.reset')
    .middleware(['guest'])

}).prefix('v1/auth')
  .namespace('Auth') // namespace = folder of group
