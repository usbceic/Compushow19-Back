import express from 'express'
import { asyncWrap, validateRequest, raise404 } from '../utils'
import { listCategories, createCategory, getCategory, modifyCategory, deleteCategory } from './service'
import { categorySchemaValidator, updateCategorySchemaValidator, categoryLookupSchemaValidator, categoryNameLookupSchemaValidator } from './validations'
import { getCategoryByName } from './models'

const router = express.Router()

router.get('/categories', asyncWrap(async (req, res) => {
  const categories = await listCategories()
  res.status(200).json(categories)
}))

router.get('/categories/:categoryId', validateRequest(categoryLookupSchemaValidator), asyncWrap(async (req, res) => {
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

router.get('/categories/byName/:categoryName', validateRequest(categoryNameLookupSchemaValidator), asyncWrap(async (req, res) => {
  const name = req.params.categoryName
  const category = await getCategoryByName(name)
  if (category === undefined) {
    res.status(404).json(raise404())
  } else {
    res.status(200).json(category)
  }
}))

router.post('/categories', validateRequest(categorySchemaValidator), asyncWrap(async (req, res) => {
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

router.put('/categories/:categoryId', validateRequest(updateCategorySchemaValidator), asyncWrap(async (req, res) => {
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

router.delete('/categories/:categoryId', validateRequest(categoryLookupSchemaValidator), asyncWrap(async (req, res) => {
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