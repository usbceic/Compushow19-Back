import { VoteModel } from './models'

export interface CreateVoteRequest {
  userId: number
  categoryId: number
  nomineeId: number
}

export interface VoteLookupRequest {
  id: number
}

export interface VoteLookupByCategoryRequest {
  categoryId: number
}

export interface VoteLookupByUserRequest {
  userId: number
}

export interface VoteLookupByNomineeRequest {
  nomineeId: number
}

export interface VoteLookupByUserAndCategoryRequest {
  userId: number
  categoryId: number
}

export interface Vote extends VoteModel {}