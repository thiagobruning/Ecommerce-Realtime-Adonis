'use strict'

const Factory = use('Factory')

  /**
   * User factory
   */
  Factory.blueprint('App/Models/User', (faker) => {
    return {
      name: faker.first(),
      surname: faker.last(),
      email: faker.email({ domain: 'example.com' }),
      password: '123456'
    }
  })

  /**
  * Category factory
  */
  Factory.blueprint('App/Models/Category', faker => {
    return {
      title: faker.country({ full:true }),
      description: faker.sentence()
    }
  })

  /**
  * Product factory
  */
  Factory.blueprint('App/Models/Product', faker => {
    return {
      name: faker.animal(),
      description: faker.sentence(),
      price: faker.floating({ min: 0, max: 1000, fixed: 2 })
    }
  })
