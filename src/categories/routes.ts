import express from 'express'
import { asyncWrap, validateRequest, raise404 } from '../utils'
import { listCategories, createCategory, getCategory, modifyCategory, deleteCategory } from './service'
import { categorySchemaValidator, updateCategorySchemaValidator, categoryLookupSchemaValidator, categoryNameLookupSchemaValidator } from './validations'
import { getCategoryByName } from './models'
import { isAdmin } from '../auth/auth'
import { RegisteredUser } from '../users/objects'
import { UnauthorizedError } from '../errorHandling/httpError'

const router = express.Router()

router.get('', asyncWrap(async (_, res) => {
  const categories = await listCategories()
  res.status(200).json(categories)
}))

router.get('/byName', validateRequest(categoryNameLookupSchemaValidator), asyncWrap(async (req, res) => {
  const name = req.query.name
  const category = await getCategoryByName(name)
  if (category === undefined) {
    res.status(404).json(raise404())
  } else {
    res.status(200).json(category)
  }
}))

router.get('/:categoryId([0-9]+)', validateRequest(categoryLookupSchemaValidator), asyncWrap(async (req, res) => {
  const id = Number(req.params.categoryId)
  const category = await getCategory({
    id: id
  })
  if (category === undefined) {
    res.status(404).json(raise404())
  } else {
    res.status(200).json(category)
  }
}))

router.post('', validateRequest(categorySchemaValidator), asyncWrap(async (req, res) => {
  if (!isAdmin(req.user as RegisteredUser)) {
    throw new UnauthorizedError()
  }

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

router.put('/:categoryId([0-9]+)', validateRequest(updateCategorySchemaValidator), asyncWrap(async (req, res) => {
  if (!isAdmin(req.user as RegisteredUser)) {
    throw new UnauthorizedError()
  }

  const id = Number(req.params.categoryId)
  const originalCategory = await getCategory({
    id: id
  })
  if (originalCategory === undefined) {
    res.status(404).json(raise404())
  } else {
    const category = await modifyCategory(id, {
      name: req.body.name,
      extra: req.body.extra,
      description: req.body.description,
      pictureUrl: req.body.pictureUrl,
      color: req.body.color
    })
    res.status(200).json(category)
  }
}))

router.delete('/:categoryId([0-9]+)', validateRequest(categoryLookupSchemaValidator), asyncWrap(async (req, res) => {
  if (!isAdmin(req.user as RegisteredUser)) {
    throw new UnauthorizedError()
  }

  const id = Number(req.params.categoryId)
  const category = await getCategory({
    id: id
  })
  if (category === undefined) {
    res.status(404).json(raise404())
  } else {
    await deleteCategory({
      id: id
    })
    res.status(200).json(category)
  }
}))

export default router