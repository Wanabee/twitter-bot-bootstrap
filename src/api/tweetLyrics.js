const Twit = require('twit')
const unique = require('unique-random-array')
const fs = require('fs'); 
const config = require('../config')

const param = config.twitterConfig
const queryString = unique(param.queryString.split(','))

const bot = new Twit(config.twitterKeys)

const tweetLyrics = () => {
 /*var day = new Date();
 var utc = day.getTime() - (day.getTimezoneOffset() * 60000);
 var nd = new Date(utc + (3600000*2)); // getting right time for Paris timezone
 var hours = nd.getHours();
  
 if (hours >= 7 || hours <= 1) // if time of day is between 1am and 7am, do not tweet
  {
    console.log('Hour is: ' + hours + ', tweeting')*/
    selectLine();
  //}
}
   
 function selectLine()   {
  var selectedLine = '';
  var files = fs.readdirSync('./src/lyrics');
  var selectedFile = files[Math.floor(Math.random()*files.length)];
  console.log('File selected: ' + selectedFile + ' - ' + Date(Date.now()).toLocaleString());
  var data = fs.readFileSync('./src/lyrics/' + selectedFile, 'utf8');
  var lines = data.split('\n');
    
  selectedLine = lines[Math.floor(Math.random()*lines.length)];
  console.log('Selected line: ' + selectedLine + ' - ' + Date(Date.now()).toLocaleString());
    
  if (selectedLine.length > 140 || checkIfAlreadyTweeted(selectedLine) !== true) {
    fs.appendFileSync('./src/tweetedLines.txt', selectedLine + ' | ' + selectedFile + '\n');
    console.log('Saved new line! - ' + selectedLine + ' - ' + Date(Date.now()).toLocaleString());
    tweetNow(selectedLine);
    console.log('Tweeted: ' + selectedLine + ' - ' + Date(Date.now()).toLocaleString());
  }
  else {
    selectLine();
 }
}

function tweetNow(text) {
  let tweet = {
    status: text
  }

  bot.post('statuses/update', tweet, (err, data, response) => {
    if (err) {
      console.log('ERRORDERP Reply', err)
    }
    console.log('SUCCESS: Replied: ', text)
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