import * as Knex from 'knex'
import { createUser } from '../src/users/service'
import { CategoryModel } from '../src/categories/models'
import { createCategory } from '../src/categories/service'

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

  const categories = await Promise.all(([
    {
      color: '',
      description: 'TO_USER',
      name: 'TO_USER',
      pictureUrl: '',
      type: 'TO_USER'
    },
    {
      color: '',
      description: 'TO_TWO_USERS',
      name: 'TO_TWO_USERS',
      pictureUrl: '',
      type: 'TO_TWO_USERS'
    },
    {
      color: '',
      description: 'ONLY_EXTRA',
      name: 'ONLY_EXTRA',
      pictureUrl: '',
      type: 'ONLY_EXTRA'
    },
    {
      color: '',
      description: 'TO_USER_WITH_EXTRA',
      name: 'TO_USER_WITH_EXTRA',
      pictureUrl: '',
      type: 'TO_USER_WITH_EXTRA'
    }
  ] as CategoryModel[])
    .map(createCategory))

  await Promise.all(categories.map(async category => {
    await knex('nominees').insert({
      categoryId: category.id!!,
      happyPictureUrl: 'http://happy.com',
      sadPictureUrl: 'http://sad.com',
      name: category.type
    })
  }))

}
