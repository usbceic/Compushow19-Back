import { db } from '../config'
import { RegisteredUser } from '../users/objects'
import { getUserByUserId } from '../users/models'

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
  mainNominee?: number
  auxNominee?: number
  extra?: string
}

export interface ExtendedNominationModel {
  id?: number
  userId: number
  categoryId: number
  mainNominee?: RegisteredUser
  auxNominee?: RegisteredUser
  extra?: string
}

export async function addNomineeToNomination(nomination: NominationModel) : Promise<ExtendedNominationModel> {
  var mainNominee, auxNominee
  if (nomination.mainNominee !== undefined) {
    mainNominee = await getUserByUserId(nomination.mainNominee) as RegisteredUser
  }
  if (nomination.auxNominee !== undefined) {
    auxNominee = await getUserByUserId(nomination.auxNominee) as RegisteredUser
  }

  const extendedNomination : ExtendedNominationModel = {
    id: nomination.id,
    userId: nomination.userId,
    categoryId: nomination.categoryId,
    mainNominee: mainNominee,
    auxNominee: auxNominee
  }

  return extendedNomination
}

export async function addNomineesToNominations(nominations: NominationModel[]) : Promise<ExtendedNominationModel[]> {
  var extendedNominations : ExtendedNominationModel[] = []
  nominations.forEach(async (n) => {
    extendedNominations.push(await addNomineeToNomination(n))
  })

  return extendedNominations
}

export async function getNominationById(id: number) : Promise<NominationModel> {
  return await db(TABLE_NAME).where('id', id).first()
}

export async function getNominationsByUserId(userId: number) : Promise<[NominationModel]> {
  return await db(TABLE_NAME)
    .select(NOMINATION_FIELDS)
    .where('userId', userId)
    .then((nominations) => {
      return <[NominationModel]>nominations
    })
}

export async function getNominationsByCategoryId(categoryId: number) : Promise<NominationModel[]> {
  return await db(TABLE_NAME)
    .select(NOMINATION_FIELDS)
    .where('categoryId', categoryId)
}

export async function getNominationByUserAndCategory(userId: number, categoryId: number) : Promise<NominationModel[]> {
  return await db(TABLE_NAME)
    .select(NOMINATION_FIELDS)
    .where('userId', userId)
    .where('categoryId', categoryId)
}

export async function getAllNominations() : Promise<NominationModel[]> {
  return await db(TABLE_NAME)
    .select(NOMINATION_FIELDS)
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
