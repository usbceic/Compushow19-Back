/* istanbul ignore file */

import ErrorObjectInterface, {ErrorDetailInterface} from './models' // eslint-disable-line no-unused-vars

export default abstract class HttpError extends Error implements ErrorObjectInterface {
  status: number = 0
  title: string = ''
  message: string = ''
  userMessage: string = ''
  errors?: ErrorDetailInterface[]
  constructor() {
    super()
    Object.setPrototypeOf(this, HttpError.prototype)
  }
}

export class BadRequestError extends HttpError {
  constructor(errors: ErrorDetailInterface[] = []) {
    super()
    this.status = 400
    this.title = 'Bad Request'
    this.message = 'A validation failed or the request was bad formatted'
    this.userMessage = 'A validation failed'
    if (errors.length !== 0) {
      this.errors = errors
    }
  }
}

export class UnauthenticatedError extends HttpError {
  constructor() {
    super()
    this.status = 401
    this.title = 'Unauthenticated'
    this.message = 'Not authenticated'
    this.userMessage = 'Client needs to authenticate'
  }
}

export class UnauthorizedError extends HttpError {
  constructor() {
    super()
    this.status = 403
    this.title = 'Forbidden'
    this.message = 'Cannot Access'
    this.userMessage = 'Client cannot access this resource'
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = 'The requested resource was not found') {
    super()
    this.status = 404
    this.title = 'Not found'
    this.message = message
    this.userMessage = 'Not found'
  }
}


export class InternalServerError extends HttpError {
  constructor() {
    super()
    this.status = 500
    this.title = 'Internal Server Error'
    this.message = 'An error has ocurred'
    this.userMessage = 'An error has ocurred'
  }
}
