'use strict';

const rp = require('minimal-request-promise');
const qs = require('querystring');

var token;
var contextId;

function requestToken(appId, appSecret) {
  
  var data = qs.encode({
    grant_type: 'client_credentials',
    client_id: appId,
    client_secret: appSecret,
    scope: 'https://graph.microsoft.com/.default'
  });
  
  const options = {
    headers: {
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded',
      'content-length': Buffer.byteLength(data)
    },
    body: data
  };

  return rp.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', options);
}

module.exports = {
  getContextId (){
    return contextId;
  },
  getToken (appId, appSecret){
    if (!token){
      return requestToken(appId, appSecret)
        .then(response => {
          console.log(response)
          var body = JSON.parse(response.body);
          token = body.access_token;
          contextId = response.headers.contextid;
          console.log(contextId);
          return token;
        });
    }
    return Promise.resolve(token);
  },
  clearToken () {
    token = undefined;
  }
};
