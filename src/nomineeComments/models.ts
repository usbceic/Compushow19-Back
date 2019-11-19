import { db } from '../config'

const TABLE_NAME = 'nomineeComments'

export interface NomineeCommentModel {
  id?: number
  nomineeId: number
  comment: string
}

export async function getNomineeCommentById(id: number) : Promise<NomineeCommentModel> {
  return await db(TABLE_NAME).where('id', id).first()
}

export async function getNomineeCommentsByNomineeId(id: number) : Promise<NomineeCommentModel[]> {
  return await db(TABLE_NAME).where('nomineeId', id)
}
