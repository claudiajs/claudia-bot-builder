'use strict';

const crypto = require('crypto');
const tsscmp = require('tsscmp');

module.exports = function validateFbRequestIntegrity(request) {
  const xHubSignature = request.headers['X-Hub-Signature'] || request.headers['x-hub-signature'];
  const parsedXHubSignature = xHubSignature.split('=');
  const serverSignature = crypto.createHmac(parsedXHubSignature[0], request.env.facebookAppSecret).update(request.rawBody).digest('hex');
  return tsscmp(parsedXHubSignature[1], serverSignature);
};
