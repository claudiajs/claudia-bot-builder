'use strict';

const rp = require('minimal-request-promise');
const qs = require('querystring');

var token;

module.exports = {
  getToken (){
    return token;
  },
  setToken (value){
    token = value;
  },
  requestToken(appId, appSecret) {
    const options = {
      method: 'POST',
      hostname: 'login.microsoftonline.com',
      path: '/v2/common/oauth2/v2.0/token',
      port: 443,
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: qs.encode({
        client_id: appId,
        client_secret: appSecret,
        grant_type: 'client_credentials',
        scope: 'https://graph.microsoft.com/.default'
      })
    };

    return rp(options);
  }
};