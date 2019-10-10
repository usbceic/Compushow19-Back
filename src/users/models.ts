import { db } from '../config'


const TABLE_NAME = 'users'
export interface User {
  fullName: string
  email: string
  phoneNumber: string
  canVote: boolean
  profileUrl: string
  studentId: string
}

export async function getAllUsers() : Promise<User[]> {
  return await db.select().from<User>(TABLE_NAME)
}
