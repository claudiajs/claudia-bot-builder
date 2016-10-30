/*global describe, it, expect, require, jasmine */
'use strict';
var reply = require('../../lib/groupme/reply'),
  https = require('https');

describe('GroupMe Reply', () => {

  it('includes the Content type application/json in the header', done => {
    https.request.pipe(callOptions => {
      var data = { bot_id: 123123, text: 'hello groupme' };
      expect(callOptions).toEqual(jasmine.objectContaining({
        method: 'POST',
        hostname: 'api.groupme.com',
        path: '/v3/bots/post',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(data)
      }));
      done();
    });
    reply({ sender: 1, text: 'hello groupme', originalRequest: {}, type: 'groupme'}, 123123);
  });

  it('sends messages as a string', done => {
    https.request.pipe(callOptions => {
      expect(callOptions.body).toEqual(JSON.stringify({
        bot_id: 123123,
        text: 'hello groupme'
      }));
      done();
    });
    reply('hello groupme', 123123);
  });

  it('does not resolve before the https endpoint responds', done => {
    https.request.pipe(done);
    reply({ sender: 1, text: 'hello groupme', originalRequest: {}, type: 'groupme'}, 123123
    ).then(done.fail, done.fail);
  });

  it('resolves when the https endpoint responds with 200', done => {
    https.request.pipe(() => {
      setTimeout(() => {
        https.request.calls[0].respond('200', 'OK', 'Hello GroupMe');
      }, 10);
    });
    reply({ sender: 1, text: 'hello groupme', originalRequest: {}, type: 'groupme'}, 123123).then(done, done.fail);
  });

});
