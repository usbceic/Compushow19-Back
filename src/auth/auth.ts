import { OAuth2Client } from 'google-auth-library'
import { GOOGLE_SIGN_IN_CLIENT_ID, GOOGLE_EMAIL_DOMAIN, ADMINS } from '../config'
import { UnauthorizedError } from '../errorHandling/httpError'
import { User } from '../users/objects'
import { getUserByEmail } from '../users/service'

const client = new OAuth2Client(GOOGLE_SIGN_IN_CLIENT_ID)

async function authorizeWithGoogle(token: string) : Promise<User> {
  const ticket = await client.verifyIdToken({
    audience: GOOGLE_SIGN_IN_CLIENT_ID,
    idToken: token
  })
  const payload = ticket.getPayload()
  if (payload === undefined) {
    throw new UnauthorizedError()
  }
  const email: string = payload.email || ''
  if (!email.endsWith(GOOGLE_EMAIL_DOMAIN)) {
    throw new UnauthorizedError()
  }
  const user: User = await getUserByEmail(email)
  return user
}

export default authorizeWithGoogle

export function isAdmin(user: User) {
  return ADMINS.includes(user.email)
}