import express from 'express'
import { asyncWrap } from '../utils'
import { createUser } from './service'

const router = express.Router()

router.post('/users', asyncWrap(async (req, res) => {
  const user = await createUser({
    fullName: req.body.fullName,
    email: req.body.email,
    canVote: req.body.canVote,
    profileUrl: req.body.profileUrl,
    studentId: req.body.studentId
  })
  res.status(204).json(user)
}))

export default router
