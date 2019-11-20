import { db } from '../../src/config'
import request from 'supertest'
import app from '../../src/app'
import { OAuth2Client } from 'google-auth-library'
import { CreateCategoryRequest } from '../../src/categories/objects'
import { Nominee } from '../../src/nominees/objects'
import { SavedCategoryModel } from '../../src/categories/models'
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


describe('Nominees management', () => {
  const baseUrl = '/v1/api'
  describe('Nominee listing', () => {
    const url = `${baseUrl}/nominees`
    it('Returns an empty list when the category doesn\'t have any nominee', async () => {
      const expected : CreateCategoryRequest = {
        name: 'Test Category',
        type: 'TO_USER',
        pictureUrl: 'http://google.com',
        description: 'Sample description',
        extra: 'Extra information',
        color: '#000000'
      }

      const res = await request(app)
        .post('/v1/api/categories')
        .send(expected)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      expect(res.status).toBe(201)

      const category : SavedCategoryModel = res.body

      const nomineeResponse = await request(app)
        .get(`${url}/byCategory/${category.id}`)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(nomineeResponse.status).toBe(200)
      const nominees : Nominee[] = nomineeResponse.body
      expect(nominees).toStrictEqual([])
    })
    it('Returns a singleton list on a category with just 1 nomination', async () => {

      const expected : CreateCategoryRequest =   {
        color: '#000',
        description: 'TO_USER',
        name: 'TO_USER',
        pictureUrl: 'http://picture.url',
        type: 'TO_USER'
      }

      const res = await request(app)
        .post('/v1/api/categories')
        .send(expected)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      expect(res.status).toBe(201)
      await db('nominees').insert({
        categoryId: res.body.id!!,
        happyPictureUrl: 'http://happy.com',
        sadPictureUrl: 'http://sad.com',
        name: res.body.type
      })

      const category : SavedCategoryModel = res.body

      const nomineeResponse = await request(app)
        .get(`${url}/byCategory/${category.id}`)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(nomineeResponse.status).toBe(200)
      const nominees : Nominee[] = nomineeResponse.body
      expect(nominees.length).toStrictEqual(1)
      const nominee: Nominee = nominees[0]
      expect(nominee.name).toBe(res.body.type)
      expect(nominee.categoryId).toBe(res.body.id)
      expect(nominee.happyPictureUrl).toBe('http://happy.com')
      expect(nominee.sadPictureUrl).toBe('http://sad.com')
    })
  })
})