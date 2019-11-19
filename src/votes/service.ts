import { VoteLookupRequest, VoteLookupByUserRequest, VoteLookupByNomineeRequest, VoteLookupByCategoryRequest, VoteLookupByUserAndCategoryRequest, CreateVoteRequest } from './objects'
import { VoteModel, getVoteById, getVotesByUserId, getVotesByNomineeId, getVotesByCategoryId, getVoteByUserIdAndCategoryId, voteExistsByUserIdAndCategoryId, insertVote } from './models'


export async function getVote(request: VoteLookupRequest) : Promise<VoteModel> {
  return await getVoteById(request.id)
}

export async function getVotesByUser(request: VoteLookupByUserRequest) : Promise<VoteModel[]> {
  return await getVotesByUserId(request.userId)
}

  return await getVotesByNomineeId(request.nomineeId)
}

export async function getVoteByUserAndCategory(request: VoteLookupByUserAndCategoryRequest) : Promise<VoteModel> {
  return await getVoteByUserIdAndCategoryId(request.userId, request.categoryId)
}

export async function createVote(request: CreateVoteRequest) : Promise<VoteModel> {
  const exists = await voteExistsByUserIdAndCategoryId(request.userId, request.categoryId)
  if (exists) {
    // TODO: Raise appropriate error
    return request
  }
  return await insertVote(request)
}