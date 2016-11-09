/*global require, describe, it, expect, beforeEach, jasmine*/
'use strict';
var underTest = require('../../lib/viber/setup');
describe('Viber setup', () => {
  var api, bot, logError, parser, responder, botPromise, botResolve, botReject;
  beforeEach(() => {
    api = jasmine.createSpyObj('api', ['post', 'addPostDeployStep']);
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
      event: 'message',
      timestamp: 1477292830416,
      message_token: 12345,
      sender: {
        id: 'abc',
        name: 'Claudia',
        avatar: 'https://example.com/path/to.image'
      },
      'message': {
        text: 'Hello',
        type: 'text'
      }
    };
    it('shoyld wire the POST request for Viber to the message processor', () => {
      expect(api.post.calls.count()).toEqual(1);
      expect(api.post).toHaveBeenCalledWith('/viber', jasmine.any(Function));
    });
    describe('processing a single message', () => {
      var handler;
      beforeEach(() => {
        handler = api.post.calls.argsFor(0)[1];
      });
      it('should break down the message and put it into the parser', () => {
        handler({ body: singleMessageTemplate, env: { viberAccessToken: 'ABC' } });
        expect(parser).toHaveBeenCalledWith(singleMessageTemplate);
      });
      it('should pass the parsed value to the bot if a message can be parsed', (done) => {
        parser.and.returnValue('MSG1');
        handler({body: singleMessageTemplate, env: {}});
        Promise.resolve().then(() => {
          expect(bot).toHaveBeenCalledWith('MSG1', { body: singleMessageTemplate, env: {} });
        }).then(done, done.fail);
      });
      it('should not invoke the bot if the message cannot be parsed', (done) => {
        parser.and.returnValue(false);
        handler({body: singleMessageTemplate, env: {}}).then((message) => {
          expect(message).toBe('ok');
          expect(bot).not.toHaveBeenCalled();
        }).then(done, done.fail);
      });
      it('should respond when the bot resolves', (done) => {
        parser.and.returnValue({sender: 'user1', text: 'MSG1'});
        handler({ body: singleMessageTemplate, env: { viberAccessToken: 'ABC' } }).then(() => {
          expect(responder).toHaveBeenCalledWith('user1', 'Yes Yes', 'ABC');
        }).then(done, done.fail);

        botResolve('Yes Yes');
      });
      it('should work with bot responses as strings', (done) => {
        bot.and.returnValue('Yes!');
        parser.and.returnValue({sender: 'user1', text: 'MSG1'});
        handler({body: singleMessageTemplate, env: {viberAccessToken: 'ABC'}}).then(() => {
          expect(responder).toHaveBeenCalledWith('user1', 'Yes!', 'ABC');
        }).then(done, done.fail);

      });
      it('should log an error when the bot rejects without responding', (done) => {
        parser.and.returnValue('MSG1');

        handler({body: singleMessageTemplate, env: {}}).then(() => {
          expect(responder).not.toHaveBeenCalled();
          expect(logError).toHaveBeenCalledWith('No No');
        }).then(done, done.fail);

        botReject('No No');
      });
      it('should log an error when the responder throws an error', (done) => {
        parser.and.returnValue('MSG1');
        responder.and.throwError('XXX');
        botResolve('Yes');
        handler({body: singleMessageTemplate, env: {viberAccessToken: 'ABC'}}).then(() => {
          expect(logError).toHaveBeenCalledWith(jasmine.any(Error));
        }).then(done, done.fail);
      });
      describe('should work with promises in responders', () => {
        var responderResolve, responderReject, responderPromise, hasResolved;
        beforeEach(() => {
          responderPromise = new Promise((resolve, reject) => {
            responderResolve = resolve;
            responderReject = reject;
          });
          responder.and.returnValue(responderPromise);

          parser.and.returnValue('MSG1');
        });
        it('should wait for the responders to resolve before completing the request', (done) => {
          handler({body: singleMessageTemplate, env: {viberAccessToken: 'ABC'}}).then(() => {
            hasResolved = true;
          });

          botPromise.then(() => {
            expect(hasResolved).toBeFalsy();
          }).then(done, done.fail);

          botResolve('YES');
        });
        it('should resolve when the responder resolves', (done) => {
          handler({body: singleMessageTemplate, env: {viberAccessToken: 'ABC'}}).then((message) => {
            expect(message).toEqual('As Promised!');
          }).then(done, done.fail);

          botPromise.then(() => {
            responderResolve('As Promised!');
          });
          botResolve('YES');
        });
        it('should log error when the responder rejects', (done) => {
          handler({body: singleMessageTemplate, env: {viberAccessToken: 'ABC'}}).then(() => {
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
