import { UserModel } from './models'

export interface CreateUserRequest {
  fullName: string
  email: string
  canVote: boolean
  profileUrl: string
  studentId: string
}

export interface User extends UserModel {}
