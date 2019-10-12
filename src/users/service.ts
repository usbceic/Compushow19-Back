import { UserModel, insertUser } from './models'
import { CreateUserRequest } from './objects'

export async function createUser(request: CreateUserRequest) : Promise<UserModel> {
  return await insertUser(request)
}
