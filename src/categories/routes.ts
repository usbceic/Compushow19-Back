import express from 'express'
import { asyncWrap, validateRequest } from '../utils'
import { createCategory } from './service'
import { categorySchemaValidator } from './validations'

const router = express.Router()

router.post('/categories', validateRequest(categorySchemaValidator), asyncWrap(async (req, res) => {
  const category = await createCategory({
    name: req.body.name,
    type: req.body.type,
    extra: req.body.extra,
    description: req.body.description,
    pictureUrl: req.body.pictureUrl,
    color: req.body.color
  })
  res.status(201).json(category)
}))

export default router