/*global require, describe, it, expect, beforeEach, jasmine*/
'use strict';
const underTest = require('../../lib/google-hangouts-chat/setup'),
  utils = require('../../lib/utils/env-utils');
describe('Google Hangouts Chat setup', () => {
  let api, bot, logError, parser, responder, botPromise, botResolve, botReject;
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
      'type': 'MESSAGE',
      'eventTime': '2017-03-02T19:02:59.910959Z',
      'space': {
        'name': 'spaces/AAAAAAAAAAA',
        'displayName': 'Ramdom Discussion Room',
        'type': 'ROOM'
      },
      'message': {
        'name': 'spaces/AAAAAAAAAAA/messages/CCCCCCCCCCC',
        'sender': {
          'name': 'users/12345678901234567890',
          'displayName': 'John Doe',
          'avatarUrl': 'https://lh3.googleusercontent.com/.../photo.jpg',
          'email': 'john@example.com'
        },
        'createTime': '2017-03-02T19:02:59.910959Z',
        'text': 'Hello World',
        'thread': {
          'name': 'spaces/AAAAAAAAAAA/threads/BBBBBBBBBBB'
        }
      }
    };
    it('wires the POST request for Google Hangouts Chat to the message processor', () => {
      expect(api.post.calls.count()).toEqual(1);
      expect(api.post).toHaveBeenCalledWith('/google-hangouts-chat', jasmine.any(Function));
    });
    describe('processing a single message', () => {
      let handler;
      beforeEach(() => {
        handler = api.post.calls.argsFor(0)[1];
      });
      it('breaks down the message and puts it into the parser', () => {
        handler({body: singleMessageTemplate, env: {googleHangoutsAppName: 'Google Hangouts Chat Bot'}});
        expect(parser).toHaveBeenCalledWith(singleMessageTemplate);
      });
      it('passes the parsed value to the bot if a message can be parsed', (done) => {
        parser.and.returnValue('MSG1');
        handler({body: singleMessageTemplate, env: {}});
        Promise.resolve().then(() => {
          expect(bot).toHaveBeenCalledWith('MSG1', { body: singleMessageTemplate, env: {} });
        }).then(done, done.fail);
      });
      it('responds when the bot resolves', (done) => {
        parser.and.returnValue({sender: 'user1', text: 'MSG1', type: 'google-hangouts-chat-message'});
        botResolve('Hello Google Hangouts');
        handler({body: singleMessageTemplate, env: {googleHangoutsAppName: utils.encode('Google Hangouts Bot')}}).then(() => {
          expect(responder).toHaveBeenCalledWith('Hello Google Hangouts', 'Google Hangouts Bot');
        }).then(done, done.fail);
      });
      it('can work with bot responses as strings', (done) => {
        botResolve('Hello Google Hangouts');
        parser.and.returnValue({sender: 'user1', text: 'Hello'});
        handler({body: singleMessageTemplate, env: {googleHangoutsAppName: utils.encode('Google Hangouts Bot')}}).then(() => {
          expect(responder).toHaveBeenCalledWith('Hello Google Hangouts', 'Google Hangouts Bot');
        }).then(done, done.fail);

      });
      it('logs error when the bot rejects without responding', (done) => {
        parser.and.returnValue('MSG1');

        handler({body: singleMessageTemplate, env: {googleHangoutsAppName: 'Google Hangouts Bot'}}).then(() => {
          expect(responder).not.toHaveBeenCalled();
          expect(logError).toHaveBeenCalledWith('No No');
        }).then(done, done.fail);

        botReject('No No');
      });
      it('logs the error when the responder throws an error', (done) => {
        parser.and.returnValue('MSG1');
        responder.and.throwError('XXX');
        botResolve('Yes');
        handler({body: singleMessageTemplate, env: {googleHangoutsAppName: 'Google Hangouts Bot'}}).then(() => {
          expect(logError).toHaveBeenCalledWith(jasmine.any(Error));
        }).then(done, done.fail);
      });
      describe('working with promises in responders', () => {
        let responderResolve, responderReject, responderPromise, hasResolved;
        beforeEach(() => {
          responderPromise = new Promise((resolve, reject) => {
            responderResolve = resolve;
            responderReject = reject;
          });
          responder.and.returnValue(responderPromise);

          parser.and.returnValue('MSG1');
        });
        it('waits for the responders to resolve before completing the request', (done) => {
          handler({body: singleMessageTemplate, env: {googleHangoutsAppName: 'Google Hangouts Bot'}}).then(() => {
            hasResolved = true;
          });

          botPromise.then(() => {
            expect(hasResolved).toBeFalsy();
          }).then(done, done.fail);

          botResolve('YES');
        });
        it('resolves when the responder resolves', (done) => {
          handler({body: singleMessageTemplate, env: {googleHangoutsAppName: 'Google Hangouts Bot'}}).then((message) => {
            expect(message).toEqual('As Promised!');
          }).then(done, done.fail);

          botPromise.then(() => {
            responderResolve('As Promised!');
          });
          botResolve('YES');
        });
        it('logs error when the responder rejects', (done) => {
          handler({body: singleMessageTemplate, env: {googleHangoutsAppName: 'Google Hangouts Bot'}}).then(() => {
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
