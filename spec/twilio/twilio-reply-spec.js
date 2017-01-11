/*global describe, it, expect, require, jasmine */
'use strict';
var reply = require('../../lib/twilio/reply'),
  qs = require('querystring'),
  https = require('https');

describe('Twilio Reply', () => {

  it('includes the Twilio Authorization and Content type x-www-form-urlencoded in the header', done => {
    https.request.pipe(callOptions => {
      var data = qs.encode({ To: '+4444444444', From: '+333333333', Body: 'SMS Twilio'});
      expect(callOptions).toEqual(jasmine.objectContaining({
        method: 'POST',
        hostname: 'api.twilio.com',
        path: '/2010-04-01/Accounts/someRandomTwilioAccountSID/Messages.json',
        headers: {
          'Authorization': `Basic ${new Buffer('someRandomTwilioAccountSID' + ':' + 'RandomTwilioAuthToken').toString('base64')}`,
          'content-type': 'application/x-www-form-urlencoded',
          'content-length': Buffer.byteLength(data)
        },
        body: data
      }));
      done();
    });
    reply('someRandomTwilioAccountSID', 'RandomTwilioAuthToken',
      '+333333333', '+4444444444', 'SMS Twilio');
  });

  it('sends text messages as a string', done => {
    https.request.pipe(callOptions => {
      expect(qs.parse(callOptions.body)).toEqual(jasmine.objectContaining({
        To: '+4444444444',
        From: '+333333333',
        Body: 'SMS Twilio'
      }));
      done();
    });
    reply('someRandomTwilioAccountSID', 'RandomTwilioAuthToken',
      '+333333333', '+4444444444', 'SMS Twilio');
  });

  it('does not resolve before the https endpoint responds', done => {
    https.request.pipe(done);
    reply(
      'someRandomTwilioAccountSID', 'RandomTwilioAuthToken',
      '+333333333', '+4444444444', 'SMS Twilio'
    ).then(done.fail, done.fail);
  });

  it('resolves when the https endpoint responds with 200', done => {
    https.request.pipe(() => {
      setTimeout(() => {
        https.request.calls[0].respond('200', 'OK', 'SMS Twilio');
      }, 10);
    });
    reply(
      'someRandomTwilioAccountSID', 'RandomTwilioAuthToken',
      '+333333333', '+4444444444', 'SMS Twilio'
    ).then(done, done.fail);
  });

});
