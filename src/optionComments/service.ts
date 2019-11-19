import { OptionCommentModel, getOptionCommentsByOptionId, getOptionCommentById } from './models'
import { OptionCommentsByOptionLookupRequest, OptionCommentLookupRequest } from './objects'

export async function listOptionCommentsByOption(request: OptionCommentsByOptionLookupRequest) : Promise<OptionCommentModel[]> {
  return await getOptionCommentsByOptionId(request.optionId)
}

export async function getOptionComment(request: OptionCommentLookupRequest) : Promise<OptionCommentModel> {
  return await getOptionCommentById(request.id)
}
