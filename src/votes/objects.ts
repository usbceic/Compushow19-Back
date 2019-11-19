import { VoteModel } from './models'

export interface CreateVoteRequest {
  userId: number
  categoryId: number
  optionId: number
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

export interface VoteLookupByOptionRequest {
  optionId: number
}

export interface VoteLookupByUserAndCategoryRequest {
  userId: number
  categoryId: number
}

export interface Vote extends VoteModel {}