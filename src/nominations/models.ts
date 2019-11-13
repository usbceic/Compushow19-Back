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

export async function getNominationById(id: number) : Promise<NominationModel> {
  return await db(TABLE_NAME).where('id', id).first()
}

export async function getNominationByUserAndCategory(userId: number, categoryId: number) : Promise<NominationModel> {
  return await db(TABLE_NAME)
    .select(NOMINATION_FIELDS)
    .where('userId', userId)
    .where('categoryId', categoryId)
    .first()
}

export async function getAllNominations() : Promise<[NominationModel]> {
  return await db(TABLE_NAME)
    .select(NOMINATION_FIELDS)
    .then((nominations) => {
      return <[NominationModel]>nominations
    })
}

export async function getNominationsByUserId(userId: number) : Promise<[NominationModel]> {
  return await db(TABLE_NAME)
    .select(NOMINATION_FIELDS)
    .where('userId', userId)
    .then((nominations) => {
      return <[NominationModel]>nominations
    })
}

export async function nominationExistsById(id: number) : Promise<boolean> {
  return (await getNominationById(id)) !== undefined
}

export async function insertNomination(nomination: NominationModel) : Promise<NominationModel> {
  return await db(TABLE_NAME)
    .returning(NOMINATION_FIELDS).insert(nomination)
}

export async function deleteNominationById(id: number) : Promise<boolean> {
  return await db(TABLE_NAME).where('id', id).del()
}
