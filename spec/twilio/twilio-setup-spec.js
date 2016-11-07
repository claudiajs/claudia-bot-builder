/*global require, describe, it, expect, beforeEach, jasmine*/
'use strict';
var setup = require('../../lib/twilio/setup');
const qs = require('querystring');

describe('Twilio setup', () => {
  var api, bot, logError, parser, responder, botPromise, botResolve, botReject;
  beforeEach(() => {
    api = jasmine.createSpyObj('api', ['post', 'addPostDeployStep']);
    botPromise = new Promise((resolve, reject) => {
      botResolve = resolve;
      botReject = reject;
    });
    bot = jasmine.createSpy().and.returnValue(botPromise);
    logError = jasmine.createSpy();
    parser = jasmine.createSpy();
    responder = jasmine.createSpy();
    setup(api, bot, logError, parser, responder);
  });

  describe('message processor', () => {
    const messageTemplate = {body: qs.stringify({
      To: '+4444444444',
      From: '+333333333',
      Body: 'SMS Twilio'
    }), env: {
      TWILIO_ACCOUNT_SID: 'randomTwilioAccountSID',
      TWILIO_AUTH_TOKEN: 'randomTwilioAuthToken',
      TWILIO_NUMBER: '+4444444444'
    }};
    it('wires the POST request for twilio to the message processor', () => {
      expect(api.post.calls.count()).toEqual(1);
      expect(api.post).toHaveBeenCalledWith('/twilio', jasmine.any(Function), { success: { contentType: 'text/xml' }});
    });
    describe('processing a single message', () => {
      var handler;
      beforeEach(() => {
        handler = api.post.calls.argsFor(0)[1];
      });
      it('breaks down the message and puts it into the parser', () => {
        handler(messageTemplate);
        expect(parser).toHaveBeenCalledWith(qs.stringify({
          To: '+4444444444',
          From: '+333333333',
          Body: 'SMS Twilio'
        }));
      });
      it('passes the parsed value to the bot if a message can be parsed', (done) => {
        parser.and.returnValue('SMS Twilio');
        handler(messageTemplate);
        Promise.resolve().then(() => {
          expect(bot).toHaveBeenCalledWith('SMS Twilio', messageTemplate);
        }).then(done, done.fail);
      });
      it('does not invoke the bot if the message cannot be parsed', (done) => {
        parser.and.returnValue(false);
        handler(messageTemplate).then((message) => {
          expect(message).toBe('<Response></Response>');
          expect(bot).not.toHaveBeenCalled();
        }).then(done, done.fail);
      });
      it('responds when the bot resolves', (done) => {
        parser.and.returnValue({sender: '+333333333', text: 'SMS Twilio'});
        botResolve('SMS Twilio');
        handler(messageTemplate).then((message) => {
          expect(message).toBe('<Response></Response>');
          expect(responder).toHaveBeenCalledWith('randomTwilioAccountSID', 'randomTwilioAuthToken', new Buffer('+4444444444', 'base64').toString('ascii'), '+333333333', 'SMS Twilio');
        }).then(done, done.fail);
      });
      it('can work with bot responses as strings', (done) => {
        bot.and.returnValue('SMS Twilio');
        parser.and.returnValue({sender: '+333333333', text: 'SMS Twili'});
        handler(messageTemplate).then(() => {
          expect(responder).toHaveBeenCalledWith('randomTwilioAccountSID', 'randomTwilioAuthToken', new Buffer('+4444444444', 'base64').toString('ascii'), '+333333333', 'SMS Twilio');
        }).then(done, done.fail);

      });
      it('logs error when the bot rejects without responding', (done) => {
        parser.and.returnValue('SMS Twilio');

        handler(messageTemplate).then(() => {
          expect(responder).not.toHaveBeenCalled();
          expect(logError).toHaveBeenCalledWith('NOT AN SMS Twilio');
        }).then(done, done.fail);

        botReject('NOT AN SMS Twilio');
      });
      it('logs the error when the responder throws an error', (done) => {
        parser.and.returnValue('SMS Twilio');
        responder.and.throwError('XXX');
        botResolve('SMS Twilio');
        handler({body: messageTemplate}).then(() => {
          expect(logError).toHaveBeenCalledWith(jasmine.any(Error));
        }).then(done, done.fail);
      });
      describe('working with promises in responders', () => {
        var responderResolve, responderReject, responderPromise, hasResolved;
        beforeEach(() => {
          responderPromise = new Promise((resolve, reject) => {
            responderResolve = resolve;
            responderReject = reject;
          });
          responder.and.returnValue(responderPromise);

          parser.and.returnValue('SMS Twilio');
        });
        it('waits for the responders to resolve before completing the request', (done) => {
          handler(messageTemplate).then(() => {
            hasResolved = true;
          });

          botPromise.then(() => {
            expect(hasResolved).toBeFalsy();
          }).then(done, done.fail);

          botResolve('YES');
        });
        it('resolves when the responder resolves', (done) => {
          handler(messageTemplate).then(done, done.fail);

          botPromise.then(() => {
            responderResolve('As Promised!');
          });
          botResolve('YES');
        });
        it('logs error when the responder rejects', (done) => {
          handler(messageTemplate).then(() => {
            expect(logError).toHaveBeenCalledWith('Bomb!');
          }).then(done, done.fail);

          botPromise.then(() => {
            responderReject('Bomb!');
          });
          botResolve('YES');
        });
      });
    });
  });
});
