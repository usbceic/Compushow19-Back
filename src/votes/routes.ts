import express from 'express'
import { asyncWrap } from '../utils'
import { createVote } from './service'
import { CreateVoteRequest } from './objects'
import { RegisteredUser } from '../users/objects'
import { getUserVoteOnCategory } from './models'
import { NotFoundError } from '../errorHandling/httpError'

const router = express.Router()

router.post('', asyncWrap(async (req, res) => {
  const body : CreateVoteRequest = req.body
  const user: RegisteredUser = req.user as RegisteredUser
  const voteValid = await createVote(body.nomineeId, user.id)
  if (voteValid === undefined) {
    res.status(409).send({
      'message': 'Ya has votado por esta categoría'
    })
  } else {
    res.status(204).send({})
  }
}))

router.get('/byCategory/:categoryId([0-9]+)', asyncWrap(async (req, res) => {
  const user: RegisteredUser = req.user as RegisteredUser
  const categoryId = +req.params.categoryId
  const vote = await getUserVoteOnCategory(user.id, categoryId)
  if (vote === undefined) {
    throw new NotFoundError()
  } else {
    res.status(200).json(vote)
  }
}))

export default router
