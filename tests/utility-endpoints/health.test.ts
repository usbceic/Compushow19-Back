import request from 'supertest'
import app from '../../src/app'

describe('/health endpoint', () => {
  test('returns http status code 200', () => {
    return request(app)
      .get('/health')
      .expect(200)
      .expect({
        status: 'UP'
      })
  })
})
