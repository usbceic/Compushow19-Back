import {db} from '../../src/config'
import {getAllUsers} from '../../src/users/models'
import request from 'supertest'
import app from '../../src/app'

beforeAll(async () => {
  await db.migrate.latest()
  return await db.seed.run()
})

describe('User management', () => {
  const baseUrl = '/v1/api'
  it('Allows user creation', () => {
    getAllUsers().then(users => console.log(users))
    return request(app)
      .post(`${baseUrl}/users`)
      .send({
        fullName: 'Test User',
        email: 'test@test.com',
        telegramHandle: '@testuser',
        canVote: true,
        profileUrl: 'https://photo.url',
        studentId: '11-11111'
      })
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(async (res) => {
        console.log(res.body)
        await getAllUsers()
      })
  })
})
