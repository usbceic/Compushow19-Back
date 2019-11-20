import { db } from '../../src/config'
import request from 'supertest'
import app from '../../src/app'
import { OAuth2Client } from 'google-auth-library'
import { CreateCategoryRequest } from '../../src/categories/objects'
import { CreateVoteRequest } from '../../src/votes/objects'
import { Nominee } from '../../src/nominees/objects'
import { VoteModel } from '../../src/votes/models'
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
    it('let you successfully vote for a nominee in a category and to not repeat', async () => {
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
      expect(res.status).toBe(201)

      const nominees: Nominee[] = await Promise.all(['1', '2'].map(async i => {
        const [row] = await db('nominees').insert({
          categoryId: res.body.id!!,
          happyPictureUrl: 'http://happy.com',
          sadPictureUrl: 'http://sad.com',
          name: `Nominee ${i}`
        }).returning(['id', 'name'])
        return row
      }))
      const [nominee1, nominee2] = nominees
      const voteRequest: CreateVoteRequest = {
        nomineeId: nominee1.id!!
      }
      const voteResponse = await request(app)
        .post(url)
        .send(voteRequest)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(voteResponse.status).toBe(204)

      const {length} : VoteModel[] = await db('votes').select('*')
      expect(length).toBeTruthy()

      const voteResponse1 = await request(app)
        .post(url)
        .send({
          nomineeId: nominee1.id!!
        })
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(voteResponse1.status).toBe(409)
      const voteResponse2 = await request(app)
        .post(url)
        .send({
          nomineeId: nominee2.id!!
        })
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(voteResponse2.status).toBe(409)
      const {length: newLength}: VoteModel[] = await db('votes').select('*')
      expect(newLength).toBe(length)
    })
  })
})