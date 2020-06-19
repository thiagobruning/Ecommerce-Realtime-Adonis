'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Middleware that crate a new instance inside
 * context to inject in index methods to paginate
 */

class Pagination {
  async handle (ctx, next) {
    if(ctx.request.method() == 'GET') {
      const page = parseInt(ctx.request.input('page'))
      const limit = parseInt(ctx.request.input('limit'))
      const perpage = parseInt(ctx.request.input('perpage'))
      ctx.pagination = { page, limit }

      if(perpage) {
        ctx.pagination.limit = perpage
      }
    }
    await next()
  }
}

module.exports = Pagination
