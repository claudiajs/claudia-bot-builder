/*global require, describe, it, expect, beforeEach, beforeAll, afterAll jasmine*/
'use strict';
var underTest = require('../../lib/cortana/setup');
var botBuilder = require('botbuilder');
const sinon = require('sinon');
describe('Cortana setup', () => {
  var api, bot, logError, parser, responder, universal, botPromise, builder;

  beforeAll(() => {
    builder = sinon.stub(botBuilder, 'ChatConnector').returns({ 'listen': Function });
    universal = sinon.stub(botBuilder, 'UniversalBot').returns({
      'use': function () {
        return {
          'receive': (event, next) => { next(); },
          'send': (event, next) => { next(); }
        };
      }
    });
  });

  afterAll(() => {
    builder.restore();
    universal.restore();
  });

  beforeEach(() => {
    api = jasmine.createSpyObj('api', ['get', 'post', 'addPostDeployStep']);
    bot = jasmine.createSpy().and.returnValue(botPromise);
    parser = jasmine.createSpy();
    logError = jasmine.createSpy();
    responder = jasmine.createSpy();

    underTest(api, bot, logError, parser, responder);
  });
  describe('message processor', () => {
    const envConfig = { cortanaAppId: 'YXBwX3Rlc3Q=', cortanaAppPassword: 'YmVzdA==' };
    const singleMessageTemplate = {
      type: 'message',
      id: '9GaUpYmT6YU',
      timestamp: '2018-04-26T17:31:37.6846046Z',
      serviceUrl: 'https://CortanaBFChannelEastUs.azurewebsites.net/',
      channelId: 'cortana',
      from:
        { id: 'E4144E913F76C' },
      conversation: { id: 'd35535' },
      recipient: { id: 'bot_cortana' },
      locale: 'en-US',
      text: 'hello cortana',
      entities:
        [{ type: 'Intent', name: 'None', entities: [] },
          {
            type: 'AuthorizationToken',
            token: 'eyJhbGc',
            status: 0
          },
        { type: 'DeviceInfo', supportsDisplay: 'true' }]
    };
    it('wires the POST request for cortana to the message processor', () => {
      expect(api.post.calls.count()).toEqual(1);
      expect(api.post).toHaveBeenCalledWith('/cortana', jasmine.any(Function));
    });
    describe('processing a single message', () => {
      var handler;
      beforeEach(() => {
        handler = api.post.calls.argsFor(0)[1];
      });
      it('connector to be called', () => {
        handler({ body: singleMessageTemplate, env: envConfig });
        expect(builder.called).toBeTruthy();
      });
      it('Universal bot to be called', () => {
        handler({ body: singleMessageTemplate, env: envConfig });
        expect(universal.called).toBeTruthy();
      });
    });
  });
});
