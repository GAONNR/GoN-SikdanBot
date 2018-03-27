const {
  WebClient
} = require('@slack/client');
const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');
const unixTime = require('unix-time');

const tokens = require('./token');
const token = tokens.legacyToken;

const web = new WebClient(token);

const channels = {
  cs330_os: 'C8FQLB9AP',
  test_for: 'C02PM7XQ1'
};
// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
// const conversationId = 'C8FQLB9AP';
const conversationId = channels.test_for;

var options = {
  uri: 'http://www.kaist.ac.kr/_prog/fodlst/index.php?site_dvs_cd=kr&menu_dvs_cd=050303&dvs_cd=emp&stt_dt=2018-03-27&site_dvs=',
  transform: function(body) {
    return cheerio.load(body);
  }
};

rp(options)
  .then(($) => {
    let menu = $($('.menuTb').find('td').get(1)).text().trim();
    web.chat.postMessage({
        channel: conversationId,
        as_user: false,
        username: 'Sikdanbot',
        icon_url: 'https://pbs.twimg.com/profile_images/975638064348327936/26mLY9Qf_400x400.jpg',
        attachments: [{
          fallback: '오늘의 식단',
          color: '#2196f3',
          title: '오늘의 식단',
          title_link: 'https://bds.bablabs.com/restaurants?campus_id=JEnfpqCUuR',
          text: menu,
          ts: unixTime(new Date())
        }]
      })
      .then((res) => {
        // `res` contains information about the posted message
        console.log('Message sent: ', res.ts);
      })
      .catch(console.error);
  })
  .catch((err) => {
    throw err;
  });