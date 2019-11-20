import express from 'express'
import { asyncWrap, validateRequest } from '../utils'
import { nomineesByCategorySchemaValidator } from './validations'
import { listNomineesByCategory } from './service'

const router = express.Router()

router.get('/byCategory/:categoryId([0-9]+)', validateRequest(nomineesByCategorySchemaValidator), asyncWrap(async (req, res) => {
  const id = Number(req.params.categoryId)
  const nominees = await listNomineesByCategory({
    categoryId: id
  })
  res.status(200).json(nominees)
}))

export default router