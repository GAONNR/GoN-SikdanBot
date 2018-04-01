const {
  WebClient
} = require('@slack/client');

const config = require('./config.js');
const token = config.legacyToken;

const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');
const unixTime = require('unix-time');
const gen = require('random-seed');
const moment = require('moment');

const menus = ['마루', '보쌈', '피자', '찜닭', '집돼', '도시락', '학식', '두메', '교수회관'];

const web = new WebClient(token);

var options = {
  uri: '',
  transform: function(body) {
    return cheerio.load(body);
  }
};

function getToday() {
  return moment().format().slice(0, 10);
}

function postText(channel, text) {
  web.chat.postMessage({
      channel: channel,
      as_user: false,
      username: 'Sikdanbot',
      icon_url: 'https://pbs.twimg.com/profile_images/975638064348327936/26mLY9Qf_400x400.jpg',
      text: text
    })
    .then((res) => {
      // `res` contains information about the posted message
      console.log('Message sent: ', res.ts);
    })
    .catch(console.error);
}

function postAttachments(channel, attachments) {
  web.chat.postMessage({
      channel: channel,
      as_user: false,
      username: 'Sikdanbot',
      icon_url: 'https://pbs.twimg.com/profile_images/975638064348327936/26mLY9Qf_400x400.jpg',
      attachments: attachments
    })
    .then((res) => {
      // `res` contains information about the posted message
      console.log('Message sent: ', res.ts);
    })
    .catch(console.error);
}

module.exports = {
  randomMenu: function(message) {
    let today = new Date().toJSON().slice(0, 10);
    postText(message.channel, `나같으면 ${menus[gen.create(getToday())(menus.length)]} 먹는다`);
  },

  crawlMenu: function(message) {
    options.uri = `http://www.kaist.ac.kr/_prog/fodlst/index.php?site_dvs_cd=kr&menu_dvs_cd=050303&dvs_cd=emp&stt_dt=${getToday()}&site_dvs=`;
    rp(options)
      .then(($) => {
        let menu = $($('.menuTb').find('td').get(1)).text().trim();
        postAttachments(message.channel, [{
          fallback: '오늘의 식단',
          color: '#2196f3',
          title: `${getToday()}의 식단`,
          title_link: 'https://bds.bablabs.com/restaurants?campus_id=JEnfpqCUuR',
          text: menu,
          ts: unixTime(new Date())
        }]);
      })
      .catch((err) => {
        throw err;
      });
  },

  soraGodung: function(message) {
    postText(message.channel, `${['응.', '아니.', '그만해라.'][gen.create()(3)]}`);
  }
};