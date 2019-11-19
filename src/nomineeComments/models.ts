import { db } from '../config'
import { Nominee } from '../nominees/objects'
import { getNomineeById } from '../nominees/models'

const TABLE_NAME = 'nomineeComments'

export interface NomineeCommentModel {
  id: number
  nomineeId: number
  comment: string
}

export interface ExtendedNomineeCommentModel extends NomineeCommentModel {
  nominee: Nominee
}

export async function getNomineeCommentById(id: number) : Promise<NomineeCommentModel> {
  return await db(TABLE_NAME).where('id', id).first()
}

export async function getNomineeCommentsByCategoryId(id: number) : Promise<NomineeCommentModel[]> {
  return await db(TABLE_NAME).where('categoryId', id)
}

export async function addNomineeToComment(comment: NomineeCommentModel) : Promise<ExtendedNomineeCommentModel> {
  const nominee = await getNomineeById(comment.nomineeId)

  const extendedComment : ExtendedNomineeCommentModel = {
    id: comment.id,
    nomineeId: comment.nomineeId,
    comment: comment.comment,
    nominee: nominee
  }

  return extendedComment
}

export async function addNomineesToComments(comments: NomineeCommentModel[]) : Promise<ExtendedNomineeCommentModel[]> {
  return await Promise.all(comments.map(addNomineeToComment))
}