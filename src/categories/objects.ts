import { CategoryModel, categoryType } from './models'

export interface CreateCategoryRequest {
  name: string
  type: categoryType
  extra?: string
  description: string
  pictureUrl: string
  color: string
}

export interface ModifyCategoryRequest {
  name?: string
  extra?: string
  description?: string
  pictureUrl?: string
  color?: string
}

export interface GetCategoryRequest {
  id: number
}

export interface DeleteCategoryRequest {
  id: number
}

export interface Category extends CategoryModel {}