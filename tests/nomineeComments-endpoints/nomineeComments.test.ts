import { db } from '../../src/config'
import request from 'supertest'
import app from '../../src/app'
import { OAuth2Client } from 'google-auth-library'
import { CreateCategoryRequest } from '../../src/categories/objects'
import { Nominee } from '../../src/nominees/objects'
import { SavedCategoryModel } from '../../src/categories/models'
import { ExtendedNomineeCommentModel } from '../../src/nomineeComments/models'
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


describe('Nominees comments management', () => {
  const baseUrl = '/v1/api'
  describe('Nominee listing', () => {
    let category : SavedCategoryModel
    let nominee : Nominee
    beforeAll(async () => {
      await db.migrate.latest()
      await db.seed.run()
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
      const [row] = await db('nominees').insert({
        categoryId: res.body.id!!,
        happyPictureUrl: 'http://happy.com',
        sadPictureUrl: 'http://sad.com',
        name: res.body.type
      }).returning(['id', 'name'])

      category = res.body
      nominee = row
    })

    const url = `${baseUrl}/nomineeComments`
    it('Returns an empty list when the nominee doesn\'t have any comment', async () => {
      await db('nomineeComments').delete()
      const nomineecomments = await request(app)
        .get(`${url}/byCategory/${category.id}`)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(nomineecomments.status).toBe(200)
      const nominees : Nominee[] = nomineecomments.body
      expect(nominees).toStrictEqual([])
    })
    it('Returns a singleton list on a nominee with just 1 comment', async () => {
      await db('nomineeComments').insert({
        nomineeId: nominee.id!!,
        comment: 'patata'
      })
      const commentsResponse = await request(app)
        .get(`${url}/byCategory/${category.id}`)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(commentsResponse.status).toBe(200)
      console.log(commentsResponse.body)
      expect(commentsResponse.body.length).toBe(1)

      const comment : ExtendedNomineeCommentModel = commentsResponse.body[0]
      expect(comment.comment).toBe('patata')
      expect(comment.nominee.categoryId).toBe(category.id)
      expect(comment.nomineeId).toBe(nominee.id)
    })
  })
})