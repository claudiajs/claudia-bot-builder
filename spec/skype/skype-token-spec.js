/*global describe, it, expect, require, jasmine */
'use strict';
var token = require('../../lib/skype/token'),
  https = require('https'),
  qs = require('querystring');

describe('Skype Token', () => {

  describe('getting the access token makes a request if the token is undefined', () => {
    it('includes the Skype AppId and Skype App Secret in the request body with the proper content length', done => {
      var credentialsData = qs.encode({
        grant_type: 'client_credentials',
        client_id: 'someSkypeAppId123',
        client_secret: 'someSkypePrivateKey123',
        scope: 'https://api.botframework.com/.default'
      });
      
      https.request.pipe(callOptions => {
        expect(callOptions).toEqual(jasmine.objectContaining({
          method: 'POST',
          hostname: 'login.microsoftonline.com',
          path: '/botframework.com/oauth2/v2.0/token',
          headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/x-www-form-urlencoded',
            'content-length': Buffer.byteLength(credentialsData)
          },
          body: credentialsData
        }));
        
        done();
      });
      token.getToken('someSkypeAppId123', 'someSkypePrivateKey123');
    });

    it('does not resolve before the https endpoint responds', done => {
      https.request.pipe(done);
      token.getToken('someSkypeAppId123', 'someSkypePrivateKey123').then(done.fail, done.fail);
    });

    it('resolves when the https endpoint responds with 200', done => {
      https.request.pipe(() => {
        setTimeout(() => {
          https.request.calls[0].respond('200', 'OK', '{"access_token":"someAccessToken123"}');
        }, 10);
      });
      token.getToken('someSkypeAppId123', 'someSkypePrivateKey123').then(done, done.fail);
    });
  });

});