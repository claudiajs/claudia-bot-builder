'use strict';

const rp = require('minimal-request-promise');
const qs = require('querystring');

module.exports = function(channelId, message, token) {
  if (typeof channelId !== 'string')
    throw new Error('Channel ID is required for Slack reply and it needs to be a string.');

  if (['string', 'object'].indexOf(typeof message) < 0)
    throw new Error('Message needs to be string or object for Slack reply.');

  if (typeof message === 'object' && !message.text && !message.attachment)
    throw new Error('Message object requires text or attachment property for Slack reply.');

  if (typeof token !== 'string')
    throw new Error('Token is required for Slack reply.');

  let params = {
    as_user: true,
    token: token,
    channel: channelId
  };

  if (typeof message === 'string') {
    params.text = message;
  } else {
    Object.assign(params, message);
  }

  return rp.post('https://slack.com/api/chat.postMessage', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: qs.encode(params)
  });
};
