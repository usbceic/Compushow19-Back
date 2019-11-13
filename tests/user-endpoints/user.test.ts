
import {db} from '../../src/config'
import { getUserByEmailAddress } from '../../src/users/models'
import { CreateUserRequest, User } from '../../src/users/objects'
import { OAuth2Client } from 'google-auth-library'
import request from 'supertest'
import app from '../../src/app'
jest.mock('google-auth-library')

const ADMIN_TOKEN = 'admin_token'
const NON_ADMIN_TOKEN = 'user_token'

beforeAll(async () => {
  OAuth2Client.prototype.verifyIdToken = async function(options: any): Promise<any> {
    return {
      getPayload() {
        return {
          email: options.idToken === ADMIN_TOKEN
            ? 'admin@test.com'
            : 'user@test.com'
        }
      }
    }
  }
  await db.migrate.latest()
  return await db.seed.run()
})

afterAll(async () => {
  await db.destroy()
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
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send(expected)
      expect(res.status).toBe(201)
      const user = await getUserByEmailAddress('test@test.com')
      expect(user.fullName).toBe(expected.fullName)
      expect(user.email).toBe(expected.email)
      expect(user.canVote).toBe(expected.canVote)
      expect(user.profileUrl).toBe(expected.profileUrl)
      expect(user.studentId).toBe(expected.studentId)
    })
    it('Rejects to create user if token is not for admin', async () => {
      const expected : CreateUserRequest = {
        fullName: 'Test User',
        email: 'test5@test.com',
        canVote: true,
        profileUrl: 'https://photo.url',
        studentId: '11-111115'
      }
      const res = await request(app)
        .post(url)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
        .send(expected)
      expect(res.status).toBe(403)
    })
    describe('Data validation', () => {
      async function runTest(payload: any, expectedError: any) {
        const response = await request(app)
          .post(url)
          .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
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
            email: 'very-very-very-very-long-long-long-long-long@test.com'
          }, {
            field: 'email',
            validationCode: 'email.LENGTH_NOT_VALID'
          })
        })
        it('verifies that the email is not already taken', async () => {
          await request(app)
            .post(url)
            .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
            .send({
              ...baseRequest,
              email: 'good@test.com',
              studentId: '22-22222'
            })
          await runTest({
            ...baseRequest, email: 'good@test.com'
          }, {
            field: 'email',
            validationCode: 'email.UNIQUE'
          })
        })

      })
      describe('Returns 400 when `canVote` is invalid', () => {
        const baseRequest = {
          fullName: 'Test Name',
          email: 'test1@test.com',
          profileUrl: 'https://photo.url',
          studentId: '11-11111'
        }
        it('verifies that the field is in the request', async () => {
          await runTest(baseRequest, {
            field: 'canVote',
            validationCode: 'canVote.REQUIRED'
          })
        })
        it('verifies that the field is a boolean', async () => {
          await runTest({
            ...baseRequest,
            canVote: '1ff'
          }, {
            field: 'canVote',
            validationCode: 'canVote.BOOLEAN'
          })
        })
      })
      describe('Returns 400 when `profileUrl` is invalid', () => {
        const baseRequest = {
          fullName: 'Test Name',
          email: 'test1@test.com',
          canVote: true,
          studentId: '11-11111'
        }
        it('should allow creating an user without profileUrl', async () => {
          await request(app).post(url)
            .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
            .send({...baseRequest, email: 'test2@test.com', studentId: '33-33333'})
            .expect(201)
        })
        it('verifies that the field is an string', async () => {
          await runTest({
            ...baseRequest,
            profileUrl: 1231
          }, {
            field: 'profileUrl',
            validationCode: 'profileUrl.STRING'
          })
        })
      })
      describe('Returns 400 when `email` is invalid', () => {
        const baseRequest = {
          fullName: 'Test Name',
          canVote: true,
          profileUrl: 'https://photo.url',
          email: 'test3@test.com'
        }
        it('verifies that the field is in the request', async () => {
          await runTest(baseRequest, {
            field: 'studentId',
            validationCode: 'studentId.REQUIRED'
          })
        })
        it('verifies that the field is an string', async () => {
          await runTest({
            ...baseRequest,
            studentId: 1
          }, {
            field: 'studentId',
            validationCode: 'studentId.STRING'
          })
        })
        it('verifies that the field has the required length', async () => {
          await runTest({
            ...baseRequest,
            studentId: ''
          }, {
            field: 'studentId',
            validationCode: 'studentId.LENGTH_NOT_VALID'
          })
        })
        it('verifies that the field doesn\'t exceed 50 chars', async () => {
          await runTest({
            ...baseRequest,
            studentId: 'very-very-very-very-long-long-longfstudentId.studentId.comm'
          }, {
            field: 'studentId',
            validationCode: 'studentId.LENGTH_NOT_VALID'
          })
        })
        it('verifies that the studentId is not already taken', async () => {
          await request(app)
            .post(url)
            .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
            .send({
              ...baseRequest,
              studentId: '22-22222'
            })
          await runTest({
            ...baseRequest, studentId: '22-22222', email: 'test4@test.com'
          }, {
            field: 'studentId',
            validationCode: 'studentId.UNIQUE'
          })
        })
      })

    })
  })
  describe('User retrieving', () => {
    const url = `${baseUrl}/users`
    it('Allows user retrieving by id', async () => {
      const expected : CreateUserRequest = {
        fullName: 'Test User 1',
        email: 'test+1@test.com',
        canVote: true,
        profileUrl: 'https://photo.url',
        studentId: '11-11112'
      }
      const res = await request(app)
        .post(url)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send(expected)
      const userId = res.body[0].id
      const userRes = await request(app)
        .get(`${url}/${userId}`)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      expect(userRes.status).toBe(200)

      const user : User = userRes.body
      expect(user).toStrictEqual({...expected, id: userId, telegramHandle: null, phoneNumber: ''})
    })
    it('Returns 404 when user doesnt exists', async () => {
      const res = await request(app)
        .get(`${url}/1331231`)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      expect(res.status).toBe(404)
    })
    it('Allows user retrieving by active token', async () => {
      const res = await request(app)
        .get(`${url}/me`)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      expect(res.status).toBe(200)
      const user : User = res.body
      expect(user.email).toStrictEqual('admin@test.com')
    })
  })
})
