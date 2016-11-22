/*global require, describe, it, expect, beforeEach, jasmine*/
'use strict';
var underTest = require('../../lib/alexa/setup'),
  utils = require('../../lib/utils/env-utils');
describe('Alexa setup', () => {
  var api, bot, logError, parser, responder, botPromise, botResolve, botReject;
  beforeEach(() => {
    api = jasmine.createSpyObj('api', ['get', 'post', 'addPostDeployStep']);
    botPromise = new Promise((resolve, reject) => {
      botResolve = resolve;
      botReject = reject;
    });
    bot = jasmine.createSpy().and.returnValue(botPromise);
    parser = jasmine.createSpy();
    logError = jasmine.createSpy();
    responder = jasmine.createSpy();
    underTest(api, bot, logError, parser, responder);
  });
  describe('message processor', () => {
    const singleMessageTemplate = {
      request: {
        intent: {
          name: 'intent 1',
          slots: {
            value: 'HELLO_SLOT'
          }
        }
      },
      session: { user: { userId: 'user1'} }
    };
    it('wires the POST request for alexa to the message processor', () => {
      expect(api.post.calls.count()).toEqual(1);
      expect(api.post).toHaveBeenCalledWith('/alexa', jasmine.any(Function));
    });
    describe('processing a single message', () => {
      var handler;
      beforeEach(() => {
        handler = api.post.calls.argsFor(0)[1];
      });
      it('breaks down the message and puts it into the parser', () => {
        handler({body: singleMessageTemplate, env: {alexaAppName: 'Claudia Alexa Bot'}});
        expect(parser).toHaveBeenCalledWith({
          request: {
            intent: {
              name: 'intent 1',
              slots: {
                value: 'HELLO_SLOT'
              }
            }
          },
          session: { user: { userId: 'user1'} }
        });
      });
      it('passes the parsed value to the bot if a message can be parsed', (done) => {
        parser.and.returnValue('MSG1');
        handler({body: singleMessageTemplate, env: {}});
        Promise.resolve().then(() => {
          expect(bot).toHaveBeenCalledWith('MSG1', { body: singleMessageTemplate, env: {} });
        }).then(done, done.fail);
      });
      it('responds when the bot resolves', (done) => {
        parser.and.returnValue({sender: 'user1', text: 'MSG1', type: 'alexa-skill'});
        botResolve('Hello Alexa');
        handler({body: singleMessageTemplate, env: {alexaAppName: utils.encode('Claudia Alexa Bot')}}).then(() => {
          expect(responder).toHaveBeenCalledWith('Hello Alexa', 'Claudia Alexa Bot');
        }).then(done, done.fail);
      });
      it('can work with bot responses as strings', (done) => {
        botResolve('Hello Alexa');
        parser.and.returnValue({sender: 'user1', text: 'Hello'});
        handler({body: singleMessageTemplate, env: {alexaAppName: utils.encode('Claudia Alexa Bot')}}).then(() => {
          expect(responder).toHaveBeenCalledWith('Hello Alexa', 'Claudia Alexa Bot');
        }).then(done, done.fail);

      });
      it('logs error when the bot rejects without responding', (done) => {
        parser.and.returnValue('MSG1');

        handler({body: singleMessageTemplate, env: {alexaAppName: 'Claudia Alexa Bot'}}).then(() => {
          expect(responder).not.toHaveBeenCalled();
          expect(logError).toHaveBeenCalledWith('No No');
        }).then(done, done.fail);

        botReject('No No');
      });
      it('logs the error when the responder throws an error', (done) => {
        parser.and.returnValue('MSG1');
        responder.and.throwError('XXX');
        botResolve('Yes');
        handler({body: singleMessageTemplate, env: {alexaAppName: 'Claudia Alexa Bot'}}).then(() => {
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

          parser.and.returnValue('MSG1');
        });
        it('waits for the responders to resolve before completing the request', (done) => {
          handler({body: singleMessageTemplate, env: {alexaAppName: 'Claudia Alexa Bot'}}).then(() => {
            hasResolved = true;
          });

          botPromise.then(() => {
            expect(hasResolved).toBeFalsy();
          }).then(done, done.fail);

          botResolve('YES');
        });
        it('resolves when the responder resolves', (done) => {
          handler({body: singleMessageTemplate, env: {alexaAppName: 'Claudia Alexa Bot'}}).then((message) => {
            expect(message).toEqual('As Promised!');
          }).then(done, done.fail);

          botPromise.then(() => {
            responderResolve('As Promised!');
          });
          botResolve('YES');
        });
        it('logs error when the responder rejects', (done) => {
          handler({body: singleMessageTemplate, env: {alexaAppName: 'Claudia Alexa Bot'}}).then(() => {
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
