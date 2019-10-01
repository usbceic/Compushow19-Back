import { config } from 'dotenv'
config()
import knex from 'knex'

const db = knex({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
})

export default {
  PORT: process.env.PORT,
  db: db
}
