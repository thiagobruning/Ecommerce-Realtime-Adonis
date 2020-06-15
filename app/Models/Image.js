'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Env = use('Env')

class Image extends Model {

  /**
   * call the computed property every time use toJSON()
   */
  static get computed()
  {
    return ['url']
  }

  /**
   * computed property to set the path to the image.
   * always take the APP_URL(saving in the server host)
   */
  getUrl({ path })
  {
    return `${Env.get('APP_URL')}/images/${path}`
  }

}

module.exports = Image
