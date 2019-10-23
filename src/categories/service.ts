import { CategoryModel, getAllCategories, insertCategory } from './models'
import { CreateCategoryRequest } from './objects'

export async function listCategories() : Promise<[CategoryModel]> {
  return await getAllCategories()
}

export async function createCategory(request: CreateCategoryRequest) : Promise<CategoryModel> {
  return await insertCategory(request)
}