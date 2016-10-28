/*global require, describe, it, expect, beforeEach, jasmine*/
'use strict';
var underTest = require('../../lib/kik/setup');
describe('Kik setup', () => {
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
      messages: [
        {
          from: 'randomKikUser',
          body: 'hello Kik',
          chatId: 123,
          type: 'test'
        }
      ]
    };
    it('wires the POST request for kik to the message processor', () => {
      expect(api.post.calls.count()).toEqual(1);
      expect(api.post).toHaveBeenCalledWith('/kik', jasmine.any(Function));
    });
    describe('processing a single message', () => {
      var handler;
      beforeEach(() => {
        handler = api.post.calls.argsFor(0)[1];
      });
      it('breaks down the message and puts it into the parser', () => {
        handler({body: singleMessageTemplate, env: {kikUserName: 'randomKikUserName', kikApiKey: 'RandomAPIKey'}});
        expect(parser).toHaveBeenCalledWith({
          from: 'randomKikUser',
          body: 'hello Kik',
          chatId: 123,
          type: 'test'
        });
      });
      it('passes the parsed value to the bot if a message can be parsed', (done) => {
        parser.and.returnValue('MSG1');
        handler({body: singleMessageTemplate, env: {}});
        Promise.resolve().then(() => {
          expect(bot).toHaveBeenCalledWith('MSG1', { body: singleMessageTemplate, env: {} });
        }).then(done, done.fail);
      });
      it('does not invoke the bot if the message cannot be parsed', (done) => {
        parser.and.returnValue(false);
        handler({body: singleMessageTemplate, env: {}}).then((message) => {
          expect(message).toBe('ok');
          expect(bot).not.toHaveBeenCalled();
        }).then(done, done.fail);
      });
      it('responds when the bot resolves', (done) => {
        parser.and.returnValue({sender: 'user1', text: 'MSG1'});
        botResolve('Kik Kik the bucket');
        handler({body: singleMessageTemplate, env: {kikUserName: 'randomKikUserName', kikApiKey: 'RandomAPIKey'}}).then((message) => {
          expect(message).toBe('ok');
          expect(responder).toHaveBeenCalledWith({sender: 'user1', text: 'MSG1'}, 'Kik Kik the bucket', 'randomKikUserName', 'RandomAPIKey');
        }).then(done, done.fail);
      });
      it('can work with bot responses as strings', (done) => {
        bot.and.returnValue('Kik the bucket');
        parser.and.returnValue({sender: 'user1', text: 'Hello'});
        handler({body: singleMessageTemplate, env: {kikUserName: 'randomKikUserName', kikApiKey: 'RandomAPIKey'}}).then((message) => {
          expect(message).toBe('ok');
          expect(responder).toHaveBeenCalledWith({sender: 'user1', text: 'Hello'}, 'Kik the bucket', 'randomKikUserName', 'RandomAPIKey');
        }).then(done, done.fail);

      });
      it('logs error when the bot rejects without responding', (done) => {
        parser.and.returnValue('MSG1');

        handler({body: singleMessageTemplate, env: {}}).then((message) => {
          expect(message).toBe('ok');
          expect(responder).not.toHaveBeenCalled();
          expect(logError).toHaveBeenCalledWith('No No');
        }).then(done, done.fail);

        botReject('No No');
      });
      it('logs the error when the responder throws an error', (done) => {
        parser.and.returnValue('MSG1');
        responder.and.throwError('XXX');
        botResolve('Yes');
        handler({body: singleMessageTemplate, env: {kikUserName: 'randomKikUserName', kikApiKey: 'RandomAPIKey'}}).then((message) => {
          expect(message).toBe('ok');
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
          handler({body: singleMessageTemplate, env: {kikUserName: 'randomKikUserName', kikApiKey: 'RandomAPIKey'}}).then(() => {
            hasResolved = true;
          });

          botPromise.then(() => {
            expect(hasResolved).toBeFalsy();
          }).then(done, done.fail);

          botResolve('YES');
        });
        it('resolves when the responder resolves', (done) => {
          handler({body: singleMessageTemplate, env: {kikUserName: 'randomKikUserName', kikApiKey: 'RandomAPIKey'}}).then((message) => {
            expect(message).toEqual('ok');
          }).then(done, done.fail);

          botPromise.then(() => {
            responderResolve('As Promised!');
          });
          botResolve('YES');
        });
        it('logs error when the responder rejects', (done) => {
          handler({body: singleMessageTemplate, env: {kikUserName: 'randomKikUserName', kikApiKey: 'RandomAPIKey'}}).then((message) => {
            expect(message).toEqual('ok');
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
