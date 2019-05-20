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
const yasik = ['대학생', '큰통', '불닭', '왕큰손', '강기막', 'BBQ', '마시내'];

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

function postText(channel,
  text,
  username = 'Sikdanbot',
  icon_url = 'https://pbs.twimg.com/profile_images/975638064348327936/26mLY9Qf_400x400.jpg') {
  web.chat.postMessage({
      channel: channel,
      as_user: false,
      username: username,
      icon_url: icon_url,
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
    postText(message.channel,
      `나같으면 ${menus[gen.create(getToday())(menus.length)]} 먹는다`);
  },

  randomYasik: function(message) {
    postText(message.channel,
      `나같으면 ${yasik[gen.create()(yasik.length)]} 먹는다`);
  },

  crawlMenu: function(message) {
    options.uri =
      `http://www.kaist.ac.kr/_prog/fodlst/index.php?site_dvs_cd=kr&menu_dvs_cd=050303&dvs_cd=emp&stt_dt=${getToday()}&site_dvs=`;
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
    let text = message.text;
    let textTokens = text.match(/\S+/g);
    let username = textTokens[textTokens.indexOf('마법의') + 1];

    if (text.includes('며우긔')) {
      postText(message.channel, '그만해라.', username);
    } else if (text.includes('잘못')) {
      postText(message.channel, '응.', username);
    } else if (text.includes('잘')) {
      postText(message.channel, '아니.', username);
    } else {
      postText(message.channel,
        `${['응.', '아니.', '그만해라.'][gen.create()(3)]}`, username);
    }
  },

  randomChoice: function(message) {
    let text = message.text;
    let textTokens = text.match(/\S+/g);

    if (textTokens[0] === '!랜덤') {
      let choices = textTokens.slice(1, textTokens.length);
      postText(message.channel,
        `하와와.... 랜덤봇쟝의 추천은 ${choices[gen.create()(choices.length)]}인 거시에요....`,
        '랜덤봇쟝',
        'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/59/5955c11d066b3f95c57e82a5388b2183cdfaa13e_full.jpg');
    }
  },

  noGaon: function(message) {
    postText(message.channel,
      '가온 쓰지 마세요',
      '가온쓰지마세요',
      'https://pbs.twimg.com/media/C05wnnkUcAINUKw.jpg');
  }
};
