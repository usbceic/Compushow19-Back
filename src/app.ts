import express from 'express'
import expressWinston from 'express-winston'
import winston from 'winston'
import errorHandler from './errorHandling/errorHandler'
import userRoutes from './users/routes'
import categoryRoutes from './categories/routes'
import { NODE_ENV } from './config'
import passport from 'passport'
import {Strategy} from 'passport-http-bearer'
import authorizeWithGoogle from './auth/auth'
import { UnauthorizedError } from './errorHandling/httpError'

const BearerStrategy = Strategy
const app = express()

/* istanbul ignore next */
if (NODE_ENV !== 'test') {
  /* istanbul ignore next */
  app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console()
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
    meta: false,
    msg: 'HTTP {{req.method}} {{req.url}}',
    colorize: true
  }))
}


passport.use(new BearerStrategy((token, done) => {
  authorizeWithGoogle(token)
    .then(user => {
      done(null, user)
    })
    .catch(error => {
      if (error instanceof UnauthorizedError) {
        done(null, false, error.message)
      } else {
        done(null, false, 'Authentication failed')
      }
    })
}))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/health', (req, res) => {
  res.json({ status: 'UP' })
})

app.use('/v1/api/users', userRoutes)
app.use('/v1/api/categories', categoryRoutes)

app.use(errorHandler)

export default app
