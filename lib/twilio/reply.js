'use strict';
const rp = require('minimal-request-promise');
const qs = require('querystring');

function twilioReply(twilioAccountSid, twilioAuthToken, twilioSendingNumber, toNumber, message){

  var data = qs.encode({
    To: typeof message === 'string' ? toNumber : message.sender,
    From: twilioSendingNumber,
    Body: typeof message === 'string' ?  message : message.text
  });

  const options = {
    headers: {
      'Authorization': `Basic ${new Buffer(twilioAccountSid + ':' + twilioAuthToken).toString('base64')}`,
      'content-type': 'application/x-www-form-urlencoded',
      'content-length': Buffer.byteLength(data)
    },
    body: data
  };

  return rp.post(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, options);
}


module.exports = twilioReply;