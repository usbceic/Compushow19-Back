import { NomineeCommentModel, getNomineeCommentsByNomineeId, getNomineeCommentById } from './models'
import { NomineeCommentsByNomineeLookupRequest, NomineeCommentLookupRequest } from './objects'

export async function listNomineeCommentsByNominee(request: NomineeCommentsByNomineeLookupRequest) : Promise<NomineeCommentModel[]> {
  return await getNomineeCommentsByNomineeId(request.nomineeId)
}

export async function getNomineeComment(request: NomineeCommentLookupRequest) : Promise<NomineeCommentModel> {
  return await getNomineeCommentById(request.id)
}
