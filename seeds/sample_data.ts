import * as Knex from 'knex'
import { createUser } from '../src/users/service'

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  const TABLE_NAMES = [
    'users',
    'categories'
  ]
  TABLE_NAMES.forEach(async (name) => {
    await knex(name).del()
  })

  await createUser({
    canVote: true,
    email: 'a@test.com',
    fullName: 'Admin 1',
    profileUrl: 'https://google.com',
    studentId: 'id-1'
  })
  await createUser({
    canVote: true,
    email: 'b@test.com',
    fullName: 'Admin 1',
    profileUrl: 'https://google.com',
    studentId: 'id-2'
  })

}
