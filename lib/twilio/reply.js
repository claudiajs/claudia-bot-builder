'use strict';
const rp = require('minimal-request-promise');

function twilioReply(twilioAccountSid, twilioAuthToken, twilioSendingNumber, toNumber, message){
  if (typeof message === 'string') {
    message = {
      To: toNumber,
      From: twilioSendingNumber,
      Body: message
    };
  } else {
    message = {
      To: message.sender,
      From: twilioSendingNumber,
      Body: message.text
    }
  }

  const options = {
    headers: {
      'Authorization': `Basic ${new Buffer(twilioAccountSid + ':' + twilioAuthToken).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: message
  };

  console.log(options);
  return rp.post(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, options);
}


module.exports = twilioReply;