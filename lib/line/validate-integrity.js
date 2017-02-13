'use strict';

const crypto = require('crypto');
const tsscmp = require('tsscmp');

module.exports = function validateFbRequestIntegrity(request) {
  const xLineSignature = request.headers['X-Line-Signature'] || request.headers['x-line-signature'];
  const serverSignature = crypto.createHmac('sha256', new Buffer(request.env.LINE_CHANNEL_SECRET, 'base64').toString('ascii'))
      .update(request.rawBody, 'utf8')
    .digest('base64');
  return tsscmp(xLineSignature, serverSignature);
};
