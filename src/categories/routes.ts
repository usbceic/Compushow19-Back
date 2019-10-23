import express from 'express'
import { asyncWrap, validateRequest, raise404, raise400 } from '../utils'
import { listCategories, createCategory, getCategory, modifyCategory, deleteCategory } from './service'
import { categorySchemaValidator, updateCategorySchemaValidator } from './validations'
import { getCategoryByName } from './models'

const router = express.Router()

router.get('/categories', asyncWrap(async (req, res) => {
  const categories = await listCategories()
  res.status(200).json(categories)
}))

router.get('/categories/:categoryId', asyncWrap(async (req, res) => {
  const id = parseInt(req.params.categoryId)
  const category = await getCategory({
    id: id
  })
  if (category === undefined) {
    res.status(404).json(raise404())
  } else {
    res.status(200).json(category)
  }
}))

router.post('/categories/byName', asyncWrap(async (req, res) => {
  const name = req.body.name
  if (name === undefined) {
    res.status(400).json(raise400())
  }
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
  const id = parseInt(req.params.categoryId)
  const originalCategory = await getCategory({
    id: id
  })
  if (originalCategory === undefined) {
    res.status(404).json(raise404())
  } else {
    modifyCategory({
      name: req.body.name,
      extra: req.body.extra,
      description: req.body.description,
      pictureUrl: req.body.pictureUrl,
      color: req.body.color
    })
    const category = await getCategory({
      id: id
    })
    res.status(200).json(category)
  }
}))

router.delete('/categories/:categoryId', asyncWrap(async (req, res) => {
  const id = parseInt(req.params.categoryId)
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