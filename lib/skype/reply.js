'use strict';
const rp = require('minimal-request-promise');
const skBearerToken = require('./token');
const retry = require('oh-no-i-insist');

const retryTimeout = 500;
const numRetries = 2;

function sendReply(conversationId, message, contextId, authToken){
  if (typeof message === 'string')
    message = {
      type: 'message/text',
      text: message
    };

  const options = {
    headers: {
      'Authorization': 'Bearer ' + authToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  };

  if (contextId){
    options.headers['ContextId'] = contextId;
  }
  return rp.post(`https://apis.skype.com/v3/conversations/${conversationId}/activities`, options);
}

module.exports = function skReply(skypeAppId, skypePrivateKey, conversationId, message, contextId) {
  return retry(
    () => {
      return skBearerToken.getToken(skypeAppId, skypePrivateKey)
      .then((token) => sendReply(conversationId, message, contextId, token));
    },
    retryTimeout,
    numRetries,
    error => error.statusCode === 401, // expired / invalid token error status code
    skBearerToken.clearToken
  );
};
