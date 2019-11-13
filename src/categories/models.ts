import { db } from '../config'
import { ModifyCategoryRequest } from './objects'

const TABLE_NAME = 'categories'

const CATEGORY_FIELDS = [
  'id',
  'name',
  'type',
  'extra',
  'description',
  'pictureUrl',
  'color'
]

export type categoryType = 'TO_USER' | 'TO_TWO_USERS' | 'ONLY_EXTRA';

export interface CategoryModel {
  id?: number
  name: string
  type: categoryType
  extra?: string
  description: string
  pictureUrl: string
  color: string
}

export async function getCategoryByName(name: string) : Promise<CategoryModel> {
  return await db(TABLE_NAME).where('name', name).first()
}

export async function getCategoryById(id: number) : Promise<CategoryModel> {
  return await db(TABLE_NAME).where('id', id).first()
}

export async function categoryExistsByName(name: string) : Promise<boolean> {
  return (await getCategoryByName(name)) !== undefined
}

export async function categoryExistsById(id: number) : Promise<boolean> {
  return (await getCategoryById(id)) !== undefined
}

export async function insertCategory(category: CategoryModel) : Promise<CategoryModel> {
  return await db(TABLE_NAME)
    .returning(CATEGORY_FIELDS).insert(category)
}

export async function updateCategory(id: number, category: ModifyCategoryRequest) : Promise<CategoryModel> {
  await db(TABLE_NAME).where('id', id).update(category)
  return await getCategoryById(id)
}

export async function deleteCategoryById(id: number) : Promise<boolean> {
  return await db(TABLE_NAME).where('id', id).del()
}

export async function getAllCategories() : Promise<[CategoryModel]> {
  return await db(TABLE_NAME)
    .select(CATEGORY_FIELDS)
    .then((categories) => {
      return <[CategoryModel]>categories
    })
}