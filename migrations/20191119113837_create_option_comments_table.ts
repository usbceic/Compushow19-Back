import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .createTable('nomineeComments', table=> {
      table.increments('id').unique()
      table.integer('nomineeId').unsigned().index().references('id').inTable('nominees').notNullable().onDelete('CASCADE')
      table.string('comment', 255).notNullable()
    })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema
    .dropTableIfExists('nomineeComments')
}
