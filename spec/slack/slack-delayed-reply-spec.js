/*global jasmine, describe, it, expect */
'use strict';

const slackDelayedReply = require('../../lib/slack/delayed-reply');
const https = require('https');

describe('Slack delayed reply', () => {
  it('should throw an error if message or response are not specified', () => {
    expect(() => slackDelayedReply()).toThrowError('Original bot request and response are required');
  });

  it('should send a text message', done => {
    https.request.pipe(callOptions => {
      expect(callOptions).toEqual(jasmine.objectContaining({
        method: 'POST',
        hostname: 'some.fake',
        path: '/url',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: 'Hello'
        })
      }));
      done();
    });
    slackDelayedReply({
      originalRequest: {
        response_url: 'https://some.fake/url'
      }
    }, 'Hello');
  });

  it('should send an object', done => {
    https.request.pipe(callOptions => {
      expect(callOptions).toEqual(jasmine.objectContaining({
        method: 'POST',
        hostname: 'some.fake',
        path: '/url',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ attachment: {} })
      }));
      done();
    });
    slackDelayedReply({
      originalRequest: {
        response_url: 'https://some.fake/url'
      }
    }, { attachment: {} });
  });
});
