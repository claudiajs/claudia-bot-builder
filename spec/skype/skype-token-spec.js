/*global describe, it, expect, require, jasmine */
'use strict';
var token = require('../../lib/skype/token'),
  https = require('https'),
  qs = require('querystring');

describe('Skype Token', () => {

  describe('getting the access token makes a request if the token is undefined', () => {
    it('includes the Skype AppId and Skype App Secret in the request body with the proper content length', done => {
      var credentialsData = qs.encode({
        client_id: 'someSkypeAppId123',
        client_secret: 'someSkypePrivateKey123',
        grant_type: 'client_credentials',
        scope: 'https://graph.microsoft.com/.default'
      });
      
      https.request.pipe(callOptions => {
        expect(callOptions).toEqual(jasmine.objectContaining({
          method: 'POST',
          hostname: 'login.microsoftonline.com',
          path: '/common/oauth2/v2.0/token',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(credentialsData)
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