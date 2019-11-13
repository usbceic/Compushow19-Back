import { NominationModel, getAllNominations, getNominationById, getNominationsByUserId, getNominationsByCategoryId, getNominationByUserAndCategory, insertNomination, deleteNominationById } from './models'
import { CreateNominationRequest, LookupNominationRequest, UserLookupNominationRequest, CategoryLookupNominationRequest, UserCategoryLookupRequest } from './objects'

export async function listNominations() : Promise<[NominationModel]> {
  return await getAllNominations()
}

export async function getNomination(request: LookupNominationRequest) : Promise<NominationModel> {
  return await getNominationById(request.id)
}

export async function getCategoryNominations(request: CategoryLookupNominationRequest) : Promise<[NominationModel]> {
  return await getNominationsByCategoryId(request.categoryId)
}

export async function getUserNominations(request: UserLookupNominationRequest) : Promise<[NominationModel]> {
  return await getNominationsByUserId(request.userId)
}

export async function getUserCategoryNomination(request: UserCategoryLookupRequest) : Promise<NominationModel> {
  return await getNominationByUserAndCategory(request.userId, request.categoryId)
}

export async function createNomination(request: CreateNominationRequest) : Promise<NominationModel> {
  return await insertNomination({...request, userId: request.userId!})
}

export async function deleteNomination(request: LookupNominationRequest) : Promise<boolean> {
  return await deleteNominationById(request.id)
}