'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static boot() {
    super.boot();

    this.addHook("beforeSave", async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });
  }

  /**
   * ACL Roles traits
   */
  static get traits() {
    return [
      "@provider:Adonis/Acl/HasRole",
      "@provider:Adonis/Acl/HasPermission",
    ];
  }

  /**
   * hide on list from database
   */
  static get hidden()
  {
    return ['password']
  }

  tokens() {
    return this.hasMany("App/Models/Token");
  }

  /**
   * Relationships
   */
  image()
  {
    return this.belongsTo('App/Models/Image')
  }

  coupons()
  {
    return this.belongsToMany('App/Models/Coupon')
  }
}

module.exports = User
