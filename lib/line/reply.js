'use strict';
const rp = require('minimal-request-promise');

function lineReply(replyToken, message, lineChannelAccessToken) {
  if(!message.type) throw new Error('Your LINE message is required to have a type');
  let data = {
    replyToken: replyToken,
    messages: [message]
  };

  const options = {
    headers: {
      'Authorization': `Basic ${lineChannelAccessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  return rp.post('https://api.line.me/v2/bot/message/reply', options);
}

module.exports = lineReply;