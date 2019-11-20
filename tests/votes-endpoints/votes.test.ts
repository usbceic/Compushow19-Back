import { db } from '../../src/config'
import request from 'supertest'
import app from '../../src/app'
import { OAuth2Client } from 'google-auth-library'
import { CreateCategoryRequest } from '../../src/categories/objects'
import { CreateVoteRequest } from '../../src/votes/objects'
import { Nominee } from '../../src/nominees/objects'
import { VoteModel } from '../../src/votes/models'
import { SavedCategoryModel } from '../../src/categories/models'
jest.mock('google-auth-library')

const ADMIN_TOKEN = 'admin_token'
const NON_ADMIN_TOKEN = 'user_token'
let category: SavedCategoryModel, nominees: Nominee[]

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

  category = res.body

  nominees = await Promise.all(['1', '2'].map(async i => {
    const [row] = await db('nominees').insert({
      categoryId: res.body.id!!,
      happyPictureUrl: 'http://happy.com',
      sadPictureUrl: 'http://sad.com',
      name: `Nominee ${i}`
    }).returning(['id', 'name'])
    return row
  }))
})

afterAll(async () => {
  await db.destroy()
})


describe('Votes management', () => {
  const baseUrl = '/v1/api/votes'
  describe('Votes creation', () => {
    const url = baseUrl
    it('let you successfully vote for a nominee in a category and to not repeat', async () => {
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

      const voteResponseFromOtherUser = await request(app)
        .post(url)
        .send(voteRequest)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      expect(voteResponseFromOtherUser.status).toBe(204)
    })
  })
  describe('Votes retrieving', () => {
    const url = `${baseUrl}/byCategory`
    it('Returns 404 when the category doesn\'t have any vote from current user', async () => {
      await db('votes').delete()
      const voteResponse = await request(app)
        .get(`${url}/${category.id}`)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(voteResponse.status).toBe(404)
    })
    it('Returns 200 when the user has made a vote on that category', async () => {
      let [nominee] = nominees
      await db('votes').delete()
      await request(app)
        .post(`${baseUrl}`)
        .send({
          nomineeId: nominee.id!!
        })
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)

      const voteResponse = await request(app)
        .get(`${url}/${category.id}`)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(voteResponse.status).toBe(200)
    })
    it('the vote from user "a" is different from user "b"', async () => {
      let [nominee] = nominees
      await db('votes').delete()
      await request(app)
        .post(`${baseUrl}`)
        .send({
          nomineeId: nominee.id!!
        })
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)

      const voteResponse = await request(app)
        .get(`${url}/${category.id}`)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(voteResponse.status).toBe(404)
    })
  })
})