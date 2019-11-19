import { OptionModel } from './models';

export interface OptionLookupRequest {
  id: number
}

export interface OptionsByCategoryLookupRequest {
  categoryId: number
}

export interface Option extends OptionModel