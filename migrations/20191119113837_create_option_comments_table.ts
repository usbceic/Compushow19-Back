import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .createTable('optionComments', table=> {
      table.increments('id').unique()
      table.integer('optionId').unsigned().index().references('id').inTable('options').notNullable().onDelete('CASCADE')
      table.string('comment', 255).notNullable()
    })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema
    .dropTableIfExists('optionComments')
}
