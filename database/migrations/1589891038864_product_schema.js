'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
  up () {
    this.create('products', (table) => {
      table.increments()
      table.string('name', 200)
      table.integer('image_id').unsigned()
      table.text('description')
      table.decimal('price', 12, 2)
      table.timestamps()

      table.foreign('image_id')
        .references('id')
        .inTable('images')
        .onDelete('CASCADE')

    })

    // n to n produtos e imagens
    this.create('image_product', (table) => {
      table.increments()
      table.integer('image_id').unsigned()
      table.integer('product_id').unsigned()
      table.foreign('image_id')
        .references('id')
        .inTable('images')
        .onDelete('CASCADE')
      table.foreign('product_id')
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
    })

    // n to n categoria e produtos
    this.create('category_product', (table) => {
      table.increments()
      table.integer('product_id').unsigned()
      table.integer('category_id').unsigned()
      table.foreign('category_id')
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')
      table.foreign('product_id')
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
    })
  }

  down () {
    this.drop('category_product')
    this.drop('image_product')
    this.drop('products')
  }
}

module.exports = ProductSchema
