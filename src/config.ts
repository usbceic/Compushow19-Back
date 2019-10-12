/* istanbul ignore file */

import { config } from 'dotenv'
import knex from 'knex'
import path from 'path'
config({
  path: path.resolve(process.cwd(), process.env.ENV_FILE || '.env')
})

export const PORT : string = process.env.PORT!
export const NODE_ENV : string = process.env.NODE_ENV!
export const PG_CONNECTION_STRING : string = process.env.PG_CONNECTION_STRING!

export const db = knex({
  client: 'pg',
  connection: PG_CONNECTION_STRING,
})

