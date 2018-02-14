'use strict';

const url = require('url');
const path = require('path');

module.exports = function validateAlexaSignature(request) {
  const certSignatureUrl = request.headers['SignatureCertChainUrl'] || request.headers['signaturecertchainurl'],
    signature = request.headers['Signature'] || request.headers['signature'],
    timestamp = request.body.request.timestamp;

  if (!signature || !certSignatureUrl || !timestamp) {
    return false;
  }

  const parsedCertSignatureUrl = url.parse(certSignatureUrl, true);
  const normalizedPathName = path.normalize(parsedCertSignatureUrl.pathname);
  if (parsedCertSignatureUrl.protocol != 'https:' || parsedCertSignatureUrl.hostname != 's3.amazonaws.com' ||
    (parsedCertSignatureUrl.port > 0 && parsedCertSignatureUrl.port != 443) || normalizedPathName.indexOf('/echo.api/') !== 0) {
    return false;
  }

  // todo: 
  // - download chain file (`parsedCertSignatureUrl` from above)
  // - Ensure The signing certificate has not expired (examine both the Not Before and Not After dates)
  // - Check that the domain name `echo-api.amazon.com` is present in the Subject Alternative Names (SANs) section of the signing certificate
  // - Check that All certificates in the chain combine to create a chain of trust to a trusted root CA certificate
  // - Once you have determined that the signing certificate is valid, extract the public key from it.
  // - Base64-decode the Signature header value on the request to obtain the encrypted signature
  // - Use the public key extracted from the signing certificate to decrypt the encrypted signature to produce the asserted hash value
  // - Generate a SHA-1 hash value from the full HTTPS request body to produce the derived hash value
  // - Compare the asserted hash value and derived hash values to ensure that they match
  // per https://developer.amazon.com/docs/custom-skills/host-a-custom-skill-as-a-web-service.html?ref_=pe_3490300_259883220#checking-the-signature-of-the-request 

  const requestTimeSeconds = Date.parse(timestamp) / 1000,
    currentTime = Date.now() / 1000,
    MAX_ALLOWED_TIME = 150;

  if (currentTime > requestTimeSeconds + MAX_ALLOWED_TIME) {
    return false;
  }

  //let normalizedCertSignatureUrl = `${parsedCertSignatureUrl.protocol}://${parsedCertSignatureUrl.host}/echo.api/echo-api-cert.pem`;
  return true;
};