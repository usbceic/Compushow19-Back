import { db } from '../../src/config'
import request from 'supertest'
import app from '../../src/app'
import { OAuth2Client } from 'google-auth-library'
import { CreateNominationRequest } from '../../src/nominations/objects'
import { insertCategory, getCategoryByName } from '../../src/categories/models'
import { getUserByStudentId } from '../../src/users/models'
import { getNominationByUserAndCategory } from '../../src/nominations/models'
import { RegisteredUser } from '../../src/users/objects'
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

describe('Nomination management', () => {
  const baseUrl = '/v1/api'

  describe('Empty nomination listing', () => {
    const url = `${baseUrl}/nominations`

    it('Allows empty nomination listing as admin', async () => {
      await db.seed.run()
      const emptyCategoriesResponse = await request(app)
        .get(url)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      expect(emptyCategoriesResponse.status).toBe(200)
      expect(emptyCategoriesResponse.body).toStrictEqual([])
    })

    it('Allows empty nomination listing as user', async () => {
      await db.seed.run()
      const emptyCategoriesResponse = await request(app)
        .get(url)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(emptyCategoriesResponse.status).toBe(200)
      expect(emptyCategoriesResponse.body).toStrictEqual([])
    })
  })

  describe('Nomination creation', () => {
    const url = `${baseUrl}/nominations`

    it('Allows for nomination creation as an admin', async () => {
      await insertCategory({
        name: 'Test Category',
        type: 'TO_USER',
        pictureUrl: 'http://google.com',
        description: 'Sample description',
        extra: 'Extra information',
        color: '#000000'
      })
      const adminUser = await getUserByStudentId('id-1') as RegisteredUser
      const category = await getCategoryByName('Test Category')
      const nominee = await getUserByStudentId('id-1')
      const expected : CreateNominationRequest = {
        categoryId: category.id,
        mainNominee: nominee.id
      }

      const res = await request(app)
        .post(url)
        .send(expected)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      expect(res.status).toBe(201)

      const nomination = await getNominationByUserAndCategory(
        adminUser.id,
        category.id
      )
      expect(nomination).toBeDefined()

      expect(nomination.userId).toBe(adminUser.id)
      expect(nomination.categoryId).toBe(expected.categoryId)
      expect(nomination.mainNominee).toBe(expected.mainNominee)
    })

    it('Allows for nomination creation as an user', async () => {
      await insertCategory({
        name: 'Test Category2',
        type: 'TO_USER',
        pictureUrl: 'http://google.com',
        description: 'Sample description',
        extra: 'Extra information',
        color: '#000000'
      })
      const nonAdminUser = await getUserByStudentId('id-2') as RegisteredUser
      const category = await getCategoryByName('Test Category2')
      const nominee = await getUserByStudentId('id-1')
      const expected : CreateNominationRequest = {
        categoryId: category.id,
        mainNominee: nominee.id
      }

      const res = await request(app)
        .post(url)
        .send(expected)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(res.status).toBe(201)

      const nomination = await getNominationByUserAndCategory(
        nonAdminUser.id,
        category.id
      )
      expect(nomination).toBeDefined()

      expect(nomination.userId).toBe(nonAdminUser.id)
      expect(nomination.categoryId).toBe(expected.categoryId)
      expect(nomination.mainNominee).toBe(expected.mainNominee)
    })

    it('Allows for nomination creation as an user with extra information', async () => {
      await insertCategory({
        name: 'Test Categorie',
        type: 'TO_USER',
        pictureUrl: 'http://google.com',
        description: 'Sample description',
        extra: 'Extra information',
        color: '#000000'
      })
      const nonAdminUser = await getUserByStudentId('id-2') as RegisteredUser
      const category = await getCategoryByName('Test Categorie')
      const nominee = await getUserByStudentId('id-1')
      const expected : CreateNominationRequest = {
        categoryId: category.id,
        mainNominee: nominee.id,
        extra: 'Extra information'
      }

      const res = await request(app)
        .post(url)
        .send(expected)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(res.status).toBe(201)

      const nomination = await getNominationByUserAndCategory(
        nonAdminUser.id,
        category.id
      )
      expect(nomination).toBeDefined()

      expect(nomination.userId).toBe(nonAdminUser.id)
      expect(nomination.categoryId).toBe(expected.categoryId)
      expect(nomination.mainNominee).toBe(expected.mainNominee)
      expect(nomination.extra).toBe(expected.extra)
    })

    it('Rejects nomination creation with no authorization', async () => {
      const nominee = await getUserByStudentId('id-1')
      await insertCategory({
        name: 'Test Category3',
        type: 'TO_USER',
        pictureUrl: 'http://google.com',
        description: 'Sample description',
        extra: 'Extra information',
        color: '#000000'
      })
      const category = await getCategoryByName('Test Category3')
      const expected : CreateNominationRequest = {
        categoryId: category.id,
        mainNominee: nominee.id
      }

      const res = await request(app)
        .post(url)
        .send(expected)
      expect(res.status).toBe(401)
    })

    it('Rejects nomination creation with invalid category', async () => {
      const nominee = await getUserByStudentId('id-1')
      const expected : CreateNominationRequest = {
        categoryId: -1,
        mainNominee: nominee.id
      }

      const res = await request(app)
        .post(url)
        .send(expected)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(res.status).toBe(400)
    })

    it('Rejects nomination creation with non existant category', async () => {
      const nominee = await getUserByStudentId('id-1')
      const expected : CreateNominationRequest = {
        categoryId: 0,
        mainNominee: nominee.id
      }

      const res = await request(app)
        .post(url)
        .send(expected)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(res.status).toBe(400)
    })

    it('Rejects nomination creation with invalid main nominee', async () => {
      const category = await getCategoryByName('Test Category')
      const expected : CreateNominationRequest = {
        mainNominee: -1,
        categoryId: category.id
      }

      const res = await request(app)
        .post(url)
        .send(expected)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(res.status).toBe(400)
    })

    it('Rejects nomination creation with non existant main nominee', async () => {
      const category = await getCategoryByName('Test Category')
      const expected : CreateNominationRequest = {
        mainNominee: 0,
        categoryId: category.id
      }

      const res = await request(app)
        .post(url)
        .send(expected)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(res.status).toBe(400)
    })

    it('Rejects nomination creation with invalid aux nominee', async () => {
      const category = await getCategoryByName('Test Category')
      const expected : CreateNominationRequest = {
        auxNominee: -1,
        categoryId: category.id
      }

      const res = await request(app)
        .post(url)
        .send(expected)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(res.status).toBe(400)
    })

    it('Rejects nomination creation with non existant aux nominee', async () => {
      const category = await getCategoryByName('Test Category')
      const expected : CreateNominationRequest = {
        auxNominee: 0,
        categoryId: category.id
      }

      const res = await request(app)
        .post(url)
        .send(expected)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(res.status).toBe(400)
    })
  })

  describe('Nomination deletion', () => {
    const url = `${baseUrl}/nominations`

    it('Allows a nomination to be deleted by the user who made it', async () => {
      await insertCategory({
        name: 'Test cat for deletion',
        type: 'TO_USER',
        pictureUrl: 'http://google.com',
        description: 'Sample description',
        extra: 'Extra information',
        color: '#000000'
      })
      const nonAdminUser = await getUserByStudentId('id-2') as RegisteredUser
      const category = await getCategoryByName('Test cat for deletion')
      const nominee = await getUserByStudentId('id-1')
      const expected : CreateNominationRequest = {
        categoryId: category.id,
        mainNominee: nominee.id
      }

      const resCreation = await request(app)
        .post(url)
        .send(expected)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(resCreation.status).toBe(201)

      const nomination = await getNominationByUserAndCategory(
        nonAdminUser.id,
        category.id
      )
      expect(nomination).toBeDefined()

      const res = await request(app)
        .delete(`${url}/${nomination.id}`)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(res.status).toBe(200)

      const deletedNomination = await getNominationByUserAndCategory(
        nonAdminUser.id,
        category.id
      )
      expect(deletedNomination).toBeUndefined()
    })

    it('Rejects a nomination from being deleted by a non-admin user who did not make it', async () => {
      await insertCategory({
        name: 'Test cat for deletion3',
        type: 'TO_USER',
        pictureUrl: 'http://google.com',
        description: 'Sample description',
        extra: 'Extra information',
        color: '#000000'
      })
      const adminUser = await getUserByStudentId('id-1') as RegisteredUser
      const category = await getCategoryByName('Test cat for deletion3')
      const nominee = await getUserByStudentId('id-1')
      const expected : CreateNominationRequest = {
        categoryId: category.id,
        mainNominee: nominee.id
      }

      const resCreation = await request(app)
        .post(url)
        .send(expected)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      expect(resCreation.status).toBe(201)

      const nomination = await getNominationByUserAndCategory(
        adminUser.id,
        category.id
      )
      expect(nomination).toBeDefined()

      const res = await request(app)
        .delete(`${url}/${nomination.id}`)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(res.status).toBe(403)

      const deletedNomination = await getNominationByUserAndCategory(
        adminUser.id,
        category.id
      )
      expect(deletedNomination).toBeDefined()
    })

    it('Rejects a nomination from being deleted without authorization', async () => {
      await insertCategory({
        name: 'Test cat for deletion4',
        type: 'TO_USER',
        pictureUrl: 'http://google.com',
        description: 'Sample description',
        extra: 'Extra information',
        color: '#000000'
      })
      const category = await getCategoryByName('Test cat for deletion4')
      const nominee = await getUserByStudentId('id-1')
      const adminUser = await getUserByStudentId('id-1') as RegisteredUser
      const expected : CreateNominationRequest = {
        categoryId: category.id,
        mainNominee: nominee.id
      }

      const resCreation = await request(app)
        .post(url)
        .send(expected)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      expect(resCreation.status).toBe(201)

      const nomination = await getNominationByUserAndCategory(
        adminUser.id,
        category.id
      )
      expect(nomination).toBeDefined()

      const res = await request(app)
        .delete(`${url}/${nomination.id}`)
      expect(res.status).toBe(401)
    })

    it('Rejects a nomination from being deleted with an invalid ID', async () => {
      const res = await request(app)
        .delete(`${url}/-1`)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      expect(res.status).toBe(404)
    })

    it('Rejects a nomination from being deleted with a non existing ID', async () => {
      const res = await request(app)
        .delete(`${url}/0`)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      expect(res.status).toBe(404)
    })

    it('Rejects a nomination from being deleted with a string', async () => {
      const res = await request(app)
        .delete(`${url}/testy`)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      expect(res.status).toBe(404)
    })

    it('Allows a nomination to be deleted by an admin', async () => {
      await insertCategory({
        name: 'Test cat for deletion2',
        type: 'TO_USER',
        pictureUrl: 'http://google.com',
        description: 'Sample description',
        extra: 'Extra information',
        color: '#000000'
      })
      const nonAdminUser = await getUserByStudentId('id-2') as RegisteredUser
      const category = await getCategoryByName('Test cat for deletion2')
      const nominee = await getUserByStudentId('id-1')
      const expected : CreateNominationRequest = {
        categoryId: category.id,
        mainNominee: nominee.id
      }

      const resCreation = await request(app)
        .post(url)
        .send(expected)
        .set('Authorization', `Bearer ${NON_ADMIN_TOKEN}`)
      expect(resCreation.status).toBe(201)

      const nomination = await getNominationByUserAndCategory(
        nonAdminUser.id,
        category.id
      )
      expect(nomination).toBeDefined()

      const res = await request(app)
        .delete(`${url}/${nomination.id}`)
        .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
      expect(res.status).toBe(200)

      const deletedNomination = await getNominationByUserAndCategory(
        nonAdminUser.id,
        category.id
      )
      expect(deletedNomination).toBeUndefined()
    })
  })
})