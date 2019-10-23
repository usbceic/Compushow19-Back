import { CategoryModel } from './models'

export interface CreateCategoryRequest {
  name: string
  type: string
  extra?: string
  description: string
  pictureUrl: string
  color: string
}

export interface Category extends CategoryModel {}