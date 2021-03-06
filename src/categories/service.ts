import { CategoryModel, getAllCategories, insertCategory, updateCategory, getCategoryById, deleteCategoryById } from './models'
import { CreateCategoryRequest, GetCategoryRequest, ModifyCategoryRequest, DeleteCategoryRequest } from './objects'

export async function listCategories() : Promise<[CategoryModel]> {
  return await getAllCategories()
}

export async function createCategory(request: CreateCategoryRequest) : Promise<CategoryModel> {
  return await insertCategory(request)
}

export async function modifyCategory(id: number, request: ModifyCategoryRequest) : Promise<CategoryModel> {
  return await updateCategory(id, request)
}

export async function getCategory(request: GetCategoryRequest) : Promise<CategoryModel> {
  return await getCategoryById(request.id)
}

export async function deleteCategory(request: DeleteCategoryRequest) : Promise<boolean> {
  return await deleteCategoryById(request.id)
}