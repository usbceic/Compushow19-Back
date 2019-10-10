import {db} from '../../src/config'
import { getUserByEmailAddress } from '../../src/users/models'
import { CreateUserRequest } from '../../src/users/objects'
import request from 'supertest'
import app from '../../src/app'

beforeAll(async () => {
  await db.migrate.latest()
  // return await db.seed.run()
})

describe('User management', () => {
  const baseUrl = '/v1/api'
  it('Allows user creation', () => {
    const expected : CreateUserRequest = {
      fullName: 'Test User',
      email: 'test@test.com',
      canVote: true,
      profileUrl: 'https://photo.url',
      studentId: '11-11111'
    }
    return request(app)
      .post(`${baseUrl}/users`)
      .send(expected)
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /text/)
      .then(async () => {
        const user = await getUserByEmailAddress('test@test.com')
        expect(user.fullName).toBe(expected.fullName)
        expect(user.email).toBe(expected.email)
        expect(user.canVote).toBe(expected.canVote)
        expect(user.profileUrl).toBe(expected.profileUrl)
        expect(user.studentId).toBe(expected.studentId)
      })
  })
})
