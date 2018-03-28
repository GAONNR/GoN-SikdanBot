const {
  RTMClient
} = require('@slack/client');

const config = require('./config.js');
const token = config.legacyToken;
const channels = config.channels;

const response = require('./response.js');

const rtm = new RTMClient(token);

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = channels.test_for;

rtm.start();

rtm.on('message', function(message) {
  console.log(message);

  let text = message.text;
  if (text.includes('저녁')) {
    response.randomMenu(message);
  }
});