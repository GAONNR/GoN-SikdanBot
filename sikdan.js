const { RTMClient } = require('@slack/client');

const config = require('./config.js');
const token = config.legacyToken;
const channels = config.channels;

const response = require('./response.js');

const rtm = new RTMClient(token);

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = channels.test_for;

rtm.start();

rtm.on('message', function(message) {
  // console.log(message);

  let text = message.text;
  if (text !== undefined) {
    if (text.includes('저녁 추천') || text.includes('점심 추천')) {
      response.randomMenu(message);
    } else if (text.includes('나가먹')) {
      response.randomOutside(message);
    } else if (text.includes('야식 추천')) {
      response.randomYasik(message);
    } else if (text.includes('식단')) {
      response.crawlMenu(message);
    } else if (text.includes('마법의 ')) {
      response.soraGodung(message);
    } else if (text.includes('!랜덤 ')) {
      response.randomChoice(message);
    } else if (text == '가온') {
      response.noGaon(message);
    }
  }
});
