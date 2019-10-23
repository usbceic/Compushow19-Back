import { CategoryModel, insertCategory } from './models'
import { CreateCategoryRequest } from './objects'

export async function createCategory(request: CreateCategoryRequest) : Promise<CategoryModel> {
  return await insertCategory(request)
}