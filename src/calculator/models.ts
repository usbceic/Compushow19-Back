export interface Credibility {
  credibility: number
}

export interface TextCredibilityWeights {
  weightSpam: number
  weightBadWords: number
  weightMisspelling: number
}

export interface TweetCredibilityWeights extends TextCredibilityWeights {
  weightText: number
  weightSocial: number
  weightUser: number
}

export interface TwitterUser {
  name: string
  verified: boolean
  yearJoined: number
  followersCount: number
  friendsCount: number
}

export interface Tweet {
  text: string
  user: TwitterUser
}
