import * as Knex from 'knex'


export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .createTable('users', table => {
      table.increments('id').unique()
      table.string('fullName', 50).notNullable()
      table.string('email', 50).notNullable().unique()
      table.boolean('canVote').notNullable().defaultTo(true)
      table.string('phoneNumber', 50).notNullable().defaultTo('')
      table.string('profileUrl').notNullable().defaultTo('')
      table.string('studentId').unique().notNullable()
      table.string('telegramHandle').unique().nullable().defaultTo(null)
    })
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema
    .dropTableIfExists('users')
}

