import * as Knex from 'knex'

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  const TABLE_NAMES = [
    'users',
    'categories'
  ]
  TABLE_NAMES.forEach(async (name) => {
    await knex(name).del()
  })
}
