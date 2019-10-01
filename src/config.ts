import { config } from 'dotenv'
config()


export default {
  PORT: process.env.PORT,
  TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY || '',
  TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET || ''
}
