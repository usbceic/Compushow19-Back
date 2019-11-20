import { db } from '../config'

const TABLE_NAME = 'votes'

const VOTE_FIELDS = [
  'id',
  'userId',
  'categoryId',
  'nomineeId'
]

export interface VoteModel {
  id?: number
  userId: number
  categoryId: number
  nomineeId: number
}

export async function getVoteById(id: number) : Promise<VoteModel> {
  return await db(TABLE_NAME).where('id', id).first()
}

export async function getVotesByUserId(userId: number) : Promise<VoteModel[]> {
  return await db(TABLE_NAME)
    .select(VOTE_FIELDS)
    .where('userId', userId)
}

export async function getVotesByCategoryId(categoryId: number) : Promise<VoteModel[]> {
  return await db(TABLE_NAME)
    .select(VOTE_FIELDS)
    .where('categoryId', categoryId)
}

export async function getVotesByNomineeId(nomineeId: number) : Promise<VoteModel[]> {
  return await db(TABLE_NAME)
    .select(VOTE_FIELDS)
    .where('nomineeId', nomineeId)
}

export async function getVoteByUserIdAndCategoryId(userId: number, categoryId: number) : Promise<VoteModel> {
  return await db(TABLE_NAME)
    .select(VOTE_FIELDS)
    .where('userId', userId)
    .where('categoryId', categoryId)
    .first()
}

export async function voteExistsById(id: number) : Promise<boolean> {
  return (await getVoteById(id)) !== undefined
}

export async function voteExistsByUserIdAndCategoryId(userId: number, categoryId: number) : Promise<boolean> {
  return (await getVoteByUserIdAndCategoryId(userId, categoryId)) !== undefined
}

export async function insertVote(vote: VoteModel) : Promise<VoteModel> {
  return await db(TABLE_NAME)
    .returning(VOTE_FIELDS).insert(vote)
}