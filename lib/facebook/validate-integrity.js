'use strict';

const crypto = require('crypto');
const tsscmp = require('tsscmp');

module.exports = function validateFbRequestIntegrity(request) {
  const xHubSignature = request.headers['X-Hub-Signature'] || request.headers['x-hub-signature'];
  const parsedXHubSignature = xHubSignature.split('=');
  const serverSignature = crypto.createHmac(parsedXHubSignature[0], request.env.facebookAppSecret).update(Buffer(JSON.stringify(request.body)).toString('utf8')).digest('hex');
  return tsscmp(parsedXHubSignature[1], serverSignature);
};
