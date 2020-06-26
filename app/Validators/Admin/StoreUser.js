'use strict'

class AdminStoreUser {
  get rules () {

    let userId = this.ctx.params.id
    let rule = ''
    /**
     * if passed id on the url, user is updating
     */
    if(userId) {
      rule = `unique:users,email,id,${userId}`
    } else {
      rule = 'unique:users,email|required'
    }

    return {
      rule,
      image_id: 'exists:images,id'
    }
  }
}

module.exports = AdminStoreUser
