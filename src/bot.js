// bot features
// due to the Twitter ToS automation of likes
// is no longer allowed, so:
const Twit = require('twit')
const config = require('./config')

const bot = new Twit(config.twitterKeys)
const tweetLyrics = require('./api/tweetLyrics')

console.log('starting setInterval process');
setInterval(tweetLyrics, config.twitterConfig.tweetInterval)

