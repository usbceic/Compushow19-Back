import { checkSchema } from 'express-validator'
import { categoryExistsByName } from './models'

export const categorySchemaValidator = checkSchema({
  name: {
    exists: {
      options: {
        checkNull: true
      },
      errorMessage: 'name.REQUIRED',
    },
    in: ['body'],
    isString: {
      errorMessage: 'name.STRING'
    },
    isLength: {
      errorMessage: 'name.LENGTH_NOT_VALID',
      options: {
        min: 1,
        max: 50
      }
    },
    custom: {
      options: async (value) => {
        if (value === undefined || value === null) {
          return Promise.reject('name.UNIQUE')
        }
        const exists = await categoryExistsByName(value)
        if (exists) {
          return Promise.reject('name.UNIQUE')
        }
      }
    }
  },
  type: {
    exists: {
      options: {
        checkNull: true
      },
      errorMessage: 'type.REQUIRED',
    },
    in: ['body'],
    isString: {
      errorMessage: 'type.STRING'
    },
    isLength: {
      errorMessage: 'type.LENGTH_NOT_VALID',
      options: {
        min: 7,
        max: 12
      }
    },
    isIn: {
      options: ['TO_USER', 'TO_TWO_USERS', 'ONLY_EXTRA'],
      errorMessage: 'type.INVALID_VALUE'
    },
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
  description: {
    exists: {
      options: {
        checkNull: true
      },
      errorMessage: 'description.REQUIRED',
    },
    in: ['body'],
    isString: {
      errorMessage: 'description.STRING'
    },
    isLength: {
      errorMessage: 'description.LENGTH_NOT_VALID',
      options: {
        min: 1,
        max: 255
      }
    }
  },
  pictureUrl: {
    exists: {
      options: {
        checkNull: true
      },
      errorMessage: 'pictureUrl.REQUIRED',
    },
    in: ['body'],
    isString: {
      errorMessage: 'pictureUrl.STRING'
    },
    isLength: {
      errorMessage: 'pictureUrl.LENGTH_NOT_VALID',
      options: {
        min: 1,
        max: 255
      }
    },
    isURL: {
      errorMessage: 'pictureUrl.URL'
    },
  },
  color: {
    exists: {
      options: {
        checkNull: true
      },
      errorMessage: 'color.REQUIRED',
    },
    in: ['body'],
    isString: {
      errorMessage: 'color.STRING'
    },
    isLength: {
      errorMessage: 'color.LENGTH_NOT_VALID',
      options: {
        min: 1,
        max: 50
      }
    }
  },
})

export const updateCategorySchemaValidator = checkSchema({
  categoryId: {
    in: ['params'],
    exists: {
      options: {
        checkNull: true
      },
      errorMessage: 'id.REQUIRED',
    },
    isInt: {
      errorMessage: 'id.INT'
    }
  },
  name: {
    optional: true,
    exists: {
      options: {
        checkNull: true
      },
      errorMessage: 'name.REQUIRED',
    },
    in: ['body'],
    isString: {
      errorMessage: 'name.STRING'
    },
    isLength: {
      errorMessage: 'name.LENGTH_NOT_VALID',
      options: {
        min: 1,
        max: 50
      }
    }
  },
  extra: {
    in: ['body'],
    optional: true,
    isString: {
      errorMessage: 'extra.STRING'
    },
  },
  description: {
    optional: true,
    exists: {
      options: {
        checkNull: true
      },
      errorMessage: 'description.REQUIRED',
    },
    in: ['body'],
    isString: {
      errorMessage: 'description.STRING'
    },
    isLength: {
      errorMessage: 'description.LENGTH_NOT_VALID',
      options: {
        min: 1,
        max: 255
      }
    }
  },
  pictureUrl: {
    optional: true,
    exists: {
      options: {
        checkNull: true
      },
      errorMessage: 'pictureUrl.REQUIRED',
    },
    in: ['body'],
    isString: {
      errorMessage: 'pictureUrl.STRING'
    },
    isLength: {
      errorMessage: 'pictureUrl.LENGTH_NOT_VALID',
      options: {
        min: 1,
        max: 255
      }
    },
    isURL: {
      errorMessage: 'pictureUrl.URL'
    },
  },
  color: {
    optional: true,
    exists: {
      options: {
        checkNull: true
      },
      errorMessage: 'color.REQUIRED',
    },
    in: ['body'],
    isString: {
      errorMessage: 'color.STRING'
    },
    isLength: {
      errorMessage: 'color.LENGTH_NOT_VALID',
      options: {
        min: 1,
        max: 50
      }
    }
  },
})

export const categoryLookupSchemaValidator = checkSchema({
  categoryId: {
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

export const categoryNameLookupSchemaValidator = checkSchema({
  categoryName: {
    in: ['params'],
    exists: {
      options: {
        checkNull: true
      },
      errorMessage: 'name.REQUIRED'
    },
    isString: {
      errorMessage: 'name.STRING'
    }
  }
})