'use strict'

class StoreCategory {
  get rules () {
    return {
      title: 'required',
      description: 'required|description'
    }
  }

  get messages() {
    return {
      'title.required': 'O título é obrigatório!',
      'description.required': 'A descrição é obrigatória!',
      'description.description': 'Descrição inválida!'
    }
  }
}

module.exports = StoreCategory
