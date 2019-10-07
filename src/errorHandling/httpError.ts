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
    this.errors = errors
  }
}

export class UnauthenticatedError extends HttpError {
  constructor() {
    super()
    this.status = 401
    this.title = 'Unauthenticated'
    this.message = 'Authentication failure'
    this.userMessage = 'You are not authenticated'
  }
}

export class UnauthorizedError extends HttpError {
  constructor() {
    super()
    this.status = 403
    this.title = 'Unauthorized'
    this.message = 'You are not authorized to access this resource'
    this.userMessage = 'You don\'t have permissions for this'
  }
}

export class NotFoundError extends HttpError {
  constructor() {
    super()
    this.status = 404
    this.title = 'Not found'
    this.message = 'The requested resource was not found'
    this.userMessage = 'Not found'
  }
}


export class InternalServerError extends HttpError {
  constructor() {
    super()
    this.status = 500
    this.title = 'Internal Server Error'
    this.message = 'An error has occurred'
    this.userMessage = 'An error has occurred'
  }
}
