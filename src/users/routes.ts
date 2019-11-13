import express from 'express'
import { asyncWrap, validateRequest } from '../utils'
import { createUser, getUser } from './service'
import { userSchemaValidator } from './validations'
import { isAdmin } from '../auth/auth'
import { User } from './objects'
import { UnauthorizedError } from '../errorHandling/httpError'

const router = express.Router()

router.post('', validateRequest(userSchemaValidator), asyncWrap(async (req, res) => {
  if (!isAdmin(req.user as User)) {
    throw new UnauthorizedError()
  }
  const user = await createUser({
    fullName: req.body.fullName,
    email: req.body.email,
    canVote: req.body.canVote,
    profileUrl: req.body.profileUrl,
    studentId: req.body.studentId
  })
  res.status(201).json(user)
}))

router.get('/:userId([0-9]+)', asyncWrap(async (req, res) => {
  const user = await getUser(parseInt(req.params.userId))
  res.status(200).json(user)
}))

export default router
