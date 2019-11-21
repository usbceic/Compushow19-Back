import express from 'express'
import { asyncWrap, validateRequest } from '../utils'
import { nomineeCommentsByCategorySchemaValidator } from './validations'
import { listNomineeCommentsByCategory } from './service'
import { addNomineesToComments, ExtendedNomineeCommentModel } from './models'

const router = express.Router()

router.get('/byCategory/:categoryId([0-9]+)', validateRequest(nomineeCommentsByCategorySchemaValidator), asyncWrap(async (req, res) => {
  const id = Number(req.params.categoryId)
  const comments = await listNomineeCommentsByCategory({
    categoryId: id
  })
  const extendedComments = await addNomineesToComments(comments)
  if (extendedComments.length > 8) {
    var selectedComments : ExtendedNomineeCommentModel[] = []
    var selectedIndexes = []
    while (selectedComments.length < 8) {
      const randomIndex = Math.round(Math.random() * extendedComments.length) % extendedComments.length
      selectedComments.push(extendedComments[randomIndex])
      selectedIndexes.push(randomIndex)
    }
    res.status(200).json(selectedComments)
  } else {
    res.status(200).json(extendedComments)
  }
}))

export default router