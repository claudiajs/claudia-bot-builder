'use strict';
const rp = require('minimal-request-promise');
const promiseEach = require('promise-each');

function sendSingle(message, botId) {
  var data = {
    bot_id: botId,
    text: typeof message === 'string' ? message : message.text
  };
  
  const options = {
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  return rp.post('https://api.groupme.com/v3/bots/post', options);
}

function gmReply(message, botId) {
  return promiseEach(m => sendSingle(m, botId))(message);
}

module.exports = gmReply;
