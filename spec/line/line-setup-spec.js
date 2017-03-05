/*global require, describe, it, expect, beforeEach, jasmine*/
'use strict';
var underTest = require('../../lib/line/setup');
describe('Line setup', () => {
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
      'events':[{
        'replyToken': 'RandomLineReplyToken',
        'type': 'message',
        'source':{
          'type': 'user',
          'userId': 'someUserId'
        },
        'message': {
          'id': '123',
          'type': 'text',
          'text': 'Hello Line'
        }
      }]
    };
    it('wires the POST request for line to the message processor', () => {
      expect(api.post.calls.count()).toEqual(1);
      expect(api.post).toHaveBeenCalledWith('/line', jasmine.any(Function));
    });
    describe('processing a single message', () => {
      var handler;
      beforeEach(() => {
        handler = api.post.calls.argsFor(0)[1];
      });
      it('breaks down the message and puts it into the parser', () => {
        handler({body: singleMessageTemplate, env: {lineChannelAccessToken: 'ABC'}});
        expect(parser.calls.argsFor(0)[0]).toEqual({
          'replyToken': 'RandomLineReplyToken', 'type': 'message',
          'source':{'type': 'user', 'userId': 'someUserId'},
          'message': {'id': '123', 'type': 'text', 'text': 'Hello Line'}
        });
      });
      it('passes the parsed value to the bot if a message can be parsed', (done) => {
        parser.and.returnValue({replyToken: 'RandomLineReplyToken'});
        handler({body: singleMessageTemplate, env: {}});
        Promise.resolve().then(() => {
          expect(bot).toHaveBeenCalledWith({replyToken: 'RandomLineReplyToken'}, { body: singleMessageTemplate, env: {} });
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
        parser.and.returnValue({replyToken: 'randomToken', text: 'MSG1'});
        botResolve('Yes Yes');
        handler({body: singleMessageTemplate, env: {lineChannelAccessToken: new Buffer('ABC').toString('base64')}}).then((message) => {
          expect(message).toBe('ok');
          expect(responder).toHaveBeenCalledWith('randomToken', 'Yes Yes', 'ABC');
        }).then(done, done.fail);
      });
      it('can work with bot responses as strings', (done) => {
        bot.and.returnValue('Yes!');
        parser.and.returnValue({replyToken: 'randomToken', text: 'MSG1'});
        handler({body: singleMessageTemplate, env: {lineChannelAccessToken: new Buffer('ABC').toString('base64')}}).then((message) => {
          expect(message).toBe('ok');
          expect(responder).toHaveBeenCalledWith('randomToken', 'Yes!', 'ABC');
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
        handler({body: singleMessageTemplate, env: {lineChannelAccessToken: new Buffer('ABC').toString('base64')}}).then((message) => {
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
          handler({body: singleMessageTemplate, env: {lineChannelAccessToken: 'ABC'}}).then(() => {
            hasResolved = true;
          });

          botPromise.then(() => {
            expect(hasResolved).toBeFalsy();
          }).then(done, done.fail);

          botResolve('YES');
        });
        it('resolves when the responder resolves', (done) => {
          handler({body: singleMessageTemplate, env: {lineChannelAccessToken: 'ABC'}}).then((message) => {
            expect(message).toEqual('ok');
          }).then(done, done.fail);

          botPromise.then(() => {
            responderResolve('As Promised!');
          });
          botResolve('YES');
        });
        it('logs error when the responder rejects', (done) => {
          handler({body: singleMessageTemplate, env: {lineChannelAccessToken: 'ABC'}}).then((message) => {
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
    describe('multiple messages', () => {
      const multiMessageTemplate = {
        'events': [
          {
            'replyToken': 'RandomLineReplyToken',
            'type': 'message',
            'source': {
              'type': 'user',
              'userId': 'someUserId'
            },
            'message': {
              'id': '123',
              'type': 'text',
              'text': 'Hello Line'
            }
          },
          {
            'replyToken': 'RandomLineReplyToken',
            'type': 'message',
            'source': {
              'type': 'user',
              'userId': 'otherUserId'
            },
            'message': {
              'id': '456',
              'type': 'text',
              'text': 'Bye Line'
            }
          }
        ]
      };
      var botPromises,
        responderPromises,
        handler,
        buildPromiseFor = (array) => {
          var pResolve, pReject, promise;
          promise = new Promise((resolve, reject) => {
            pResolve = resolve;
            pReject = reject;
          });
          promise.resolve = pResolve;
          promise.reject = pReject;
          array.push(promise);
          return promise;
        };

      beforeEach(() => {
        var index = 0;
        botPromises = [];
        responderPromises = [];
        bot.and.callFake(() => {
          return buildPromiseFor(botPromises);
        });
        responder.and.callFake(() => {
          return buildPromiseFor(responderPromises);
        });
        handler = api.post.calls.argsFor(0)[1];
        parser.and.callFake(() => {
          index += 1;
          return {
            sender: 'sender' + index,
            text: 'text' + index,
            replyToken: 'RandomLineReplyToken',
            type: 'line'
          };
        });
      });
      it('parses messages in sequence', () => {
        handler({body: multiMessageTemplate, env: {lineChannelAccessToken: 'ABC'}});
        expect(parser.calls.count()).toBe(2);
        expect(parser.calls.argsFor(0)[0]).toEqual({
          'replyToken': 'RandomLineReplyToken',
          'type': 'message',
          'source':{
            'type': 'user',
            'userId': 'someUserId'
          },
          'message': {
            'id': '123',
            'type': 'text',
            'text': 'Hello Line'
          }
        });
        expect(parser.calls.argsFor(1)[0]).toEqual({
          'replyToken': 'RandomLineReplyToken',
          'type': 'message',
          'source':{
            'type': 'user',
            'userId': 'otherUserId'
          },
          'message': {
            'id': '456',
            'type': 'text',
            'text': 'Bye Line'
          }
        });
      });
      it('calls the bot for each message individually', (done) => {
        handler({body: multiMessageTemplate, env: {lineChannelAccessToken: 'ABC'}});
        Promise.resolve().then(() => {
          expect(bot.calls.count()).toEqual(2);
          expect(bot).toHaveBeenCalledWith({sender: 'sender1', text: 'text1', replyToken: 'RandomLineReplyToken', type: 'line'}, {body: multiMessageTemplate, env: {lineChannelAccessToken: 'ABC'}});
          expect(bot).toHaveBeenCalledWith({sender: 'sender2', text: 'text2', replyToken: 'RandomLineReplyToken', type: 'line'}, {body: multiMessageTemplate, env: {lineChannelAccessToken: 'ABC'}});
        }).then(done, done.fail);
      });
      it('calls the responders for each bot response individually', (done) => {
        handler({body: multiMessageTemplate, env: {lineChannelAccessToken: new Buffer('ABC').toString('base64')}});
        Promise.resolve().then(() => {
          botPromises[0].resolve('From first');
          botPromises[1].resolve('From second');
          return botPromises[1];
        }).then(() => {
          expect(responder).toHaveBeenCalledWith('RandomLineReplyToken', 'From first', 'ABC');
          expect(responder).toHaveBeenCalledWith('RandomLineReplyToken', 'From second', 'ABC');
        }).then(done, done.fail);
      });
      it('does not resolve until all the responders resolve', (done) => {
        var hasResolved;
        handler({body: multiMessageTemplate, env: {lineChannelAccessToken: 'ABC'}}).then(() => {
          hasResolved = true;
        }).then(done.fail, done.fail);
        Promise.resolve().then(() => {
          botPromises.forEach((p) => p.resolve('group'));
          return botPromises.pop();
        }).then(() => {
          responderPromises.slice(1).forEach((p) => p.resolve('result'));
          return responderPromises.pop();
        }).then(() => {
          expect(hasResolved).toBeFalsy();
        }).then(done, done.fail);
      });
      it('resolves when all the responders resolve', (done) => {
        handler({body: multiMessageTemplate, env: {lineChannelAccessToken: 'ABC'}}).then((message) => {
          expect(message).toEqual('ok');
        }).then(done, done.fail);
        Promise.resolve().then(() => {
          botPromises.forEach((p) => p.resolve('group'));
          return botPromises.pop();
        }).then(() => {
          responderPromises.forEach((p) => p.resolve('result'));
          return responderPromises.pop();
        });
      });
    });

  });
});
