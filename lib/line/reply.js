'use strict';
const rp = require('minimal-request-promise');

function lineReply(replyToken, message, lineChannelAccessToken) {
  console.log(`replyToken in REPLY is ${replyToken}`);
  var messages = [];
  if (typeof message === 'string') {
    messages = [{
      text: message,
      type: 'text'
    }];
  } else if (Array.isArray(message)) {
    message.forEach(msg => {
      if (typeof msg === 'string') {
        let singleMessage = {
          text: msg,
          type: 'text'
        };
        messages.push(singleMessage);
      } else {
        messages.push(msg);
      }
    });
  } else {
    if(!message.type) throw new Error('Your LINE message is required to have a type');
    messages = [message];
  }

  let data = {
    replyToken: replyToken,
    messages: messages
  };


  const options = {
    headers: {
      'Authorization': `Bearer ${lineChannelAccessToken}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data, 'utf8')
    },
    body: data
  };
  console.log(options);
  return rp.post('https://api.line.me/v2/bot/message/reply', options);
}

module.exports = lineReply;