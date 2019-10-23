import { Request, Response, NextFunction } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { NotFoundError, BadRequestError } from './errorHandling/httpError'
import { ErrorDetailInterface } from './errorHandling/models'

export const asyncWrap = (fn : (req: Request, res: Response) => Promise<any>) =>
  (req: Request, res: Response, done: NextFunction) => fn(req, res).catch(done)

export const validateRequest = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) : Promise<any> => {
    await Promise.all(validations.map(validation => validation.run(req)))

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    next(new BadRequestError(errors.array().map<ErrorDetailInterface>(error => {
      return {
        field: error.param,
        validationCode: error.msg
      }
    })))
  }
}

export function raise404() : NotFoundError {
  return new NotFoundError()
}