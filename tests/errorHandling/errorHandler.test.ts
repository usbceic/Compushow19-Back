import HttpError from '../../src/errorHandling/httpError'

var assert = require('assert')

describe('Error Handler', () => {
  
  test('Return HTTP error code 400', () => {
    try {
      throw new HttpError(400)
    } catch (e) {
      assert.deepEqual(e, 
        {
          status: 400,
          title: 'Bad Request',
          message: 'A validation failed',
          userMessage: 'An error has ocurred',
        }
      )
    }
  })

  test('Return HTTP error code 401', () => {
    try {
      throw new HttpError(401)
    } catch (e) {
      assert.deepEqual(e, 
        {
          status: 401,
          title: 'Unauthorized',
          message: 'Not authenticated',
          userMessage: 'Client needs to authenticate',
        }
      )
    }
  })

  test('Return HTTP error code 403', () => {
    try {
      throw new HttpError(403)
    } catch (e) {
      assert.deepEqual(e, 
        {
          status: 403,
          title: 'Forbidden',
          message: 'Cannot Access',
          userMessage: 'Client cannot access this resource',
        }
      )
    }
  })

  test('Return HTTP error code 500', () => {
    try {
      throw new HttpError(500)
    } catch (e) {
      assert.deepEqual(e, 
        {
          status: 500,
          title: 'Internal Server Error',
          message: 'An error has ocurred',
          userMessage: 'An error has ocurred',
        }
      )
    }
  })

  test('Request invalid code 999', () => {
    try {
      throw new HttpError(999)
    } catch (e) {
      assert.deepEqual(e, 
        {
          status: 0,
          title: '',
          message: '',
          userMessage: '',
        }
      )
    }
  })
})