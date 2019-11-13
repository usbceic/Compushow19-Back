import { insertUser, getUserByUserId, getUserByEmailAddress, getAll } from './models'
import { CreateUserRequest, User } from './objects'
import { NotFoundError } from '../errorHandling/httpError'

export async function createUser(request: CreateUserRequest) : Promise<User> {
  return await insertUser(request)
}

export async function getUser(id: number) : Promise<User> {
  const user = await getUserByUserId(id)
  if (user === undefined) {
    throw new NotFoundError(`User with userId ${id} was not found`)
  }
  return user
}

export async function getUserByEmail(email: string) : Promise<User> {
  const user = await getUserByEmailAddress(email)
  if (user === undefined) {
    throw new NotFoundError(`User with email ${email} was not found`)
  }
  return user
}

export async function getAllUsers() : Promise<User[]> {
  return await getAll()
}