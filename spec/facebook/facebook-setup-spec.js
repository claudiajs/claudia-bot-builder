/*global require, describe, it, expect, beforeEach, jasmine*/
'use strict';
var underTest = require('../../lib/facebook/setup');
describe('Facebook setup', () => {
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
  describe('token validator', () => {
    it('wires the GET request for facebook to a token validator', () => {
      expect(api.get.calls.count()).toEqual(1);
      expect(api.get).toHaveBeenCalledWith('/facebook', jasmine.any(Function), {success: {contentType: 'text/plain'}});
    });
    it('replies with hub.challenge when tokens match', () => {
      let handler = api.get.calls.argsFor(0)[1],
        result = handler({
          queryString: {
            'hub.verify_token': '12345',
            'hub.challenge': 'XXAA'
          }, env: {
            facebookVerifyToken: '12345'
          }
        });
      expect(result).toEqual('XXAA');
    });
    it('replies with Error when tokens do not match', () => {
      let handler = api.get.calls.argsFor(0)[1],
        result = handler({
          queryString: {
            'hub.verify_token': '12345',
            'hub.challenge': 'XXAA'
          }, env: {
            facebookVerifyToken: '12346'
          }
        });
      expect(result).toEqual('Error');
    });
  });
  describe('message processor', () => {
    const singleMessageTemplate = {
      'object':'page',
      'entry':[{
        'id': 'PAGE_ID',
        'time': 1457764198246,
        'messaging':[
          { 'A': 'B' }
        ]
      }]
    };
    it('wires the POST request for facebook to the message processor', () => {
      expect(api.post.calls.count()).toEqual(1);
      expect(api.post).toHaveBeenCalledWith('/facebook', jasmine.any(Function));
    });
    describe('processing a single message', () => {
      var handler;
      beforeEach(() => {
        handler = api.post.calls.argsFor(0)[1];
      });
      it('should fail if x hub signature does not match', done => {
        handler({body: singleMessageTemplate, rawBody: '{"object":"page","entry":[{"id":"PAGE_ID","time":1457764198246,"messaging":[{"A":"B"}]}]}', headers: {'X-Hub-Signature': 'sha1=12345'}, env: {facebookAccessToken: 'ABC', facebookAppSecret: '54321'}})
          .catch(err => {
            expect(err).toBe('X-Hub-Signatures does not match');
            return;
          })
          .then(done, done.fail);
      });
      it('breaks down the message and puts it into the parser', () => {
        handler({body: singleMessageTemplate, env: {facebookAccessToken: 'ABC'}});
        expect(parser.calls.argsFor(0)[0]).toEqual({'A': 'B'});
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
        botResolve('Yes Yes');
        handler({body: singleMessageTemplate, env: {facebookAccessToken: 'ABC'}}).then((message) => {
          expect(message).toBe('ok');
          expect(responder).toHaveBeenCalledWith('user1', 'Yes Yes', 'ABC');
        }).then(done, done.fail);
      });
      it('can work with bot responses as strings', (done) => {
        bot.and.returnValue('Yes!');
        parser.and.returnValue({sender: 'user1', text: 'MSG1'});
        handler({body: singleMessageTemplate, env: {facebookAccessToken: 'ABC'}}).then((message) => {
          expect(message).toBe('ok');
          expect(responder).toHaveBeenCalledWith('user1', 'Yes!', 'ABC');
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
        handler({body: singleMessageTemplate, env: {facebookAccessToken: 'ABC'}}).then((message) => {
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
          handler({body: singleMessageTemplate, env: {facebookAccessToken: 'ABC'}}).then(() => {
            hasResolved = true;
          });

          botPromise.then(() => {
            expect(hasResolved).toBeFalsy();
          }).then(done, done.fail);

          botResolve('YES');
        });
        it('resolves when the responder resolves', (done) => {
          handler({body: singleMessageTemplate, env: {facebookAccessToken: 'ABC'}}).then((message) => {
            expect(message).toEqual('ok');
          }).then(done, done.fail);

          botPromise.then(() => {
            responderResolve('As Promised!');
          });
          botResolve('YES');
        });
        it('logs error when the responder rejects', (done) => {
          handler({body: singleMessageTemplate, env: {facebookAccessToken: 'ABC'}}).then((message) => {
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
        'object':'page',
        'entry':[{
          'id': 'PAGE_ID',
          'time': 1457764198246,
          'messaging':[
            { 'A': 'B' },
            { 'C': 'D' }
          ]
        }, {
          'id': 'PAGE_ID',
          'time': 1457764198246,
          'messaging':[
            { 'E': 'F' },
            { 'G': 'H' }
          ]
        }]
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
            text: 'text' + index
          };
        });
      });
      it('parses messages in sequence', () => {
        handler({body: multiMessageTemplate, env: {facebookAccessToken: 'ABC'}});
        expect(parser.calls.count()).toBe(4);
        expect(parser.calls.argsFor(0)[0]).toEqual({'A': 'B'});
        expect(parser.calls.argsFor(1)[0]).toEqual({'C': 'D'});
        expect(parser.calls.argsFor(2)[0]).toEqual({'E': 'F'});
        expect(parser.calls.argsFor(3)[0]).toEqual({'G': 'H'});
      });
      it('calls the bot for each message individually', (done) => {
        handler({body: multiMessageTemplate, env: {facebookAccessToken: 'ABC'}});
        Promise.resolve().then(() => {
          expect(bot.calls.count()).toEqual(4);
          expect(bot).toHaveBeenCalledWith({sender: 'sender1', text: 'text1'}, {body: multiMessageTemplate, env: {facebookAccessToken: 'ABC'}});
          expect(bot).toHaveBeenCalledWith({sender: 'sender2', text: 'text2'}, {body: multiMessageTemplate, env: {facebookAccessToken: 'ABC'}});
          expect(bot).toHaveBeenCalledWith({sender: 'sender3', text: 'text3'}, {body: multiMessageTemplate, env: {facebookAccessToken: 'ABC'}});
          expect(bot).toHaveBeenCalledWith({sender: 'sender4', text: 'text4'}, {body: multiMessageTemplate, env: {facebookAccessToken: 'ABC'}});
        }).then(done, done.fail);
      });
      it('calls the responders for each bot response individually', (done) => {
        handler({body: multiMessageTemplate, env: {facebookAccessToken: 'ABC'}});
        Promise.resolve().then(() => {
          botPromises[0].resolve('From first');
          botPromises[1].resolve('From second');
          return botPromises[1];
        }).then(() => {
          expect(responder).toHaveBeenCalledWith('sender1', 'From first', 'ABC');
          expect(responder).toHaveBeenCalledWith('sender2', 'From second', 'ABC');
        }).then(done, done.fail);
      });
      it('does not resolve until all the responders resolve', (done) => {
        var hasResolved;
        handler({body: multiMessageTemplate, env: {facebookAccessToken: 'ABC'}}).then(() => {
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
        handler({body: multiMessageTemplate, env: {facebookAccessToken: 'ABC'}}).then((message) => {
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
