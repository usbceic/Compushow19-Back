import ErrorObjectInterface from './models' // eslint-disable-line no-unused-vars

class HttpError extends Error implements ErrorObjectInterface {

  status: number;
  title: string;
  message: string;
  userMessage: string;

  constructor(status: number) {
    super()

    this.status = 0
    this.title = ''
    this.message = ''
    this.userMessage = ''

    switch(status) {
    case 400: { 
      this.status = 400
      this.title = 'Bad Request'
      this.message = 'A validation failed'
      this.userMessage = 'An error has ocurred'
      break
    }
    case 401: { 
      this.status = 401
      this.title = 'Unauthorized'
      this.message = 'Not authenticated'
      this.userMessage = 'Client needs to authenticate'
      break
    } 
    case 403: { 
      this.status = 403
      this.title = 'Forbidden'
      this.message = 'Cannot Access'
      this.userMessage = 'Client cannot access this resource'
      break
    }
    case 500: { 
      this.status = 500
      this.title = 'Internal Server Error'
      this.message = 'An error has ocurred'
      this.userMessage = 'An error has ocurred'
      break
    }
    }
  }
}
 
export default HttpError