import { NomineeModel, getNomineesByCategoryId, getNomineeById } from './models'
import { NomineesByCategoryLookupRequest, NomineeLookupRequest } from './objects'

export async function listNomineesByCategory(request: NomineesByCategoryLookupRequest) : Promise<NomineeModel[]> {
  return await getNomineesByCategoryId(request.categoryId)
}

export async function getNominee(request: NomineeLookupRequest) : Promise<NomineeModel> {
  return await getNomineeById(request.id)
}
