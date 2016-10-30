/*global require, describe, it, expect, beforeEach, jasmine*/
'use strict';
var underTest = require('../../lib/groupme/setup');
describe('GroupMe setup', () => {
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
      group_id: 345678,
      text: 'hello GroupMe',
      sender_type: 'user'
    };
    it('wires the POST request for kik to the message processor', () => {
      expect(api.post.calls.count()).toEqual(1);
      expect(api.post).toHaveBeenCalledWith('/groupme', jasmine.any(Function));
    });
    describe('processing a single message', () => {
      var handler;
      beforeEach(() => {
        handler = api.post.calls.argsFor(0)[1];
      });
      it('breaks down the message and puts it into the parser', () => {
        handler({body: singleMessageTemplate, env: {GROUPME_BOT_ID: 123123123}});
        expect(parser).toHaveBeenCalledWith({
          group_id: 345678,
          text: 'hello GroupMe',
          sender_type: 'user'
        });
      });
      it('passes the parsed value to the bot if a message can be parsed', (done) => {
        parser.and.returnValue('Group me with the group');
        handler({body: singleMessageTemplate, env: {GROUPME_BOT_ID: 123123123}});
        Promise.resolve().then(() => {
          expect(bot).toHaveBeenCalledWith('Group me with the group', { body: singleMessageTemplate, env: {GROUPME_BOT_ID: 123123123} });
        }).then(done, done.fail);
      });
      it('does not invoke the bot if the message cannot be parsed', (done) => {
        parser.and.returnValue(false);
        handler({body: singleMessageTemplate, env: {GROUPME_BOT_ID: 123123123}}).then((message) => {
          expect(message).toBe('ok');
          expect(bot).not.toHaveBeenCalled();
        }).then(done, done.fail);
      });
      it('responds when the bot resolves', (done) => {
        parser.and.returnValue({sender: 123123, text: 'Test GroupMe'});
        botResolve('Group me with the group');
        handler({body: singleMessageTemplate, env: {GROUPME_BOT_ID: 123123123}}).then((message) => {
          expect(message).toBe('ok');
          expect(responder).toHaveBeenCalledWith('Group me with the group', 123123123);
        }).then(done, done.fail);
      });
      it('can work with bot responses as strings', (done) => {
        bot.and.returnValue('Group me with the group');
        parser.and.returnValue({sender: 'user1', text: 'Hello'});
        handler({body: singleMessageTemplate, env: {GROUPME_BOT_ID: 123123123}}).then((message) => {
          expect(message).toBe('ok');
          expect(responder).toHaveBeenCalledWith('Group me with the group', 123123123);
        }).then(done, done.fail);

      });
      it('logs error when the bot rejects without responding', (done) => {
        parser.and.returnValue('MSG1');

        handler({body: singleMessageTemplate, env: {GROUPME_BOT_ID: 123123123}}).then((message) => {
          expect(message).toBe('ok');
          expect(responder).not.toHaveBeenCalled();
          expect(logError).toHaveBeenCalledWith('No No GroupMe');
        }).then(done, done.fail);

        botReject('No No GroupMe');
      });
      it('logs the error when the responder throws an error', (done) => {
        parser.and.returnValue('MSG1');
        responder.and.throwError('XXX');
        botResolve('Yes');
        handler({body: singleMessageTemplate, env: {GROUPME_BOT_ID: 123123123}}).then((message) => {
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
          handler({body: singleMessageTemplate, env: {GROUPME_BOT_ID: 123123123}}).then(() => {
            hasResolved = true;
          });

          botPromise.then(() => {
            expect(hasResolved).toBeFalsy();
          }).then(done, done.fail);

          botResolve('YES');
        });
        it('resolves when the responder resolves', (done) => {
          handler({body: singleMessageTemplate, env: {GROUPME_BOT_ID: 123123123}}).then((message) => {
            expect(message).toEqual('ok');
          }).then(done, done.fail);

          botPromise.then(() => {
            responderResolve('As Promised!');
          });
          botResolve('YES');
        });
        it('logs error when the responder rejects', (done) => {
          handler({body: singleMessageTemplate, env: {GROUPME_BOT_ID: 123123123}}).then((message) => {
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
