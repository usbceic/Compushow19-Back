// Update with your config settings.
import dotenv from 'dotenv'

dotenv.config()

module.exports = {
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  migration: {
    extension: 'ts'
  }
}
