import express from 'express'
import { asyncWrap, validateRequest, raise404 } from '../utils'
import { listNominations, getNomination, getUserNominations, getCategoryNominations, getUserCategoryNomination, createNomination, deleteNomination } from './service'
import { nominationLookupSchemaValidator, nominationSchemaValidator } from './validations'
import { RegisteredUser } from '../users/objects'
import { categoryLookupSchemaValidator } from '../categories/validations'
import { UnauthorizedError } from '../errorHandling/httpError'
import { isAdmin } from '../auth/auth'
import { getUserByUserId } from '../users/models'
import { ExtendedNominationModel } from './models'

const router = express.Router()

router.get('', asyncWrap(async (req, res) => {
  var nominations : ExtendedNominationModel[]
  if (isAdmin(req.user as RegisteredUser)) {
    nominations = await listNominations()
  } else {
    const user = req.user as RegisteredUser
    nominations = (await getUserNominations({
      userId: user.id
    }))
  }

  nominations.forEach((nomination) => {
    if (nomination.mainNominee !== undefined && nomination.mainNominee !== null) {
      getUserByUserId(nomination.mainNominee).then((mainNominee) => {
        nomination.mainNomineeName = mainNominee.fullName
      })
    }

    if (nomination.auxNominee !== undefined && nomination.auxNominee !== null) {
      getUserByUserId(nomination.auxNominee).then((auxNominee) => {
        nomination.mainNomineeName = auxNominee.fullName
      })
    }
  })
  res.status(200).json(nominations)
}))

router.get('/:nominationId([0-9]+)', validateRequest(nominationLookupSchemaValidator), asyncWrap(async (req, res) => {
  const id = Number(req.params.nominationId)
  const nomination = await getNomination({
    id: id
  }) as ExtendedNominationModel
  if (nomination === undefined) {
    res.status(404).json(raise404())
  } else {
    if (!isAdmin(req.user as RegisteredUser) && nomination.userId !== (req.user as RegisteredUser).id) {
      throw new UnauthorizedError()
    }

    if (nomination.mainNominee !== undefined && nomination.mainNominee !== null) {
      const mainNominee = await getUserByUserId(nomination.mainNominee)
      nomination.mainNomineeName = mainNominee.fullName
    }

    if (nomination.auxNominee !== undefined && nomination.auxNominee !== null) {
      const auxNominee = await getUserByUserId(nomination.auxNominee)
      nomination.mainNomineeName = auxNominee.fullName
    }

    res.status(200).json(nomination)
  }
}))

router.get('/byCategory/:categoryId([0-9]+)', validateRequest(categoryLookupSchemaValidator), asyncWrap(async (req, res) => {
  if (!isAdmin(req.user as RegisteredUser)) {
    throw new UnauthorizedError()
  }
  const categoryId = Number(req.params.categoryId)
  const nominations = await getCategoryNominations({
    categoryId: categoryId
  }) as ExtendedNominationModel[]

  nominations.forEach((nomination) => {
    if (nomination.mainNominee !== undefined && nomination.mainNominee !== null) {
      getUserByUserId(nomination.mainNominee).then((mainNominee) => {
        nomination.mainNomineeName = mainNominee.fullName
      })
    }

    if (nomination.auxNominee !== undefined && nomination.auxNominee !== null) {
      getUserByUserId(nomination.auxNominee).then((auxNominee) => {
        nomination.mainNomineeName = auxNominee.fullName
      })
    }
  })
  res.status(200).json(nominations)
}))

router.get('/byCategory/:categoryId([0-9]+)/byUser', validateRequest(categoryLookupSchemaValidator), asyncWrap(async (req, res) => {
  const user = req.user as RegisteredUser
  const categoryId = Number(req.params.categoryId)
  const nominations = await getUserCategoryNomination({
    categoryId: categoryId,
    userId: user.id
  }) as ExtendedNominationModel[]

  nominations.forEach((nomination) => {
    if (nomination.mainNominee !== undefined && nomination.mainNominee !== null) {
      getUserByUserId(nomination.mainNominee).then((mainNominee) => {
        nomination.mainNomineeName = mainNominee.fullName
      })
    }

    if (nomination.auxNominee !== undefined && nomination.auxNominee !== null) {
      getUserByUserId(nomination.auxNominee).then((auxNominee) => {
        nomination.mainNomineeName = auxNominee.fullName
      })
    }
  })

  res.status(200).json(nominations)
}))

router.post('', validateRequest(nominationSchemaValidator), asyncWrap(async (req, res) => {
  const user = req.user as RegisteredUser
  const nomination = await createNomination({
    userId: user.id,
    categoryId: req.body.categoryId,
    mainNominee: req.body.mainNominee,
    auxNominee: req.body.auxNominee,
    extra: req.body.extra
  })
  res.status(201).json(nomination)
}))

router.delete('/:nominationId([0-9]+)', validateRequest(nominationLookupSchemaValidator), asyncWrap(async (req, res) => {
  const id = Number(req.params.nominationId)
  const nomination = await getNomination({
    id: id
  })
  if (nomination === undefined) {
    res.status(404).json(raise404())
  } else {
    if (!isAdmin(req.user as RegisteredUser) && nomination.userId !== (req.user as RegisteredUser).id) {
      throw new UnauthorizedError()
    }

    await deleteNomination({
      id: id
    })
    res.status(200).json(nomination)
  }
}))

export default router