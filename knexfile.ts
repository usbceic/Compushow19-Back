// Update with your config settings.
import {PG_CONNECTION_STRING} from './src/config'


module.exports = {
  client: 'pg',
  connection: PG_CONNECTION_STRING,
  migration: {
    extension: 'ts'
  }
}
