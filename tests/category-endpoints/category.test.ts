import { db } from '../../src/config'
import request from 'supertest'
import app from '../../src/app'
import { CreateCategoryRequest, ModifyCategoryRequest } from '../../src/categories/objects'
import { getCategoryByName, getCategoryById } from '../../src/categories/models'
import { OAuth2Client } from 'google-auth-library'
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

describe('Category management', () => {
  const baseUrl = '/v1/api'

  describe('Empty category listing', () => {
    const url = `${baseUrl}/categories`

    it('Allows empty category listing', async () => {
      await db.seed.run()
      const emptyCategoriesResponse = await request(app)
        .get(url)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      expect(emptyCategoriesResponse.status).toBe(200)
      expect(emptyCategoriesResponse.body).toStrictEqual([])
    })
  })

  describe('Category creation', () => {
    const url = `${baseUrl}/categories`

    it('Allows for category creation', async () => {
      const expected : CreateCategoryRequest = {
        name: 'Test Category',
        type: 'TO_USER',
        pictureUrl: 'http://google.com',
        description: 'Sample description',
        extra: 'Extra information',
        color: '#000000'
      }

      const res = await request(app)
        .post(url)
        .send(expected)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      expect(res.status).toBe(201)

      const category = await getCategoryByName('Test Category')
      expect(category.name).toBe(expected.name)
      expect(category.type).toBe(expected.type)
      expect(category.pictureUrl).toBe(expected.pictureUrl)
      expect(category.description).toBe(expected.description)
      expect(category.extra).toBe(expected.extra)
      expect(category.color).toBe(expected.color)
    })
    it('Rejects for category creation when user is not an admin', async () => {
      const expected : CreateCategoryRequest = {
        name: 'Test Category for non admin',
        type: 'TO_USER',
        pictureUrl: 'http://google.com',
        description: 'Sample description',
        extra: 'Extra information',
        color: '#000000'
      }

      const res = await request(app)
        .post(url)
        .send(expected)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(res.status).toBe(403)
    })

    describe('Data validation', () => {
      async function runTest(payload: any, expectedError: any) {
        const response = await request(app)
          .post(url)
          .send(payload)
          .set('Authorization', `Bearer ${ADMIN_TOKEN}`)

        expect(response.status).toBe(400)
        expect(response.body.errors).toContainEqual(expectedError)
      }

      describe('Returns 400 when `name` is invalid', () => {
        const baseResponse = {
          type: 'TO_USER',
          pictureUrl: 'http://google.com',
          description: 'Sample description',
          extra: 'Extra information',
          color: '#000000'
        }

        it('verifies that the field is on the request', async () => {
          await runTest(baseResponse, {
            field: 'name',
            validationCode: 'name.REQUIRED'
          })
        })

        it('verifies that the field is a string', async () => {
          await runTest({
            ...baseResponse,
            name: 1
          }, {
            field: 'name',
            validationCode: 'name.STRING'
          })
        })

        it('verifies that the string is not empty', async () => {
          await runTest({
            ...baseResponse,
            name: ''
          }, {
            field: 'name',
            validationCode: 'name.LENGTH_NOT_VALID'
          })
        })

        it('verifies that the string doesn\'t exceed 50 chars', async () => {
          await runTest({
            ...baseResponse,
            name: '1234567812345678123456781234567812345678123456781234567812345678'
          }, {
            field: 'name',
            validationCode: 'name.LENGTH_NOT_VALID'
          })
        })

        it('verifies that the string is unique', async () => {
          const extraRequest = {
            name: 'this is a name',
            type: 'TO_USER',
            pictureUrl: 'http://google.com',
            description: 'Sample description',
            extra: 'Extra information',
            color: '#000000'
          }
          await request(app)
            .post(url)
            .send(extraRequest)
            .set('Authorization', `Bearer ${ADMIN_TOKEN}`)

          await runTest({
            ...baseResponse,
            name: 'this is a name'
          }, {
            field: 'name',
            validationCode: 'name.UNIQUE'
          })
        })
      })

      describe('Returns 400 when `description` is invalid', () => {
        const baseResponse = {
          name: 'Sample name',
          type: 'TO_USER',
          pictureUrl: 'http://google.com',
          extra: 'Extra information',
          color: '#000000'
        }

        it('verifies that the field is on the request', async () => {
          await runTest(baseResponse, {
            field: 'description',
            validationCode: 'description.REQUIRED'
          })
        })

        it('verifies that the field is a string', async () => {
          await runTest({
            ...baseResponse,
            description: 1
          }, {
            field: 'description',
            validationCode: 'description.STRING'
          })
        })

        it('verifies that the string is not empty', async () => {
          await runTest({
            ...baseResponse,
            description: ''
          }, {
            field: 'description',
            validationCode: 'description.LENGTH_NOT_VALID'
          })
        })

        it('verifies that the string doesn\'t exceed 250chars', async () => {
          let desc = 'abcde'
          while (desc.length < 256) {
            desc += desc
          }

          await runTest({
            ...baseResponse,
            description: desc
          }, {
            field: 'description',
            validationCode: 'description.LENGTH_NOT_VALID'
          })
        })
      })

      describe('Returns 400 when `type` is invalid', () => {
        const baseResponse = {
          name: 'Sample name',
          pictureUrl: 'http://google.com',
          description: 'Sample description',
          extra: 'Extra information',
          color: '#000000'
        }

        it('verifies that the field is a string', async () => {
          await runTest({
            ...baseResponse,
            type: 1
          }, {
            field: 'type',
            validationCode: 'type.STRING'
          })
        })

        it('verifies that the string is not empty', async () => {
          await runTest({
            ...baseResponse,
            type: ''
          }, {
            field: 'type',
            validationCode: 'type.LENGTH_NOT_VALID'
          })
        })

        it('verifies that the field is at least 7 characters long', async () => {
          await runTest({
            ...baseResponse,
            type: 'A'
          }, {
            field: 'type',
            validationCode: 'type.LENGTH_NOT_VALID'
          })
        })

        it('verifies that the field is at most 12 characters long', async () => {
          await runTest({
            ...baseResponse,
            type: 'ABCDEFGHIJKLMN'
          }, {
            field: 'type',
            validationCode: 'type.LENGTH_NOT_VALID'
          })
        })

        it('verifies that the field is a valud enum item', async () => {
          await runTest({
            ...baseResponse,
            type: 'TEST'
          }, {
            field: 'type',
            validationCode: 'type.INVALID_VALUE'
          })
        })
      })

      describe('Returns 400 when `pictureUrl` is invalid', () => {
        const baseResponse = {
          name: 'Sample name',
          type: 'TO_USER',
          description: 'Sample description',
          extra: 'Extra information',
          color: '#000000'
        }

        it('verifies that the field is on the request', async () => {
          await runTest(baseResponse, {
            field: 'pictureUrl',
            validationCode: 'pictureUrl.REQUIRED'
          })
        })

        it('verifies that the field is a string', async () => {
          await runTest({
            ...baseResponse,
            pictureUrl: 1
          }, {
            field: 'pictureUrl',
            validationCode: 'pictureUrl.STRING'
          })
        })

        it('verifies that the string is not empty', async () => {
          await runTest({
            ...baseResponse,
            pictureUrl: ''
          }, {
            field: 'pictureUrl',
            validationCode: 'pictureUrl.LENGTH_NOT_VALID'
          })
        })

        it('verifies that the string doesn\'t exceed 250chars', async () => {
          let desc = 'abcde'
          while (desc.length < 256) {
            desc += desc
          }
          await runTest({
            ...baseResponse,
            pictureUrl: desc
          }, {
            field: 'pictureUrl',
            validationCode: 'pictureUrl.LENGTH_NOT_VALID'
          })
        })

        it('verifies that the string is an URL', async () => {
          await runTest({
            ...baseResponse,
            pictureUrl: 'testy'
          }, {
            field: 'pictureUrl',
            validationCode: 'pictureUrl.URL'
          })
        })
      })

      describe('Returns 400 when `color` is invalid', () => {
        const baseResponse = {
          name: 'Sample name',
          type: 'TO_USER',
          description: 'Sample description',
          pictureUrl: 'http://google.com',
          extra: 'Extra information',
        }

        it('verifies that the field is on the request', async () => {
          await runTest(baseResponse, {
            field: 'color',
            validationCode: 'color.REQUIRED'
          })
        })

        it('verifies that the field is a string', async () => {
          await runTest({
            ...baseResponse,
            color: 1
          }, {
            field: 'color',
            validationCode: 'color.STRING'
          })
        })

        it('verifies that the string doesn\'t exceed 50 chars', async () => {
          await runTest({
            ...baseResponse,
            color: '1234567812345678123456781234567812345678123456781234567812345678'
          }, {
            field: 'color',
            validationCode: 'color.LENGTH_NOT_VALID'
          })
        })

        it('verifies that the string is not empty', async () => {
          await runTest({
            ...baseResponse,
            color: ''
          }, {
            field: 'color',
            validationCode: 'color.LENGTH_NOT_VALID'
          })
        })
      })

      describe('Returns 400 when `extra` is invalid', () => {
        const baseResponse = {
          type: 'TO_USER',
          pictureUrl: 'http://google.com',
          description: 'Sample description',
          name: 'Test name',
          color: '#000000'
        }

        it('verifies that the field is a string', async () => {
          await runTest({
            ...baseResponse,
            extra: 1
          }, {
            field: 'extra',
            validationCode: 'extra.STRING'
          })
        })

        it('verifies that the string doesn\'t exceed 255 chars', async () => {
          let extra = 'abcde'
          while (extra.length < 256) {
            extra += extra
          }

          await runTest({
            ...baseResponse,
            extra: extra
          }, {
            field: 'extra',
            validationCode: 'extra.LENGTH_NOT_VALID'
          })
        })
      })
    })
  })

  describe('Category lookup by ID', () => {
    const url = `${baseUrl}/categories`

    it('Allows for a category to be gotten', async () => {
      await db.seed.run()
      const expected : CreateCategoryRequest = {
        name: 'Testing Category Get',
        type: 'TO_USER',
        pictureUrl: 'http://google.com',
        description: 'Sample description',
        extra: 'Extra information',
        color: '#000000'
      }

      const resCreation = await request(app)
        .post(url)
        .send(expected)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)

      expect(resCreation.status).toBe(201)

      const id = resCreation.body[0].id
      expect(id).toBeDefined()

      const lookupUrl = url + `/${id}`
      const res = await request(app)
        .get(lookupUrl)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)

      expect(res.status).toBe(200)

      const category = {
        id: res.body.id,
        name: res.body.name,
        type: res.body.type,
        pictureUrl: res.body.pictureUrl,
        description: res.body.description,
        extra: res.body.extra,
        color: res.body.color,
      }

      expect(category.id).toBe(id)
      expect(category.name).toBe(expected.name)
      expect(category.type).toBe(expected.type)
      expect(category.pictureUrl).toBe(expected.pictureUrl)
      expect(category.description).toBe(expected.description)
      expect(category.extra).toBe(expected.extra)
      expect(category.color).toBe(expected.color)
    })

    it('Raises a not found error on invalid id', async() => {
      const id = -1
      const lookupUrl = `${url}/${id}`
      const res = await request(app)
        .get(lookupUrl)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)

      expect(res.status).toBe(404)
    })

    it('Raises a not found error on not found id', async() => {
      const id = 0
      const lookupUrl = `${url}/${id}`
      const res = await request(app)
        .get(lookupUrl)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)

      expect(res.status).toBe(404)
    })

    it('Raises a not found error on lookup by string', async() => {
      const id = 'test'
      const lookupUrl = `${url}/${id}`
      const res = await request(app)
        .get(lookupUrl)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      expect(res.status).toBe(400)
    })
  })

  describe('Category lookup by name', () => {
    const url = `${baseUrl}/categories/byName`

    it('Allows for a category to be gotten', async () => {
      await db.seed.run()
      const expected : CreateCategoryRequest = {
        name: 'Testing Category Get by Name',
        type: 'TO_USER',
        pictureUrl: 'http://google.com',
        description: 'Sample description',
        extra: 'Extra information',
        color: '#000000'
      }

      const creationUrl = `${baseUrl}/categories/`
      const creationRes = await request(app)
        .post(creationUrl)
        .send(expected)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)

      expect(creationRes.status).toBe(201)

      const name = creationRes.body[0].name
      expect(name).toBeDefined()

      const res = await request(app)
        .get(`${url}?name=${name}`)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)

      expect(res.status).toBe(200)

      const category = {
        id: res.body.id,
        name: res.body.name,
        type: res.body.type,
        pictureUrl: res.body.pictureUrl,
        description: res.body.description,
        extra: res.body.extra,
        color: res.body.color,
      }

      expect(category.name).toBe(expected.name)
      expect(category.type).toBe(expected.type)
      expect(category.pictureUrl).toBe(expected.pictureUrl)
      expect(category.description).toBe(expected.description)
      expect(category.extra).toBe(expected.extra)
      expect(category.color).toBe(expected.color)
    })

    it('Raises a not found error on invalid name', async() => {
      const name = 'Nonexistent name 123'
      const res = await request(app)
        .get(`${url}?name=${name}`)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)

      expect(res.status).toBe(404)
    })

    it('Raises a bad request error if no name is sent', async() => {
      const res = await request(app)
        .get(url)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)

      expect(res.status).toBe(400)
    })

    it('Raises a bad request error if empty name is sent', async() => {
      const res = await request(app)
        .get(`${url}?name=`)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)

      expect(res.status).toBe(400)
    })
  })

  describe('Category edition', () => {
    const url = `${baseUrl}/categories`

    it('Allows for a category to be edited', async () => {
      await db.seed.run()
      const original : CreateCategoryRequest = {
        name: 'Testing Category to Edit',
        type: 'TO_USER',
        pictureUrl: 'http://google.com',
        description: 'Sample description',
        extra: 'Extra information',
        color: '#000000'
      }

      const resCreation = await request(app)
        .post(url)
        .send(original)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)

      expect(resCreation.status).toBe(201)

      const id = resCreation.body[0].id
      expect(id).toBeDefined()

      const expected : ModifyCategoryRequest = {
        name: 'Testing Category After Edit',
        pictureUrl: 'http://google.co.uk',
        description: 'Another description',
        extra: 'Extra info',
        color: '#FFFFFF'
      }

      const lookupUrl = url + `/${id}`
      const res = await request(app)
        .put(lookupUrl)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
        .send(expected)
      expect(res.status).toBe(200)

      expect(res.body.id).toBe(id)
      expect(res.body.pictureUrl).toBe(expected.pictureUrl)
      expect(res.body.name).toBe(expected.name)
      expect(res.body.description).toBe(expected.description)
      expect(res.body.extra).toBe(expected.extra)
      expect(res.body.color).toBe(expected.color)
    })

    it('Rejects for a category to be edited if user is not an admin', async () => {
      await db.seed.run()
      const original : CreateCategoryRequest = {
        name: 'Testing Category to Edit',
        type: 'TO_USER',
        pictureUrl: 'http://google.com',
        description: 'Sample description',
        extra: 'Extra information',
        color: '#000000'
      }

      const resCreation = await request(app)
        .post(url)
        .send(original)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)

      expect(resCreation.status).toBe(403)
    })


    it('Raises a not found error on invalid id', async() => {
      const id = -1
      const lookupUrl = url + `/${id}`
      const res = await request(app)
        .put(lookupUrl)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)

      expect(res.status).toBe(404)
    })
  })

  describe('Category deletion', () => {
    const url = `${baseUrl}/categories`

    it('Allows for a category to be deleted', async () => {
      await db.seed.run()
      const expected : CreateCategoryRequest = {
        name: 'Testing Category to Delete',
        type: 'TO_USER',
        pictureUrl: 'http://google.com',
        description: 'Sample description',
        extra: 'Extra information',
        color: '#000000'
      }

      const resCreation = await request(app)
        .post(url)
        .send(expected)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)

      expect(resCreation.status).toBe(201)

      const id = resCreation.body[0].id
      expect(id).toBeDefined()

      const lookupUrl = url + `/${id}`
      const res = await request(app)
        .delete(lookupUrl)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)

      expect(res.status).toBe(200)
      expect(res.body.id).toBe(id)

      const category = await getCategoryById(id)
      expect(category).toBeUndefined()
    })

    it('Reject for a category to be deleted if token user is not an admin', async () => {
      await db.seed.run()
      const expected : CreateCategoryRequest = {
        name: 'Testing Category to Delete',
        type: 'TO_USER',
        pictureUrl: 'http://google.com',
        description: 'Sample description',
        extra: 'Extra information',
        color: '#000000'
      }

      const resCreation = await request(app)
        .post(url)
        .send(expected)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)

      expect(resCreation.status).toBe(201)

      const id = resCreation.body[0].id
      expect(id).toBeDefined()

      const lookupUrl = url + `/${id}`
      const res = await request(app)
        .delete(lookupUrl)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)

      expect(res.status).toBe(200)
      expect(res.body.id).toBe(id)

      const category = await getCategoryById(id)
      expect(category).toBeUndefined()
    })


    it('Raises a not found error on invalid id', async() => {
      const id = -1
      const lookupUrl = url + `/${id}`
      const res = await request(app)
        .delete(lookupUrl)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)

      expect(res.status).toBe(404)
    })

    it('Raises a not found error on not found id', async() => {
      const id = 0
      const lookupUrl = url + `/${id}`
      const res = await request(app)
        .delete(lookupUrl)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)

      expect(res.status).toBe(404)
    })
  })
})
