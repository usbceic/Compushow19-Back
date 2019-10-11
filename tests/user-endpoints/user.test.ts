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
    it('Returns 400 when `fullName` is invalid', async () => {
      const requiredResponse = await request(app)
        .post(url)
        .send({
          email: 'test@test.com',
          canVote: true,
          profileUrl: 'https://photo.url',
          studentId: '11-11111'
        })
      expect(requiredResponse.status).toBe(400)
      expect(requiredResponse.body.errors).toContainEqual({
        field: 'fullName',
        validationCode: 'fullName.REQUIRED'
      })
      const shouldBeStringResponse = await request(app)
        .post(url)
        .send({
          email: 'test@test.com',
          canVote: true,
          profileUrl: 'https://photo.url',
          studentId: '11-11111',
          fullName: 1
        })
      expect(shouldBeStringResponse.status).toBe(400)
      expect(shouldBeStringResponse.body.errors).toContainEqual({
        field: 'fullName',
        validationCode: 'fullName.STRING'
      })
      const stringNotEmptyResponse = await request(app)
        .post(url)
        .send({
          email: 'test@test.com',
          canVote: true,
          profileUrl: 'https://photo.url',
          studentId: '11-11111',
          fullName: ''
        })
      expect(stringNotEmptyResponse.status).toBe(400)
      expect(stringNotEmptyResponse.body.errors).toContainEqual({
        field: 'fullName',
        validationCode: 'fullName.LENGTH_NOT_VALID'
      })
      const maxStringResponse = await request(app)
        .post(url)
        .send({
          email: 'test@test.com',
          canVote: true,
          profileUrl: 'https://photo.url',
          studentId: '11-11111',
          fullName: '111111111111111111111111111111111111111111111111111'
        })
      expect(maxStringResponse.status).toBe(400)
      expect(maxStringResponse.body.errors).toContainEqual({
        field: 'fullName',
        validationCode: 'fullName.LENGTH_NOT_VALID'
      })

    })

    it('Returns 400 when `email` is invalid', async () => {
      const baseRequest = {
        fullName: 'Test Name',
        canVote: true,
        profileUrl: 'https://photo.url',
        studentId: '11-11111'
      }
      const requiredResponse = await request(app)
        .post(url)
        .send({
          ...baseRequest
        })
      expect(requiredResponse.body.errors).toContainEqual({
        field: 'email',
        validationCode: 'email.REQUIRED'
      })
      const shouldBeStringResponse = await request(app)
        .post(url)
        .send({
          ...baseRequest,
          email: 1
        })
      expect(shouldBeStringResponse.body.errors).toContainEqual({
        field: 'email',
        validationCode: 'email.STRING'
      })
      const shouldBeEmailResponse = await request(app)
        .post(url)
        .send({
          ...baseRequest,
          email: 'not-an-email'
        })
      expect(shouldBeEmailResponse.body.errors).toContainEqual({
        field: 'email',
        validationCode: 'email.EMAIL'
      })
      const stringNotEmptyResponse = await request(app)
        .post(url)
        .send({
          ...baseRequest,
          email: ''
        })
      expect(stringNotEmptyResponse.body.errors).toContainEqual({
        field: 'email',
        validationCode: 'email.LENGTH_NOT_VALID'
      })
      const maxStringResponse = await request(app)
        .post(url)
        .send({
          ...baseRequest,
          email: 'very-very-very-very-long-long-long@email.email.comm'
        })
      expect(maxStringResponse.body.errors).toContainEqual({
        field: 'email',
        validationCode: 'email.LENGTH_NOT_VALID'
      })

    })
  })
})
