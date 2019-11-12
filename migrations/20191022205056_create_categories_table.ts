import * as Knex from 'knex'


export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .createTable('categories', table => {
      table.increments('id').unique()
      table.string('name', 50).notNullable().unique()
      table.enum('type', ['TO_USER', 'TO_TWO_USERS', 'ONLY_EXTRA']).notNullable().defaultTo('TO_USER')
      table.string('extra', 255)
      table.string('description', 255).notNullable()
      table.string('pictureUrl', 255).notNullable()
      table.string('color', 50).notNullable()
    })
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema
    .dropTableIfExists('categories')
}

