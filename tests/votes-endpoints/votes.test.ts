import { db } from '../../src/config'
import request from 'supertest'
import app from '../../src/app'
import { OAuth2Client } from 'google-auth-library'
import { CreateCategoryRequest } from '../../src/categories/objects'
import { CreateVoteRequest } from '../../src/votes/objects'
import { Nominee } from '../../src/nominees/objects'
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


describe('Votes management', () => {
  const baseUrl = '/v1/api/votes'
  describe('Votes creation', () => {

    const url = baseUrl
    it('let you successfully vote for a nominee in a category', async () => {
      await db.migrate.latest()
      await db.seed.run()
      const expected : CreateCategoryRequest =   {
        color: '#000',
        description: 'Category for voting',
        name: 'Category for voting',
        pictureUrl: 'http://picture.url',
        type: 'TO_USER'
      }
      const res = await request(app)
        .post('/v1/api/categories')
        .send(expected)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)


      const [nominee] : Nominee[] = await Promise.all(['1', '2'].map(i =>
        db('nominees').insert({
          categoryId: res.body.id!!,
          happyPictureUrl: 'http://happy.com',
          sadPictureUrl: 'http://sad.com',
          name: `Nominee ${i}`
        }).returning(['id', 'name'])
      ))

      const voteRequest: CreateVoteRequest = {
        nomineeId: nominee.id
      }

      const voteResponse = await request(app)
        .post(url)
        .send(voteRequest)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(voteResponse.status).toBe(204)
    })
  })
})