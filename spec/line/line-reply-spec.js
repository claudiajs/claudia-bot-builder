/*global describe, it, expect, require, jasmine */
'use strict';
const reply = require('../../lib/line/reply'),
  https = require('https');

describe('Line Reply', () => {

  it('includes the Line Authorization and Content type application/json in the header', done => {
    https.request.pipe(callOptions => {
      let lineChannelAccessToken = 'LineRandomAccessToken';
      let data = {replyToken: 'randomLineToken', messages: [{type: 'message', text: 'hello Line'}]};
      expect(callOptions).toEqual(jasmine.objectContaining({
        method: 'POST',
        hostname: 'api.line.me',
        path: '/v2/bot/message/reply',
        headers: {
          'Authorization': `Bearer ${lineChannelAccessToken}`,
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(JSON.stringify(data), 'utf8')
        },
        body: JSON.stringify(data)
      }));
      done();
    });
    reply('randomLineToken', {type: 'message', text: 'hello Line'}, 'LineRandomAccessToken');
  });

  it('sends messages as a string', done => {
    https.request.pipe(callOptions => {
      expect(callOptions.body).toEqual(JSON.stringify({
        replyToken: 'randomLineToken',
        messages: [
          {
            type: 'message',
            text: 'hello Line'
          }
        ]}));
      done();
    });
    reply('randomLineToken', {type: 'message', text: 'hello Line'}, 'LineRandomAccessToken');
  });

  it('does not resolve before the https endpoint responds', done => {
    https.request.pipe(done);
    reply('randomLineToken', {type: 'message', text: 'hello Line'}, 'LineRandomAccessToken')
      .then(done.fail, done.fail);
  });

  it('resolves when the https endpoint responds with 200', done => {
    https.request.pipe(() => {
      setTimeout(() => {
        https.request.calls[0].respond('200', 'OK', 'hello Line');
      }, 10);
    });
    reply('randomLineToken', {type: 'message', text: 'hello Line'}, 'LineRandomAccessToken').then(done, done.fail);
  });

});
