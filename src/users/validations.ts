import { checkSchema } from 'express-validator'

export const userSchemaValidator = checkSchema({
  fullName: {
    exists: {
      options: {
        checkNull: true
      },
      errorMessage: 'fullName.REQUIRED',
    },
    in: ['body']
  }
})