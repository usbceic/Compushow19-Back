import { NominationModel } from './models'

export interface CreateNominationRequest {
  userId: number
  categoryId: number
  mainNominee?: number
  auxNominee?: number
  extra?: string
}

export interface LookupNominationRequest {
  id: number
}

export interface CategoryLookupNominationRequest {
  categoryId: number
}

export interface UserLookupNominationRequest {
  userId: number
}

export interface UserCategoryLookupRequest {
  userId: number
  categoryId: number
}

export interface Nomination extends NominationModel {}