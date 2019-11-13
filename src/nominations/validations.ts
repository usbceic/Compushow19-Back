import { checkSchema } from 'express-validator'
import { categoryExistsById } from '../categories/models'
import { existsByUserId } from '../users/models'

export const nominationSchemaValidator = checkSchema({
  categoryId: {
    exists: {
      options: {
        checkNull: true
      },
      errorMessage: 'categoryId.REQUIRED'
    },
    in: ['body'],
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
  },
  mainNominee: {
    in: ['body'],
    optional: true,
    isInt: {
      errorMessage: 'mainNominee.INT'
    },
    custom: {
      options: async (value) => {
        if (value === undefined || value === null) {
          return Promise.reject('mainNominee.MUST_EXIST')
        }
        const exists = await existsByUserId(value)
        if (!exists) {
          return Promise.reject('mainNominee.MUST_EXIST')
        }
      }
    }
  },
  auxNominee: {
    in: ['body'],
    optional: true,
    isInt: {
      errorMessage: 'auxNominee.INT'
    },
    custom: {
      options: async (value) => {
        if (value === undefined || value === null) {
          return Promise.reject('auxNominee.MUST_EXIST')
        }
        const exists = await existsByUserId(value)
        if (!exists) {
          return Promise.reject('auxNominee.MUST_EXIST')
        }
      }
    }
  },
  extra: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'extra.STRING'
    },
    isLength: {
      errorMessage: 'extra.LENGTH_NOT_VALID',
      options: {
        min: 7,
        max: 255
      }
    },
  },
})

export const nominationLookupSchemaValidator = checkSchema({
  nominationId: {
    in: ['params'],
    exists: {
      options: {
        checkNull: true
      },
      errorMessage: 'id.REQUIRED'
    },
    isInt: {
      errorMessage: 'id.INT'
    }
  }
})