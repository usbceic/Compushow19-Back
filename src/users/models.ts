import { db } from '../config'


const TABLE_NAME = 'users'

const USER_FIELDS = [
  'id', 'fullName', 'email', 'phoneNumber', 'telegramHandle', 'canVote', 'profileUrl', 'studentId'
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

export async function getUserByEmailAddress(email: string) : Promise<UserModel> {
  return await db(TABLE_NAME).where('email', email).first()
}

export async function getUserByStudentId(studentId: string) : Promise<UserModel> {
  return await db(TABLE_NAME).where('studentId', studentId).first()
}

export async function getUserByUserId(id: number) : Promise<UserModel> {
  return await db(TABLE_NAME).where('id', id).first()
}


export async function existsByEmailAddress(email: string) : Promise<boolean> {
  return (await getUserByEmailAddress(email)) !== undefined
}

export async function existsByStudentId(studentId: string) : Promise<boolean> {
  return (await getUserByStudentId(studentId)) !== undefined
}

export async function insertUser(user: UserModel) : Promise<UserModel> {
  return await db(TABLE_NAME)
    .returning(USER_FIELDS).insert(user)
}
