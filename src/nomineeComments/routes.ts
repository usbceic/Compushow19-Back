import express from 'express'
import { asyncWrap, validateRequest } from '../utils'
import { nomineeCommentsByCategorySchemaValidator } from './validations'
import { listNomineeCommentsByCategory } from './service'
import { addNomineesToComments } from './models'

const router = express.Router()

router.get('/byCategory/:categoryId([0-9]+)', validateRequest(nomineeCommentsByCategorySchemaValidator), asyncWrap(async (req, res) => {
  const id = Number(req.params.categoryId)
  const nominees = await listNomineeCommentsByCategory({
    categoryId: id
  })
  const extendedNominees = await addNomineesToComments(nominees)
  res.status(200).json(extendedNominees)
}))

export default router