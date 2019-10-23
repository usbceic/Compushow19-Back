import { CategoryModel, getAllCategories, insertCategory, getCategoryById, deleteCategoryById } from './models'
import { CreateCategoryRequest, GetCategoryRequest, DeleteCategoryRequest } from './objects'

export async function listCategories() : Promise<[CategoryModel]> {
  return await getAllCategories()
}

export async function createCategory(request: CreateCategoryRequest) : Promise<CategoryModel> {
  return await insertCategory(request)
}

export async function getCategory(request: GetCategoryRequest) : Promise<CategoryModel> {
  const id = request.id
  return await getCategoryById(id)
}

export async function deleteCategory(request: DeleteCategoryRequest) : Promise<boolean> {
  const id = request.id
  return await deleteCategoryById(id)
}