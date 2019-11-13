import * as Knex from 'knex'


export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .createTable('nominations', table => {
      table.increments('id').unique()
      table.integer('userId').unsigned().index().references('id').inTable('users').notNullable().onDelete('CASCADE')
      table.integer('categoryId').unsigned().index().references('id').inTable('categories').notNullable().onDelete('CASCADE')
      table.integer('mainNominee').unsigned().index().references('id').inTable('users').onDelete('SET NULL')
      table.integer('auxNominee').unsigned().index().references('id').inTable('users').onDelete('SET NULL')
      table.string('extra', 255)
    })
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema
    .dropTableIfExists('nominations')
}