/*global describe, it, expect, require, jasmine, beforeEach */
var reply = require('../../lib/viber/reply'),
  https = require('https');
describe('Viber Reply', () => {
  'use strict';
  beforeEach(() =>{
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
  });

  it('should include the token in the request', done => {
    https.request.pipe(callOptions => {
      expect(callOptions).toEqual(jasmine.objectContaining({
        protocol: 'https:',
        hostname: 'chatapi.viber.com',
        path: '/pa/send_message',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': 79
        },
        body: '{"type":"text","auth_token":"ACCESS123","text":"Hi there","receiver":"user123"}'
      }));
      done();
    });
    reply('user123', 'Hi there', 'ACCESS123');
  });
  it('should send a string message as a text object', done => {
    https.request.pipe(callOptions => {
      expect(JSON.parse(callOptions.body)).toEqual({
        type: 'text',
        auth_token: 'ACCESS123',
        text: 'Hi there',
        receiver: 'user123'
      });
      done();
    });
    reply('user123', 'Hi there', 'ACCESS123');
  });
  describe('when an array is passed', () => {
    it('should not send the second request until the first one completes', done => {
      let answers = ['foo', 'bar'];
      https.request.pipe(() => {
        Promise.resolve().then(() => {
          expect(https.request.calls.length).toEqual(1);
        }).then(done);
      });
      reply('user123', answers, 'ACCESS123');
    });
    it('should send the requests in sequence', done => {
      let answers = ['foo', 'bar'];
      https.request.pipe(function () {
        this.respond('200', 'OK');
        if (https.request.calls.length === 2) {
          expect(JSON.parse(https.request.calls[0].body[0])).toEqual({
            type: 'text',
            auth_token: 'ACCESS123',
            text: 'foo',
            receiver: 'user123'
          });
          expect(JSON.parse(https.request.calls[1].body[0])).toEqual({
            type: 'text',
            auth_token: 'ACCESS123',
            text: 'bar',
            receiver: 'user123'
          });
          done();
        }
      });
      reply('user123', answers, 'ACCESS123');
    });

  });

  it('should send complex messages without transforming into a text object', done => {
    https.request.pipe(callOptions => {
      expect(JSON.parse(callOptions.body)).toEqual({
        auth_token: 'ACCESS123',
        receiver: 'user123',
        tracking_data: 123,
        type: 'text',
        text: 'random text message'
      });
      done();
    });
    reply('user123', {
      tracking_data: 123,
      type: 'text',
      text: 'random text message'
    }, 'ACCESS123');
  });
  it('should not resolve before the https endpoint responds', done => {
    https.request.pipe(done);
    reply('user123', {template: 'big', contents: { title: 'red'} }, 'ACCESS123').then(done.fail, done.fail);
  });
  it('should resolve when the https endpoint responds with 200', done => {
    https.request.pipe(function () {
      this.respond('200', 'OK', 'Hi there');
    });
    reply('user123', {template: 'big', contents: { title: 'red'} }, 'ACCESS123').then(done, done.fail);
  });
});
