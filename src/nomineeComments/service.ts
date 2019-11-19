import { NomineeCommentModel, getNomineeCommentsByCategoryId, getNomineeCommentById } from './models'
import { NomineeCommentsByCategoryLookupRequest, NomineeCommentLookupRequest } from './objects'

export async function listNomineeCommentsByCategory(request: NomineeCommentsByCategoryLookupRequest) : Promise<NomineeCommentModel[]> {
  return await getNomineeCommentsByCategoryId(request.categoryId)
}

export async function getNomineeComment(request: NomineeCommentLookupRequest) : Promise<NomineeCommentModel> {
  return await getNomineeCommentById(request.id)
}
