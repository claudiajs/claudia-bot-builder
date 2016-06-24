/*global require, describe, it, expect, beforeEach, jasmine*/
'use strict';

const underTest = require('../../lib/slack/setup');

describe('Slack setup', () => {
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

  const singleMessageTemplate = {
    token: 'slack-token',
    team_id: 'T01AB2CDE',
    team_domain: 'claudia',
    channel_id: 'C01BCDE23',
    channel_name: 'botbuilder',
    user_id: 'U01ABCD2E',
    user_name: 'slobodan',
    command: '/why',
    text: 'can\'t I copy the internet?',
    response_url: 'https://hooks.slack.com/commands/T01AB2CDE/12345678901/0a1BCdeFG2hij3KlmnO4PQR5'
  };

  describe('webhook/message processor', () => {
    it('wires the POST request for Slack Slash command to the message processor', () => {
      expect(api.post.calls.count()).toEqual(2);
      expect(api.post).toHaveBeenCalledWith('/slack/slash-command', jasmine.any(Function));
    });

    it('replies with Error when tokens do not match', () => {
      let handler = api.post.calls.argsFor(0)[1];
      handler({
        post: singleMessageTemplate,
        env: {
          slackToken: 'slack-invalid-token'
        }
      });

      expect(responder.calls.count()).toEqual(1);
      expect(responder).toHaveBeenCalledWith('unmatched token slack-token slack-invalid-token');
    });

    it('invokes parser if the request is valid', () => {
      let handler = api.post.calls.argsFor(0)[1];
      handler({
        post: singleMessageTemplate,
        env: {
          slackToken: 'slack-token'
        }
      });

      expect(parser.calls.count()).toEqual(1);
    });

    it('does not invoke the bot if the message cannot be parsed', () => {
      parser.and.returnValue(false);

      let handler = api.post.calls.argsFor(0)[1],
        result = handler({
          post: singleMessageTemplate,
          env: {
            slackToken: 'slack-token'
          }
        });

      result.then(message => {
        expect(message).toBe('ok');
        expect(bot).not.toHaveBeenCalled();
      });
    });

    it('responds when the bot resolves', done => {
      parser.and.returnValue({
        sender: 'User1',
        text: 'MSG1'
      });

      botResolve('Hello');

      let handler = api.post.calls.argsFor(0)[1];
      handler({
        post: singleMessageTemplate,
        env: {
          slackToken: 'slack-token'
        }
      }).then(() => {
        expect(responder).toHaveBeenCalledWith('Hello');
      }).then(done, done.fail);
    });

    it('logs error when the bot rejects without responding', done => {
      parser.and.returnValue('MSG1');

      let handler = api.post.calls.argsFor(0)[1];
      handler({
        post: singleMessageTemplate,
        env: {
          slackToken: 'slack-token'
        }
      }).then(() => {
        expect(responder).not.toHaveBeenCalled();
        expect(logError).toHaveBeenCalledWith('No No');
      }).then(done, done.fail);

      botReject('No No');
    });

    it('logs the error when the responder throws an error', (done) => {
      parser.and.returnValue('MSG1');
      responder.and.throwError('XXX');

      botResolve('Yes');

      let handler = api.post.calls.argsFor(0)[1];
      handler({
        post: singleMessageTemplate,
        env: {
          slackToken: 'slack-token'
        }
      }).then(() => {
        expect(logError).toHaveBeenCalledWith(jasmine.any(Error));
      }).then(done, done.fail);
    });

    it('returns parsed message if valid format is passed', () => {
      parser.and.returnValue('some message');

      let handler = api.post.calls.argsFor(0)[1],
        result = handler({
          post: singleMessageTemplate,
          env: {
            slackToken: 'slack-token'
          }
        });

      result.then(res => expect(res).toEqual('some message'));
    });
  });
});
