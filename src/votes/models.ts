import { db } from '../config'

const TABLE_NAME = 'votes'

const VOTE_FIELDS = [
  'id',
  'userId',
  'nomineeId'
]

export interface VoteModel {
  id?: number
  userId: number
  nomineeId: number
}

export async function getUserVoteOnCategory(userId: number, categoryId: number) : Promise<VoteModel> {
  const [row] = await db(TABLE_NAME).join('nominees', 'votes.nomineeId', 'nominees.id')
    .where('nominees.categoryId', categoryId)
    .andWhere('votes.userId', userId)
    .select(`${TABLE_NAME}.*`)
  return row
}

export async function insertVote(vote: VoteModel) : Promise<VoteModel> {
  return await db(TABLE_NAME)
    .returning(VOTE_FIELDS).insert(vote)
}
