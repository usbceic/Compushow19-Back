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
  describe('User creation', () => {
    const url = `${baseUrl}/users`
    it('Allows user creation', async () => {
      const expected : CreateUserRequest = {
        fullName: 'Test User',
        email: 'test@test.com',
        canVote: true,
        profileUrl: 'https://photo.url',
        studentId: '11-11111'
      }
      const res = await request(app)
        .post(url)
        .send(expected)
      expect(res.status).toBe(204)
      const user = await getUserByEmailAddress('test@test.com')
      expect(user.fullName).toBe(expected.fullName)
      expect(user.email).toBe(expected.email)
      expect(user.canVote).toBe(expected.canVote)
      expect(user.profileUrl).toBe(expected.profileUrl)
      expect(user.studentId).toBe(expected.studentId)
    })
    it('Returns 404 when `fullName` is invalid', async () => {
      const baseExpected = {
        status: 400,
        title: 'Bad Request',
        message: 'A validation failed or the request was bad formatted',
        userMessage: 'A validation failed'
      }
      await request(app)
        .post(url)
        .send({
          email: 'test@test.com',
          canVote: true,
          profileUrl: 'https://photo.url',
          studentId: '11-11111'
        })
        .expect({
          ...baseExpected,
          errors: [{
            field: 'fullName',
            validationCode: 'fullName.REQUIRED'
          }]
        })
    })
  })
})
