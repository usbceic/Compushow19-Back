/* istanbul ignore file */

import { config } from 'dotenv'
import knex from 'knex'
import path from 'path'

config({
  path: path.resolve(process.cwd(), process.env.ENV_FILE || '.env')
})

const req = (envVar: string) : string => {
  const variable : string | undefined = process.env[envVar]
  if (variable === undefined || variable === '') {
    throw new Error(`Required variable ${envVar} is not defined`)
  }
  return variable
}

const setDefault = (envVar: string, defValue: string) : string => process.env[envVar] || defValue

const array = (envVar: string): string[] => req(envVar).split(',')

export const PORT : string = setDefault('PORT', '8080')
export const NODE_ENV : string = req('NODE_ENV')
export const PG_CONNECTION_STRING : string = req('PG_CONNECTION_STRING')
export const GOOGLE_SIGN_IN_CLIENT_ID : string = req('GOOGLE_SIGN_IN_CLIENT_ID')
export const GOOGLE_EMAIL_DOMAIN : string = req('GOOGLE_EMAIL_DOMAIN')
export const ADMINS: string[] = array('ADMINS')

export const db = knex({
  client: 'pg',
  connection: PG_CONNECTION_STRING,
})

