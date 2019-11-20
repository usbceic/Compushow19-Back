import express from 'express'
import { asyncWrap } from '../utils'
import { createVote } from './service'
import { CreateVoteRequest } from './objects'
import { RegisteredUser } from '../users/objects'

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

export default router
