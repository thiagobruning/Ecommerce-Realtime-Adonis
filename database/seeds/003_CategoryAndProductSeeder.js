'use strict'

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class CategoryAndProductSeeder {
  async run () {
    /**
     * Create 10 categories
     */
    const categories = await Factory.model('App/Models/Category').createMany(10)

    /** for each category, create 5 products */
    await Promise.all(categories.map( async category => {
      const products = await Factory.model('App/Models/Product').createMany(5)

      /** the 5 products are assigned to the category created above */
      await Promise.all(products.map( async product =>{
        await product.categories().attach([category.id])
      }))
    }))
  }
}

module.exports = CategoryAndProductSeeder
