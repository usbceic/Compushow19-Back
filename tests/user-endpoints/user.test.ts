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
    describe('Data validation', () => {
      async function runTest(payload: any, expectedError: any) {
        const response = await request(app)
          .post(url)
          .send(payload)
        expect(response.status).toBe(400)
        expect(response.body.errors).toContainEqual(expectedError)
      }
      describe('Returns 400 when `fullName` is invalid', () => {
        const baseResponse = {
          email: 'test@test.com',
          canVote: true,
          profileUrl: 'https://photo.url',
          studentId: '11-11111'
        }
        it('verifies that the field is on the request', async () => {
          await runTest(baseResponse, {
            field: 'fullName',
            validationCode: 'fullName.REQUIRED'
          })
        })
        it('verifies that the field is an string', async () => {
          await runTest({
            ...baseResponse,
            fullName: 1
          }, {
            field: 'fullName',
            validationCode: 'fullName.STRING'
          })
        })
        it('verifies that the string is not empty', async () => {
          await runTest({
            ...baseResponse,
            fullName: ''
          }, {
            field: 'fullName',
            validationCode: 'fullName.LENGTH_NOT_VALID'
          })
        })
        it('verifieds that the string doesn\'t exceeds 50 chars', async () => {
          await runTest({
            ...baseResponse,
            fullName: '111111111111111111111111111111111111111111111111111'
          }, {
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
          await runTest(baseRequest, {
            field: 'email',
            validationCode: 'email.REQUIRED'
          })
        })
        it('verifies that the field is an string', async () => {
          await runTest({
            ...baseRequest,
            email: 1
          }, {
            field: 'email',
            validationCode: 'email.STRING'
          })
        })
        it('verifies that the field is an email', async () => {
          await runTest({
            ...baseRequest,
            email: 'not-an-email'
          }, {
            field: 'email',
            validationCode: 'email.EMAIL'
          })
        })
        it('verifies that the field is an email', async () => {
          await runTest({
            ...baseRequest,
            email: ''
          }, {
            field: 'email',
            validationCode: 'email.LENGTH_NOT_VALID'
          })
        })
        it('verifies that the field doesn\'t exceed 50 chars', async () => {
          await runTest({
            ...baseRequest,
            email: 'very-very-very-very-long-long-long@email.email.comm'
          }, {
            field: 'email',
            validationCode: 'email.LENGTH_NOT_VALID'
          })
        })
      })
    })
  })
})
