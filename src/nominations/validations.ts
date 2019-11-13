import { checkSchema } from 'express-validator'
import { categoryExistsById, getCategoryById } from '../categories/models'
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
      options: async (value, { req }) => {
        if (value === undefined || value === null) {
          return Promise.reject('categoryId.MUST_EXIST')
        }
        const exists = await categoryExistsById(value)
        if (!exists) {
          return Promise.reject('categoryId.MUST_EXIST')
        }
        const category = await getCategoryById(value)
        const { mainNominee, auxNominee, extra } = req.body
        switch (category.type) {
          case 'ONLY_EXTRA':
            if (mainNominee !== undefined && mainNominee !== null) {
              return Promise.reject('categoryId.ONLY_EXTRA.MUST_NOT_HAVE_MAIN_NOMINEE')
            }
            if (auxNominee !== undefined && auxNominee !== null) {
              return Promise.reject('categoryId.ONLY_EXTRA.MUST_NOT_HAVE_AUX_NOMINEE')
            }
            if (extra === undefined || extra === null) {
              return Promise.reject('categoryId.ONLY_EXTRA.MUST_HAVE_EXTRA')
            }
            break
          case 'TO_USER':
            if (mainNominee === undefined || mainNominee === null) {
              return Promise.reject('categoryId.TO_USER.MUST_HAVE_MAIN_NOMINEE')
            }
            if (auxNominee !== undefined && auxNominee !== null) {
              return Promise.reject('categoryId.TO_USER.MUST_NOT_HAVE_AUX_NOMINEE')
            }
            break
          case 'TO_TWO_USERS':
            if (mainNominee === undefined || mainNominee === null) {
              return Promise.reject('categoryId.TO_USER.MUST_HAVE_MAIN_NOMINEE')
            }
            if (auxNominee === undefined || auxNominee === null) {
              return Promise.reject('categoryId.TO_USER.MUST_HAVE_AUX_NOMINEE')
            }
            break
          case 'TO_USER_WITH_EXTRA':
            if (mainNominee === undefined || mainNominee === null) {
              return Promise.reject('categoryId.TO_USER.MUST_HAVE_MAIN_NOMINEE')
            }
            if (auxNominee !== undefined && auxNominee !== null) {
              return Promise.reject('categoryId.TO_USER.MUST_NOT_HAVE_AUX_NOMINEE')
            }
            if (extra === undefined || extra === null) {
              return Promise.reject('categoryId.ONLY_EXTRA.MUST_HAVE_EXTRA')
            }
            break
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
        min: 1,
        max: 255
      }
    },
  }
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