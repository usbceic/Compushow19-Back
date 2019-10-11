import * as Knex from 'knex'

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  const usersTable = 'users'
  await knex(usersTable).del()
}
