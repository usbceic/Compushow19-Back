import {
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
  InternalServerError,
  NotFoundError
} from '../../src/errorHandling/httpError'
import request from 'supertest'
import app from '../../src/app'
import errorHandler from '../../src/errorHandling/errorHandler'

app.get('/http400', () => {
  throw new BadRequestError()
})

app.get('/http400-with-list', () => {
  throw new BadRequestError([{
    field: 'field',
    validationCode: 'field.invalid'
  }])
})

app.get('/http401', () => {
  throw new UnauthenticatedError()
})

app.get('/http403', () => {
  throw new UnauthorizedError()
})

app.get('/http404', () => {
  throw new NotFoundError()
})

app.get('/http500', () => {
  throw new InternalServerError()
})

app.get('/genericerror', () => {
  throw new Error()
})

app.use(errorHandler)

describe('Error Handler', () => {

  test('Return HTTP error code 400', async () => {
    await request(app)
      .get('/http400')
      .expect(400)
      .expect({
        status: 400,
        title: 'Bad Request',
        message: 'A validation failed or the request was bad formatted',
        userMessage: 'A validation failed',
      })
  })

  test('Return HTTP error code 400 with error list', async () => {
    await request(app)
      .get('/http400-with-list')
      .expect(400)
      .expect({
        status: 400,
        title: 'Bad Request',
        message: 'A validation failed or the request was bad formatted',
        userMessage: 'A validation failed',
        errors: [{
          field: 'field',
          validationCode: 'field.invalid'
        }]
      })
  })

  test('Return HTTP error code 401', async () => {
    await request(app)
      .get('/http401')
      .expect(401)
      .expect({
        status: 401,
        title: 'Unauthenticated',
        message: 'Not authenticated',
        userMessage: 'Client needs to authenticate',
      })
  })

  test('Return HTTP error code 403', async () => {
    await request(app)
      .get('/http403')
      .expect(403)
      .expect({
        status: 403,
        title: 'Forbidden',
        message: 'Cannot Access',
        userMessage: 'Client cannot access this resource',
      })
  })

  test('Return HTTP error code 404', async () => {
    await request(app)
      .get('/http404')
      .expect(404)
      .expect({
        status: 404,
        title: 'Not found',
        message: 'The requested resource was not found',
        userMessage: 'Not found',
      })
  })

  test('Return HTTP error code 500', async () => {
    await request(app)
      .get('/http500')
      .expect(500)
      .expect({
        status: 500,
        title: 'Internal Server Error',
        message: 'An error has ocurred',
        userMessage: 'An error has ocurred',
      })
  })
  test('Return HTTP error code 500 on unknown errors', async () => {
    await request(app)
      .get('/genericerror')
      .expect(500)
      .expect({
        status: 500,
        title: 'Internal Server Error',
        message: 'An error has ocurred',
        userMessage: 'An error has ocurred',
      })
  })

})
