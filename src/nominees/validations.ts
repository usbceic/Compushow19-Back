import { checkSchema } from 'express-validator'
import { categoryExistsById } from '../categories/models'

export const nomineesByCategorySchemaValidator = checkSchema({
  categoryId: {
    exists: {
      options: {
        checkNull: true
      },
      errorMessage: 'categoryId.REQUIRED'
    },
    in: 'params',
    isInt: {
      errorMessage: 'categoryId.INT'
    },
    custom: {
      options: async (value) => {
        if (value === undefined || value === null) {
          return Promise.reject('categoryId.MUST_EXIST')
        }
        const exists = await categoryExistsById(value)
        if (!exists) {
          return Promise.reject('categoryId.MUST_EXIST')
        }
      }
    }
  }
})