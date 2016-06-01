'use strict';

const rp = require('minimal-request-promise');

module.exports = function skReply(skypeId, message, contextId) {
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
      'Authorization': '', //TODO: Get the bearers Oauth2 token
      'Content-Type': 'application/json',
      'ContextId': contextId
    },
    body: JSON.stringify({
      message: message
    })
  };

  return rp(options);
};
