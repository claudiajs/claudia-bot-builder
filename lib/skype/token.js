'use strict';

const rp = require('minimal-request-promise');
const qs = require('querystring');

var token;

// curl -X POST
// -H "Cache-Control: no-cache"
// -H "Content-Type: "
// -d 'client_id=<your-app-id>&client_secret=<your-app-secret>&grant_type=client_credentials&scope=https%3A%2F%2Fgraph.microsoft.com%2F.default'
// 'https://login.microsoftonline.com/common/oauth2/v2.0/token'

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