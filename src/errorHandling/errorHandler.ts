/* eslint-disable */
import { NextFunction, Request, Response } from 'express' // eslint-disable-line no-unused-vars
import HttpError, { InternalServerError, BadRequestError } from './httpError' // eslint-disable-line no-unused-vars

// eslint-disable-next-line no-unused-vars
function errorHandler(error: Error, request: Request, response: Response, next: NextFunction) {
  if (error instanceof HttpError) {
    response
      .status(error.status)
      .send(error)
  } else {
    response.status(500).send(new InternalServerError())
  }
}

export default errorHandler