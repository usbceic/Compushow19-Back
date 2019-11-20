// import {
//   VoteLookupRequest,
//   VoteLookupByUserRequest,
//   VoteLookupByUserAndCategoryRequest,
// } from './objects'
import {
  VoteModel, hasUserVotedOnCategory, insertVote,
} from './models'
import { NomineeModel } from '../nominees/models'
import { getNominee } from '../nominees/service'


// export async function getVote(request: VoteLookupRequest) : Promise<VoteModel> {
//   return await getVoteById(request.id)
// }

// export async function getVotesByUser(request: VoteLookupByUserRequest) : Promise<VoteModel[]> {
//   return await getVotesByUserId(request.userId)
// }

// export async function getVotesByNominee
//   return await getVotesByNomineeId(request.nomineeId)
// }

// export async function getVoteByUserAndCategory(request: VoteLookupByUserAndCategoryRequest) : Promise<VoteModel> {
//   return await getVoteByUserIdAndCategoryId(request.userId, request.categoryId)
// }

export async function createVote(nomineeId: number, userId: number) : Promise<VoteModel | undefined> {
  const nominee: NomineeModel = await getNominee({
    id: nomineeId
  })
  const exists = await hasUserVotedOnCategory(userId, nominee.categoryId)
  if (exists) {
    return undefined
  }
  return await insertVote({
    userId: userId,
    nomineeId: nomineeId
  })
}
