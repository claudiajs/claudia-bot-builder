'use strict';
const rp = require('minimal-request-promise');
const skBearerToken = require('./token');
const retry = require('oh-no-i-insist');

const retryTimeout = 500;
const numRetries = 2;

function sendReply(skypeId, message, contextId, authToken){
  if (typeof message === 'string')
    message = {
      content: message
    };

  const options = {
    method: 'POST',
    hostname: 'apis.skype.com',
    path: `/v2/conversations/${skypeId}/activities`,
    port: 443,
    headers: {
      'Authorization': 'Bearer ' + authToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: message
    })
  };

  if(contextId){
    options.headers['ContextId'] = contextId;
  }
  return rp(options);
}

module.exports = function skReply(skypeAppId, skypePrivateKey, skypeId, message, contextId) {
  return retry(
    () => {
      return skBearerToken.getToken(skypeAppId, skypePrivateKey)
      .then((token) => sendReply(skypeId, message, contextId, token));
    },
    retryTimeout,
    numRetries,
    error => error.statusCode === 401, // expired / invalid token error status code
    skBearerToken.clearToken
  );
};
