import { db } from '../config'

const TABLE_NAME = 'options'

export interface OptionModel {
  id?: number
  categoryId: number
  name: string
  happyPictureUrl: string
  sadPictureUrl: string
  extraPictureUrl?: string
}

export async function getOptionById(id: number) : Promise<OptionModel> {
  return await db(TABLE_NAME).where('id', id).first()
}

export async function getOptionsByCategoryId(id: number) : Promise<OptionModel[]> {
  return await db(TABLE_NAME).where('categoryId', id)
}
