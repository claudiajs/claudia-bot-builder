'use strict';
const rp = require('minimal-request-promise');
const skBearerToken = require('./token');
const retry = require('oh-no-i-insist');

const retryTimeout = 500;
const numRetries = 2;

function sendReply(skypeId, activity, contextId, authToken){
  console.log('before reply ', skypeId, activity, contextId, authToken);
  if (typeof activity === 'string')
    activity = {
      text: activity
    };

  const options = {
    headers: {
      'Authorization': 'Bearer ' + authToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      activity: activity
    })
  };

  if(contextId){
    options.headers['ContextId'] = contextId;
  }
  return rp.post(`https://skype.botframework.com/v3/conversations/${skypeId}/activities`, options);
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
