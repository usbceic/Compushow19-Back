import {db} from '../../src/config'
import { getUserByEmailAddress } from '../../src/users/models'
import { CreateUserRequest } from '../../src/users/objects'
import request from 'supertest'
import app from '../../src/app'

beforeAll(async () => {
  await db.migrate.latest()
  return await db.seed.run()
})

describe('User management', () => {
  const baseUrl = '/v1/api'
  it('Allows user creation', async () => {
    const expected : CreateUserRequest = {
      fullName: 'Test User',
      email: 'test@test.com',
      canVote: true,
      profileUrl: 'https://photo.url',
      studentId: '11-11111'
    }
    const res = await request(app)
      .post(`${baseUrl}/users`)
      .send(expected)
    expect(res.status).toBe(204)
    const user = await getUserByEmailAddress('test@test.com')
    expect(user.fullName).toBe(expected.fullName)
    expect(user.email).toBe(expected.email)
    expect(user.canVote).toBe(expected.canVote)
    expect(user.profileUrl).toBe(expected.profileUrl)
    expect(user.studentId).toBe(expected.studentId)
  })
})
