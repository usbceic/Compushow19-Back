import { db } from '../config'

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

export interface CategoryModel {
  id?: number
  name: string
  type: string
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