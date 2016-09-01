'use strict';

const rp = require('minimal-request-promise');
const qs = require('querystring');

var token;

function requestToken(appId, appSecret) {
  console.log('request token initiated')
  console.log(appId)
  console.log(appSecret)

  var data = qs.encode({
    grant_type: 'client_credentials',
    client_id: appId,
    client_secret: appSecret,
    scope: 'https://graph.microsoft.com/.default'
  });

  console.log(data)
  const options = {
    /*headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data)
    },*/
    body: data
  };

  return rp.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', options);
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
