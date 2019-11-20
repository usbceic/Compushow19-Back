import * as Knex from 'knex'
import { createUser } from '../src/users/service'

export async function seed(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  const TABLE_NAMES = [
    'users',
    'categories',
    'nominees'
  ]
  await Promise.all(TABLE_NAMES.map(async name => {
    await knex(name).del()
  }))

  const sampleUsers = [
    {
      email: 'admin@test.com',
      fullName: 'Admin 1',
      studentId: 'id-1',
      profileUrl: 'http://google.com',
      canVote: true
    },
    {
      email: 'user@test.com',
      fullName: 'User 1',
      studentId: 'id-2',
      profileUrl: 'http://google.com',
      canVote: true
    },
    {
      email: 'test6@test.com',
      fullName: 'Test',
      studentId: 'id-3',
      profileUrl: 'http://google.com',
      canVote: true
    },
    {
      email: 'yes@test.com',
      fullName: 'Yes',
      studentId: 'id-4',
      profileUrl: 'http://google.com',
      canVote: true
    },
    {
      email: 'no@test.com',
      fullName: 'No',
      studentId: 'id-5',
      profileUrl: 'http://google.com',
      canVote: true
    },
    {
      email: 'testy@test.com',
      fullName: 'Testy',
      studentId: 'id-6',
      profileUrl: 'http://google.com',
      canVote: true
    }
  ]

  await Promise.all(sampleUsers.map(createUser))

}
