import { checkSchema } from 'express-validator'
import { existsByEmailAddress } from './models'

export const userSchemaValidator = checkSchema({
  fullName: {
    exists: {
      options: {
        checkNull: true
      },
      errorMessage: 'fullName.REQUIRED',
    },
    in: ['body'],
    isString: {
      errorMessage: 'fullName.STRING'
    },
    isLength: {
      errorMessage: 'fullName.LENGTH_NOT_VALID',
      options: {
        min: 1,
        max: 50
      }
    }
  },
  email: {
    in: ['body'],
    isEmail: {
      errorMessage: 'email.EMAIL',
    },
    isString: {
      errorMessage: 'email.STRING',
    },
    exists: {
      options: {
        checkNull: true
      },
      errorMessage: 'email.REQUIRED',
    },
    isLength: {
      errorMessage: 'email.LENGTH_NOT_VALID',
      options: {
        min: 1,
        max: 50
      }
    },
    custom: {
      options: async (value) => {
        const exists = await existsByEmailAddress(value)
        if (exists) {
          return Promise.reject('email.UNIQUE')
        }
      }
    }
  }
})