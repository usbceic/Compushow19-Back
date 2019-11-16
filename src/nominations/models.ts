import { db } from '../config'
import { RegisteredUser } from '../users/objects'
import { getUserByUserId } from '../users/models'
import { getCategoryById } from '../categories/models'

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

export interface SavedNominationModel extends NominationModel {
  id: number
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
    auxNominee: auxNominee,
    extra: nomination.extra
  }

  return extendedNomination
}

export async function addNomineesToNominations(nominations: NominationModel[]) : Promise<ExtendedNominationModel[]> {
  return await Promise.all(nominations.map(addNomineeToNomination))
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

export async function nominationAlreadyExists(nominationAttempt: NominationModel) : Promise <boolean> {
  const category = await getCategoryById(nominationAttempt.categoryId)
  const categoryType = category.type

  switch (categoryType) {
    case 'TO_TWO_USERS':
      var nomination = await db(TABLE_NAME)
        .select(NOMINATION_FIELDS)
        .where('userId', nominationAttempt.userId)
        .where('categoryId', nominationAttempt.categoryId)
        .where('mainNominee', nominationAttempt.mainNominee)
        .where('auxNominee', nominationAttempt.auxNominee)
        .first()
      if (nomination !== undefined) {
        return true
      }
      break

    case 'TO_USER':
    case 'TO_USER_WITH_EXTRA':
      var nomination = await db(TABLE_NAME)
        .select(NOMINATION_FIELDS)
        .where('userId', nominationAttempt.userId)
        .where('categoryId', nominationAttempt.categoryId)
        .where('mainNominee', nominationAttempt.mainNominee)
        .first()
      if (nomination !== undefined) {
        return true
      }
      break

    case 'ONLY_EXTRA':
      var nomination = await db(TABLE_NAME)
        .select(NOMINATION_FIELDS)
        .where('userId', nominationAttempt.userId)
        .where('categoryId', nominationAttempt.categoryId)
        .where('extra', nominationAttempt.extra)
        .first()
      if (nomination !== undefined) {
        return true
      }
      break
  }

  return false
}

export async function insertNomination(nomination: NominationModel) : Promise<NominationModel> {
  return await db(TABLE_NAME)
    .returning(NOMINATION_FIELDS).insert(nomination)
}

export async function deleteNominationById(id: number) : Promise<boolean> {
  return await db(TABLE_NAME).where('id', id).del()
}
