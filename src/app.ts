import express from 'express'
import errorHandler from './errorHandling/errorHandler'
import calculatorRoutes from './calculator/routes'

const app = express()

app.use('/health', (req, res) => {
  res.json({ status: 'UP' })
})

app.use('/calculate', calculatorRoutes)
app.use(errorHandler)

export default app
