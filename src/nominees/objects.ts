import { NomineeModel } from './models';

export interface NomineeLookupRequest {
  id: number
}

export interface NomineesByCategoryLookupRequest {
  categoryId: number
}

export interface Nominee extends NomineeModel