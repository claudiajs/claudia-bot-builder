'use strict';
const rp = require('minimal-request-promise');

function kikReply(messageObject, message, username, kikApiKey) {
  console.log(messageObject)
  console.log(message)
  console.log(username)
  console.log(kikApiKey)
  var data = [{
    body: typeof message === 'string' ?  message : message.text,
    to: message.sender,
    type: messageObject.type,
    chatId: message.chatId
  }];

  const options = {
    headers: {
      'Authorization': `Basic ${new Buffer(username + ':' + kikApiKey).toString('base64')}`,
      'content-type': 'application/json'
    },
    body: {
      messages: JSON.stringify(data)
    }
  };

  return rp.post('https://api.kik.com/v1/message', options);
}

module.exports = kikReply;