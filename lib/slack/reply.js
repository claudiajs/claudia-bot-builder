'use strict';

const rp = require('minimal-request-promise');
const qs = require('querystring');

module.exports = function slackReply(botResponse, token) {
  if (typeof botResponse === 'string')
    return {
      text: botResponse
    };

  if (botResponse.dialog && botResponse.trigger_id) {
    botResponse.token = token;
    const options = {
      headers: {
        'Content-type': 'application/json'
      },
      body: qs.stringify(botResponse)
    };

    return rp.post('https://slack.com/api/dialog.open', options);
  }
    
  return botResponse;
};
