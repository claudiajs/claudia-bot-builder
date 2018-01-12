'use strict';

const url = require('url');

module.exports = function validateAlexaSignature(request) {
  const certSignatureUrl = request.headers['SignatureCertChainUrl'] || request.headers['signaturecertchainurl'];
  const parsedCertSignatureUrl = url.parse(certSignatureUrl.split('='), true);

  if (parsedCertSignatureUrl.protocol != 'https' || parsedCertSignatureUrl.hostname != 's3.amazonaws.com' ||
    (parsedCertSignatureUrl.port && parsedCertSignatureUrl.port != 443) || parsedCertSignatureUrl.pathname.indexOf('/echo.api/') == 0) {
    return false;
  }

  //let normalizedCertSignatureUrl = `${parsedCertSignatureUrl.protocol}://${parsedCertSignatureUrl.host}/echo.api/echo-api-cert.pem`;
  return true;
};