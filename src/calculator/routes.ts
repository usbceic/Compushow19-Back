import express from 'express'
import { calculateTextCredibility, socialCredibility, twitterUserCredibility, calculateTweetCredibility } from './service'

const calculatorRoutes = express.Router()

calculatorRoutes.get('/plain-text', function(req, res) {
  res.send(calculateTextCredibility(req.query.text, {
    weightBadWords: +req.query.weightBadWords,
    weightMisspelling: +req.query.weightMisspelling,
    weightSpam: +req.query.weightSpam
  }))
})

calculatorRoutes.get('/twitter/user/:id', function(req, res, next) {
  twitterUserCredibility(req.params.id)
    .then(response => {
      res.send(response)
      next()
    })
})

calculatorRoutes.get('/twitter/social/:userId', async function(req, res) {
  const socialCredibilityVal = await socialCredibility(req.params.userId)
  res.send(socialCredibilityVal)
})

calculatorRoutes.get('/twitter/tweets', function(req, res, next) {
  calculateTweetCredibility(req.query.tweetId, {
    weightBadWords: +req.query.weightBadWords,
    weightMisspelling: +req.query.weightMisspelling,
    weightSpam: +req.query.weightSpam,
    weightSocial: +req.query.weightSocial,
    weightText: +req.query.weightText,
    weightUser: +req.query.weightUser
  })
    .then(response => {
      res.send(response)
      next()
    })
})

export default calculatorRoutes
