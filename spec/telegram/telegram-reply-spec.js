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
      {sender: 'some123ChatId', text: 'Hello Telegram', originalRequest: {message: {}}, type: 'telegram'},
      'Hello Telegram',
      'ACCESS123'
    );
  });

  it('sends text messages as a string', done => {
    https.request.pipe(callOptions => {
      expect(JSON.parse(callOptions.body)).toEqual({
        chat_id: 'some123ChatId',
        text: 'Hello Telegram'
      });
      done();
    });
    reply(
      {sender: 'some123ChatId', originalRequest: {}},
      'Hello Telegram',
      'ACCESS123'
    );
  });

  describe('when an array is passed', () => {
    it('does not send the second request until the first one completes', done => {
      let answers = ['foo', 'bar'];
      https.request.pipe(() => {
        Promise.resolve().then(() => {
          expect(https.request.calls.length).toEqual(1);
        }).then(done);
      });
      reply(
        {sender: 'some123ChatId', originalRequest: {}, type: 'telegram'},
        answers,
        'ACCESS123'
      );
    });
    it('sends the requests in sequence', done => {
      let answers = ['foo', 'bar'];
      https.request.pipe(function () {
        this.respond('200', 'OK');
        if (https.request.calls.length === 2) {
          expect(JSON.parse(https.request.calls[0].body[0])).toEqual({chat_id:'some123ChatId',text:'foo'});
          expect(JSON.parse(https.request.calls[1].body[0])).toEqual({chat_id:'some123ChatId',text:'bar'});
          done();
        }
      });
      reply(
        {sender: 'some123ChatId', originalRequest: {}, type: 'telegram'},
        answers,
        'ACCESS123'
      );
    });

  });

  it('sends custom object as message if user provide an object without method', done => {
    https.request.pipe(callOptions => {
      expect(JSON.parse(callOptions.body)).toEqual({
        chat_id: 'some123ChatId',
        text: 'Hello *Telegram*',
        parse_mode: 'Markdown'
      });
      done();
    });

    reply(
      { sender: 'some123ChatId', text: 'Hello Telegram', originalRequest: { message: {} }, type: 'telegram' },
      { text: 'Hello *Telegram*', parse_mode: 'Markdown'},
      'ACCESS123'
    );
  });

  it('sends custom object as inline query if user provide an object without method after inline query', done => {
    https.request.pipe(callOptions => {
      expect(JSON.parse(callOptions.body)).toEqual({
        chat_id: 'some123ChatId',
        text: 'Hello *Telegram*',
        parse_mode: 'Markdown'
      });
      done();
    });

    reply(
      { sender: 'some123ChatId', text: 'Hello Telegram', originalRequest: { inline_query: {} }, type: 'telegram' },
      { text: 'Hello *Telegram*', parse_mode: 'Markdown'},
      'ACCESS123'
    );
  });

  it('sends custom object with custom method if both object and method are provided', done => {
    https.request.pipe(callOptions => {
      expect(JSON.parse(callOptions.body)).toEqual({
        chat_id: 'some123ChatId',
        text: 'Hello *Telegram*',
        parse_mode: 'Markdown'
      });
      expect(callOptions.href).toEqual('https://api.telegram.org/botACCESS123/sendMessage');
      done();
    });

    reply(
      { sender: 'some123ChatId', text: 'Hello Telegram', originalRequest: { inline_query: {} }, type: 'telegram' },
      { method: 'sendMessage', body: { text: 'Hello *Telegram*', parse_mode: 'Markdown'} },
      'ACCESS123'
    );
  });

  it('does not resolve before the https endpoint responds', done => {
    https.request.pipe(done);
    reply(
      {sender: 'some123ChatId', text: 'Hello Telegram', originalRequest: {message: {}}, type: 'telegram'},
      'Hello Telegram',
      'ACCESS123'
    ).then(done.fail, done.fail);
  });

  it('resolves when the https endpoint responds with 200', done => {
    https.request.pipe(() => {
      setTimeout(() => {
        https.request.calls[0].respond('200', 'OK', 'Hello Telegram');
      }, 10);
    });
    reply(
      {sender: 'some123ChatId', text: 'Hello Telegram', originalRequest: {message: {}}, type: 'telegram'},
      'Hello Telegram',
      'ACCESS123'
    ).then(done, done.fail);
  });

});
