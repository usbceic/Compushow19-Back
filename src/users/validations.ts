import { checkSchema } from 'express-validator'
import { existsByEmailAddress, existsByStudentId } from './models'

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
  },
  canVote: {
    in: ['body'],
    exists: {
      errorMessage: 'canVote.REQUIRED'
    },
    isBoolean: {
      errorMessage: 'canVote.BOOLEAN',
    },
    toBoolean: true
  },
  profileUrl: {
    in: ['body'],
    optional: true,
    isURL: {
      errorMessage: 'profileUrl.URL'
    },
    isString: {
      errorMessage: 'profileUrl.STRING'
    }
  },
  studentId: {
    in: ['body'],
    isString: {
      errorMessage: 'studentId.STRING',
    },
    exists: {
      options: {
        checkNull: true
      },
      errorMessage: 'studentId.REQUIRED',
    },
    isLength: {
      errorMessage: 'studentId.LENGTH_NOT_VALID',
      options: {
        min: 1,
        max: 50
      }
    },
    custom: {
      options: async (value) => {
        const exists = await existsByStudentId(value)
        if (exists) {
          return Promise.reject('studentId.UNIQUE')
        }
      }
    }
  }
})
