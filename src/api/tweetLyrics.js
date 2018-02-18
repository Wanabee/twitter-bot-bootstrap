const Twit = require('twit')
const unique = require('unique-random-array')
const config = require('../config')
const fs = require('fs');
const isReply = require('../helpers/isReply')

const param = config.twitterConfig
const bot = new Twit(config.twitterKeys)

const tweetLyrics = () => {
  var hours = new Date().getHours();

  if (hours >= 7 || hours <= 1) // if time of day is between 1am and 7am, do not tweet
  {
    console.log('Hour is: ' + hours + ', tweeting')
    console.log('starting selectLine process');
    selectLine();
  }
}

function selectLine() {
  var selectedLine = '';
  var files = fs.readdirSync('./src/lyrics');
  var selectedFile = files[Math.floor(Math.random() * files.length)];
  console.log('File selected: ' + selectedFile + ' - ' + Date(Date.now()).toLocaleString());
  var data = fs.readFileSync('./src/lyrics/' + selectedFile, 'utf8');
  var lines = data.split('\n');

  selectedLine = lines[Math.floor(Math.random() * lines.length)];
  selectedLine = selectedLine.slice(0, -1);
  console.log('Selected line: ' + selectedLine + ' - ' + Date(Date.now()).toLocaleString());

  if (selectedLine.length < 280 && checkIfAlreadyTweeted(selectedLine) !== true) {
      var artist = selectedFile.split('-')[0].slice(0, -1).toLowerCase();
    var pictures = fs.readdirSync('./images/' + artist);
    var selectedPicture = './images/' + artist + '/' + pictures[Math.floor(Math.random() * pictures.length)];
    var b64content = fs.readFileSync(selectedPicture, { encoding: 'base64' })
    tweetNow(selectedLine, b64content);
    console.log('Tweeted: ' + selectedLine + ' - ' + Date(Date.now()).toLocaleString());
    fs.appendFileSync('./src/tweetedLines.txt', selectedLine + ' | ' + selectedFile + '\n');
    console.log('Saved new line! - ' + selectedLine + ' - ' + Date(Date.now()).toLocaleString());

  }
  else {
    selectLine();
  }
}

function tweetNow(text, b64content) {
  // first we must post the media to Twitter
  bot.post('media/upload', { media_data: b64content }, function (err, data, response) {
    // now we can assign alt text to the media, for use by screen readers and
    // other text-based presentations and interpreters
    var mediaIdStr = data.media_id_string;
    var altText = 'does it really matter';
    var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

    bot.post('media/metadata/create', meta_params, function (err, data, response) {
      if (!err) {
        // now we can reference the media and post a tweet (media will attach to the tweet)
        var params = { status: text, media_ids: [mediaIdStr] }

        bot.post('statuses/update', params, function (err, data, response) {
          console.log('succesfully tweeted')
        })
      }
    })
  })
}

function checkIfAlreadyTweeted(line) {
  var data = fs.readFileSync('./src/tweetedLines.txt', 'utf8');
  var lines = data.split('\n');
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(line)) {
      console.log('Line has already been tweeted: ' + line + ' - ' + Date(Date.now()).toLocaleString());
      return true;
    }
  }
}

module.exports = tweetLyrics
