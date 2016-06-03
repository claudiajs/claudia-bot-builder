'use strict';

const rp = require('minimal-request-promise');
const qs = require('querystring');
const fs = require('fs');

var token;

module.exports = {
  getToken (){
    return token;
  },
  setToken (value){
    token = value;
  },
  requestToken(appId, appSecret) {
    var data = qs.encode({
      client_id: appId,
      client_secret: appSecret,
      grant_type: 'client_credentials',
      scope: 'https://graph.microsoft.com/.default'
    })

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
};