import express from 'express'
import { asyncWrap, validateRequest } from '../utils'
import { createUser } from './service'
import { userSchemaValidator } from './validations'

const router = express.Router()

router.post('/users', validateRequest(userSchemaValidator), asyncWrap(async (req, res) => {
  const user = await createUser({
    fullName: req.body.fullName,
    email: req.body.email,
    canVote: req.body.canVote,
    profileUrl: req.body.profileUrl,
    studentId: req.body.studentId
  })
  res.status(201).json(user)
}))

export default router
