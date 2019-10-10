import { db } from '../config'


const TABLE_NAME = 'users'

export interface UserModel {
  id: number
  fullName: string
  email: string
  phoneNumber: string
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
