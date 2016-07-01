/*global describe, it, expect, require, jasmine */
'use strict';
var reply = require('../../lib/telegram/reply'),
  https = require('https');

describe('Telegram Reply', () => {
  
  it('includes the telegram access token in the path request', done => {
    https.request.pipe(callOptions => {
      expect(callOptions).toEqual(jasmine.objectContaining({
        method: 'POST',
        hostname: 'api.telegram.org',
        path: '/botACCESS123/sendMessage',
        headers: {
          'Content-Type': 'application/json'
        }
      }));
      done();
    });
    reply(
      {sender: 'some123ChatId', text: 'ello Telegram', originalRequest: {message: {}}, type: 'telegram'},
      'ello Telegram',
      'ACCESS123'
    );
  });

  it('sends text messages as a string', done => {
    https.request.pipe(callOptions => {
      expect(JSON.parse(callOptions.body)).toEqual({
        chat_id: 'some123ChatId',
        text: 'ello Telegram'
      });
      done();
    });
    reply(
      {sender: 'some123ChatId', text: 'ello Telegram', originalRequest: {message: {}}, type: 'telegram'},
      'ello Telegram',
      'ACCESS123'
    );
  });

  it('does not resolve before the https endpoint responds', done => {
    https.request.pipe(done);
    reply(
      {sender: 'some123ChatId', text: 'ello Telegram', originalRequest: {message: {}}, type: 'telegram'},
      'ello Telegram',
      'ACCESS123'
    ).then(done.fail, done.fail);
  });
  
  it('resolves when the https endpoint responds with 200', done => {
    https.request.pipe(() => {
      setTimeout(() => {
        https.request.calls[0].respond('200', 'OK', 'ello Telegram');
      }, 10);
    });
    reply(
      {sender: 'some123ChatId', text: 'ello Telegram', originalRequest: {message: {}}, type: 'telegram'},
      'ello Telegram',
      'ACCESS123'
    ).then(done, done.fail);
  });

});