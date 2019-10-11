import { checkSchema } from 'express-validator'

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
  }
})