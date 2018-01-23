'use strict';

const url = require('url');

module.exports = function validateAlexaSignature(request) {
  const certSignatureUrl = request.headers['SignatureCertChainUrl'] || request.headers['signaturecertchainurl'],
    signature = request.headers['Signature'] || request.headers['signature'],
    timestamp = request.body.request.timestamp;

  if (!signature || !certSignatureUrl || !timestamp) {
    return false;
  }
  const parsedCertSignatureUrl = url.parse(certSignatureUrl.split('='), true);

  if (parsedCertSignatureUrl.protocol != 'https:' || parsedCertSignatureUrl.hostname != 's3.amazonaws.com' ||
    (parsedCertSignatureUrl.port > 0 && parsedCertSignatureUrl.port != 443) || parsedCertSignatureUrl.pathname.indexOf('/echo.api/') > -1) {
    return false;
  }

  const requestTimeSeconds = Date.parse(timestamp) / 1000,
    currentTime = Date.now() / 1000,
    MAX_ALLOWED_TIME = 150;

  if (currentTime > requestTimeSeconds + MAX_ALLOWED_TIME) {
    return false;
  }

  //let normalizedCertSignatureUrl = `${parsedCertSignatureUrl.protocol}://${parsedCertSignatureUrl.host}/echo.api/echo-api-cert.pem`;
  return true;
};