import { OptionModel, getOptionsByCategoryId, getOptionById } from './models'
import { OptionsByCategoryLookupRequest, OptionLookupRequest } from './objects'

export async function listOptionsByCategory(request: OptionsByCategoryLookupRequest) : Promise<OptionModel[]> {
  return await getOptionsByCategoryId(request.categoryId)
}

export async function getOption(request: OptionLookupRequest) : Promise<OptionModel> {
  return await getOptionById(request.id)
}
