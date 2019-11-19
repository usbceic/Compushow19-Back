import { VoteLookupRequest, VoteLookupByUserRequest, VoteLookupByOptionRequest, VoteLookupByCategoryRequest, VoteLookupByUserAndCategoryRequest, CreateVoteRequest } from './objects'
import { VoteModel, getVoteById, getVotesByUserId, getVotesByOptionId, getVotesByCategoryId, getVoteByUserIdAndCategoryId, voteExistsByUserIdAndCategoryId, insertVote } from './models'


export async function getVote(request: VoteLookupRequest) : Promise<VoteModel> {
  return await getVoteById(request.id)
}

export async function getVotesByUser(request: VoteLookupByUserRequest) : Promise<VoteModel[]> {
  return await getVotesByUserId(request.userId)
}

export async function getVotesByOption(request: VoteLookupByOptionRequest) : Promise<VoteModel[]> {
  return await getVotesByOptionId(request.optionId)
}

export async function getVotesByCategory(request: VoteLookupByCategoryRequest) : Promise<VoteModel[]> {
  return await getVotesByCategoryId(request.categoryId)
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