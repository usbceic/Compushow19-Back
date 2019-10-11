import { db } from '../config'


const TABLE_NAME = 'users'

const USER_FIELDS = [
  'id', 'fullName', 'email', 'phoneNumber', 'canVote', 'profileUrl', 'studentId'
]

export interface UserModel {
  id?: number
  fullName: string
  email: string
  phoneNumber?: string
  telegramHandle?: string
  canVote: boolean
  profileUrl: string
  studentId: string
}


export async function getAllUsers() : Promise<UserModel[]> {
  return await db.select().from<UserModel>(TABLE_NAME)
}

export async function getUserByEmailAddress(email: string) : Promise<UserModel> {
  return await db(TABLE_NAME).where('email', email).first()
}

export async function existsByEmailAddress(email: string) : Promise<boolean> {
  return (await getUserByEmailAddress(email)) !== undefined
}

export async function insertUser(user: UserModel) : Promise<UserModel> {
  return await db(TABLE_NAME)
    .returning(USER_FIELDS).insert(user)
}
