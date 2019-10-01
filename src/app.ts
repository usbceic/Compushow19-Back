import express from 'express'
import errorHandler from './errorHandling/errorHandler'

const app = express()

app.use('/health', (req, res) => {
  res.json({ status: 'UP' })
})

app.use(errorHandler)

export default app
