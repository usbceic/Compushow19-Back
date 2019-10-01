/* eslint-disable */
import { NextFunction, Request, Response } from 'express' // eslint-disable-line no-unused-vars
import HttpError from './httpError' // eslint-disable-line no-unused-vars

// eslint-disable-next-line no-unused-vars
function errorHandler(error: HttpError, request: Request, response: Response, next: NextFunction) {
  response
    .status(error.status)
    .send(error)
}

export default errorHandler