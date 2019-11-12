import express from 'express'
import expressWinston from 'express-winston'
import winston from 'winston'
import errorHandler from './errorHandling/errorHandler'
import userRoutes from './users/routes'
import categoryRoutes from './categories/routes'
import { NODE_ENV } from './config'

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

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/health', (req, res) => {
  res.json({ status: 'UP' })
})

app.use('/v1/api', userRoutes)
app.use('/v1/api', categoryRoutes)

app.use(errorHandler)

export default app
