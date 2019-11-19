import { db } from '../config'

const TABLE_NAME = 'optionComments'

export interface OptionCommentModel {
  id?: number
  optionId: number
  comment: string
}

export async function getOptionCommentById(id: number) : Promise<OptionCommentModel> {
  return await db(TABLE_NAME).where('id', id).first()
}

export async function getOptionCommentsByOptionId(id: number) : Promise<OptionCommentModel[]> {
  return await db(TABLE_NAME).where('optionId', id)
}
