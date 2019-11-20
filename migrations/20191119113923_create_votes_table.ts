import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .createTable('votes', table=> {
      table.increments('id').unique()
      table.integer('userId').unsigned().index().references('id').inTable('users').notNullable().onDelete('CASCADE')
      table.integer('categoryId').unsigned().index().references('id').inTable('categories').notNullable().onDelete('CASCADE')
      table.integer('nomineeId').unsigned().index().references('id').inTable('nominees').notNullable().onDelete('CASCADE')
    })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema
    .dropTableIfExists('votes')
}
