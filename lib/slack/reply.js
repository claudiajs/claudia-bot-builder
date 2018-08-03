'use strict';

const rp = require('minimal-request-promise');
const qs = require('querystring');
const Api = require('claudia-api-builder');

module.exports = function slackReply(botResponse, type) {
  if(type === 'dialog_submission' || type === 'dialog_cancellation') 
    return '';
  
  if (typeof botResponse === 'string')
    return {
      text: botResponse
    };

  if (botResponse && botResponse.dialog && botResponse.trigger_id) {
    const body = qs.stringify(botResponse);
    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Content-length': Buffer.byteLength(body)
      },
      body: body
    };

    return rp.post('https://slack.com/api/dialog.open', options)
      .then((response) => {
        const data = JSON.parse(response.body);
        if(data.ok)
          return new Api.ApiResponse('', { 'Content-Type': 'text/plain' }, 200);

        return data.response_metadata.messages[0];
      })
      .catch(() => {
        return {
          text: 'err'
        };
      });
  }
    
  return botResponse;
};
