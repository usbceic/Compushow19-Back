import { db } from '../config'

const TABLE_NAME = 'nominations'

const NOMINATION_FIELDS = [
  'id',
  'userId',
  'categoryId',
  'mainNominee',
  'auxNominee',
  'extra',
]

export interface NominationModel {
  id?: number
  userId: number
  categoryId: number
  mainNominee: number
  auxNominee: number
  extra?: string
}
