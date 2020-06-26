'use strict'

class StoreCategory {
  get rules () {
    return {
      title: 'required',
      description: 'required|description'
    }
  }
}

module.exports = StoreCategory
