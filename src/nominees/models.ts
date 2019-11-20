import { db } from '../config'

const TABLE_NAME = 'nominees'

export interface NomineeModel {
  id?: number
  categoryId: number
  name: string
  happyPictureUrl: string
  sadPictureUrl: string
  extraPictureUrl?: string
}

export async function getNomineeById(id: number) : Promise<NomineeModel> {
  return await db(TABLE_NAME).where('id', id).first()
}

export async function getNomineesByCategoryId(id: number) : Promise<NomineeModel[]> {
  return await db(TABLE_NAME).where('categoryId', id)
}
