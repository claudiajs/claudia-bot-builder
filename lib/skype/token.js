'use strict';

const rp = require('minimal-request-promise');
const qs = require('querystring');

var token;

function requestToken(appId, appSecret) {
  var data = qs.encode({
    client_id: appId,
    client_secret: appSecret,
    grant_type: 'client_credentials',
    scope: 'https://graph.microsoft.com/.default'
  });

  const options = {
    method: 'POST',
    hostname: 'login.microsoftonline.com',
    path: '/common/oauth2/v2.0/token',
    port: 443,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data)
    },
    body: data
  };

  return rp(options);
}

module.exports = {
  getToken (appId, appSecret){
    if (!token){
      return requestToken(appId, appSecret)
        .then(response => {
          var body = JSON.parse(response.body);
          token = body.access_token;
          return token;
        });
    }
    return Promise.resolve(token);
  },
  clearToken () {
    token = undefined;
  }
};
