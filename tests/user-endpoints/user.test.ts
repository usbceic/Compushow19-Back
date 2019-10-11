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
    describe('Returns 400 when `fullName` is invalid', () => {
      it('verifies that the field is on the request', async () => {
        const response = await request(app)
          .post(url)
          .send({
            email: 'test@test.com',
            canVote: true,
            profileUrl: 'https://photo.url',
            studentId: '11-11111'
          })
        expect(response.status).toBe(400)
        expect(response.body.errors).toContainEqual({
          field: 'fullName',
          validationCode: 'fullName.REQUIRED'
        })
      })
      it('verifies that the field is an string', async () => {
        const response = await request(app)
          .post(url)
          .send({
            email: 'test@test.com',
            canVote: true,
            profileUrl: 'https://photo.url',
            studentId: '11-11111',
            fullName: 1
          })
        expect(response.status).toBe(400)
        expect(response.body.errors).toContainEqual({
          field: 'fullName',
          validationCode: 'fullName.STRING'
        })
      })
      it('verifies that the string is not empty', async () => {
        const response = await request(app)
          .post(url)
          .send({
            email: 'test@test.com',
            canVote: true,
            profileUrl: 'https://photo.url',
            studentId: '11-11111',
            fullName: ''
          })
        expect(response.status).toBe(400)
        expect(response.body.errors).toContainEqual({
          field: 'fullName',
          validationCode: 'fullName.LENGTH_NOT_VALID'
        })
      })
      it('verifieds that the string doesn\'t exceeds 50 chars', async () => {
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
    })

    describe('Returns 400 when `email` is invalid', () => {
      const baseRequest = {
        fullName: 'Test Name',
        canVote: true,
        profileUrl: 'https://photo.url',
        studentId: '11-11111'
      }
      it('verifies that the field is in the request', async () => {
        const response = await request(app)
          .post(url)
          .send({
            ...baseRequest
          })
        expect(response.status).toBe(400)
        expect(response.body.errors).toContainEqual({
          field: 'email',
          validationCode: 'email.REQUIRED'
        })
      })
      it('verifies that the field is an string', async () => {
        const response = await request(app)
          .post(url)
          .send({
            ...baseRequest,
            email: 1
          })
        expect(response.status).toBe(400)
        expect(response.body.errors).toContainEqual({
          field: 'email',
          validationCode: 'email.STRING'
        })
      })
      it('verifies that the field is an email', async () => {
        const response = await request(app)
          .post(url)
          .send({
            ...baseRequest,
            email: 'not-an-email'
          })
        expect(response.status).toBe(400)
        expect(response.body.errors).toContainEqual({
          field: 'email',
          validationCode: 'email.EMAIL'
        })
      })
      it('verifies that the field is an email', async () => {
        const response = await request(app)
          .post(url)
          .send({
            ...baseRequest,
            email: ''
          })
        expect(response.status).toBe(400)
        expect(response.body.errors).toContainEqual({
          field: 'email',
          validationCode: 'email.LENGTH_NOT_VALID'
        })
      })
      it('verifies that the field doesn\'t exceed 50 chars', async () => {
        const response = await request(app)
          .post(url)
          .send({
            ...baseRequest,
            email: 'very-very-very-very-long-long-long@email.email.comm'
          })
        expect(response.status).toBe(400)
        expect(response.body.errors).toContainEqual({
          field: 'email',
          validationCode: 'email.LENGTH_NOT_VALID'
        })
      })
    })
  })
})
