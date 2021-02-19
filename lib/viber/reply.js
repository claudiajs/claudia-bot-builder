'use strict';
const rp = require('minimal-request-promise');
const promiseEach = require('../promise-each');

function sendSingle(receiver, authToken, messageObj) {
  let message;

  if (typeof messageObj === 'string') {
    message = {
      type: 'text',
      auth_token: authToken,
      text: messageObj,
      receiver: receiver
    };
  } else {
    message = messageObj;
    if (!message.auth_token)
      message.auth_token = authToken;
    if (!message.receiver)
      message.receiver = receiver;
  }
  const body = JSON.stringify(message);
  const options = {
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body, 'utf8')
    },
    body: body
  };

  return rp.post('https://chatapi.viber.com/pa/send_message', options);
}

function sendReply(receiver, messages, authToken) {
  return promiseEach(m => sendSingle(receiver, authToken, m))(messages);
}

module.exports = sendReply;
