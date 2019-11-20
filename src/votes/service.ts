import {
  VoteModel, getUserVoteOnCategory, insertVote,
} from './models'
import { NomineeModel } from '../nominees/models'
import { getNominee } from '../nominees/service'



export async function createVote(nomineeId: number, userId: number) : Promise<VoteModel | undefined> {
  const nominee: NomineeModel = await getNominee({
    id: nomineeId
  })
  const exists = await getUserVoteOnCategory(userId, nominee.categoryId)
  if (exists) {
    return undefined
  }
  return await insertVote({
    userId: userId,
    nomineeId: nomineeId
  })
}
