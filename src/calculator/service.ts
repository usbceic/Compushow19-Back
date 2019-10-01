import {TextCredibilityWeights, Credibility, TwitterUser, TweetCredibilityWeights, Tweet} from './models'
import config from '../config'
import Filter, { FilterParams } from 'bad-words'
import Twit from 'twit'
import SimpleSpamFilter, { SimpleSpamFilterParams } from 'simple-spam-filter'
import Spelling from 'spelling'
import dictionary from 'spelling/dictionaries/en_US'

const BAD_WORD_PLACEHOLDER = '*'

function responseToTwitterUser(response: any) : TwitterUser {
  return {
    name: response.name,
    verified: response.verified,
    yearJoined: response.created_at.split(' ').pop(),
    followersCount: response.followers_count,
    friendsCount: response.friends_count
  }
}

function responseToTweet(response: any) : Tweet {
  return {
    text: response.text,
    user: responseToTwitterUser(response.user)
  }
}

function buildTwitClient() : Twit {
  return new Twit({
    consumer_key: config.TWITTER_CONSUMER_KEY,
    consumer_secret: config.TWITTER_CONSUMER_SECRET,
    app_only_auth: true
  })
}

function getCleanedWords(text: string) : string[] {
  return text.replace(/[.]|\n|,/g, ' ').split(' ')
}

function isBadWord(word: string) : boolean {
  return word.split('').every(i => i === BAD_WORD_PLACEHOLDER)
}

function getBadWords(words: string[]) : string[] {
  return words.filter(isBadWord)
}

function badWordsCriteria(text: string) : number {
  const filterParams : FilterParams = {
    placeHolder: BAD_WORD_PLACEHOLDER
  }
  const filter = new Filter(filterParams)
  const cleanedString = filter.clean(text)
  const wordsInText = getCleanedWords(cleanedString)
  const badWordsInText = getBadWords(wordsInText)
  return 100 - (100 * badWordsInText.length / wordsInText.length)
}

function spamCriteria(text: string) : number {
  const spamParams : SimpleSpamFilterParams = {
    minWords: 5,
    maxPercentCaps: 30,
    maxNumSwearWords: 2
  }
  const spamFilter : SimpleSpamFilter = new SimpleSpamFilter(spamParams)
  return spamFilter.isSpam(text)
    ? 0
    : 100
}

function missSpellingCriteria(text: string) : number {
  const wordsInText = getCleanedWords(text)
  const spellingChecker = new Spelling(dictionary)
  const numOfMissSpells : number = wordsInText.reduce((acc, curr) =>
    spellingChecker.lookup(curr).found
      ? acc
      : acc + 1, 0)
  return 100 - (100 * numOfMissSpells / wordsInText.length)
}

function calculateTextCredibility(text: string, params: TextCredibilityWeights) : Credibility {
  const badWordsCalculation = params.weightBadWords * badWordsCriteria(text)
  const spamCalculation = params.weightSpam * spamCriteria(text)
  const missSpellingCalculation = params.weightMisspelling * missSpellingCriteria(text)
  return {
    credibility: badWordsCalculation + spamCalculation + missSpellingCalculation
  }
}

async function getUserInfo(userId: string) : Promise<TwitterUser> {
  const client = buildTwitClient()
  try {
    const response = await client.get('users/show', { user_id: userId })
    return responseToTwitterUser(response.data)
  } catch (e) {
    return e
  }
}

async function getTweetInfo(tweetId: string) : Promise<Tweet> {
  const client = buildTwitClient()
  try {
    const response = await client.get('statuses/show', { id: tweetId })
    return responseToTweet(response.data)
  } catch (e) {
    return e
  }
}

function calculateUserCredibility(user: TwitterUser) : number {
  return getVerifWeigth(user.verified) + getCreationWeight(user.yearJoined)
}

function calculateSocialCredibility(user: TwitterUser) : number {
  const followersImpactCalc = followersImpact(user.followersCount)
  const ffProportionCalc = ffProportion(user.followersCount, user.friendsCount)
  return followersImpactCalc + ffProportionCalc
}

async function twitterUserCredibility(userId: string) {
  return getUserInfo(userId)
    .then(response => {
      return  {
        credibility: calculateUserCredibility(response)
      }
    })
}

async function calculateTweetCredibility(tweetId: string,
  params: TweetCredibilityWeights) : Promise<Credibility> {
  try {
    const tweet: Tweet = await getTweetInfo(tweetId)
    const user: TwitterUser = tweet.user
    const userCredibility: number = calculateUserCredibility(user) * params.weightText
    const textCredibility: number = calculateTextCredibility(tweet.text, params).credibility * params.weightText
    const socialCredibility: number = calculateSocialCredibility(user) * params.weightSocial
    return {
      credibility: userCredibility + textCredibility + socialCredibility
    }
  } catch (e) {
    console.log(e)
    throw e
  }
}

function getVerifWeigth(isUserVerified : boolean) : number {
  if (isUserVerified) {
    return 50
  } else {
    return 0
  }
}

function getCreationWeight(yearJoined : number) : number {
  const currentYear = new Date().getFullYear()
  const twitterCreationYear = 2006
  const accountAge = currentYear - twitterCreationYear
  const maxAccountAge = currentYear - yearJoined
  return accountAge/maxAccountAge
}

function followersImpact(userFollowers: number) : number {
  const maxFollowers = 2000000
  return (userFollowers / maxFollowers) * 50
}

function ffProportion(userFollowers: number, userFollowing: number) : number {
  return (userFollowers / (userFollowers + userFollowing)) * 50
}

async function socialCredibility(userID: string) {
  const response: TwitterUser = await getUserInfo(userID)
  return {
    credibility: calculateSocialCredibility(response)
  }
}

export {
  calculateTextCredibility,
  twitterUserCredibility,
  calculateTweetCredibility,
  socialCredibility
}
