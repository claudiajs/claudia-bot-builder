/*global require, describe, it, expect, beforeEach, jasmine*/
'use strict';
var underTest = require('../../lib/google/setup');
describe('Google setup', () => {
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
      'user': {
        'userId': 'USER_ID',
        'accessToken': 'USER_ACCESSTOKEN',
        'locale': 'en-US',
        'lastSeen': '2018-04-25T14:27:02Z'
      },
      'isInSandbox': true
    };
    it('wires the POST request for google to the message processor', () => {
      expect(api.post.calls.count()).toEqual(1);
      expect(api.post).toHaveBeenCalledWith('/google', jasmine.any(Function));
    });
    describe('processing a single message', () => {
      var handler;
      beforeEach(() => {
        handler = api.post.calls.argsFor(0)[1];
      });
      it('connector to be called', () => {
        handler(singleMessageTemplate);
        expect(parser).toHaveBeenCalled();
      });
      it('test promise', () => {
        botReject();
        botResolve();
      });
    });
  });
});
