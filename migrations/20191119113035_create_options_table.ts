import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .createTable('options', table=> {
      table.increments('id').unique()
      table.integer('categoryId').unsigned().index().references('id').inTable('categories').notNullable().onDelete('CASCADE')
      table.string('name', 255).notNullable()
      table.string('happyPictureUrl', 255).notNullable().defaultTo('')
      table.string('sadPictureUrl', 255).notNullable().defaultTo('')
      table.string('extraPictureUrl', 255).defaultTo('')
    })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema
    .dropTableIfExists('options')
}

