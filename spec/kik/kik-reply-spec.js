/*global describe, it, expect, require, jasmine */
'use strict';
var reply = require('../../lib/kik/reply'),
  https = require('https');

describe('Kik Reply', () => {

  it('includes the Kik Authorization and Content type application/json in the header', done => {
    https.request.pipe(callOptions => {
      var data = {messages: [{ body: 'hello Kik', to: 'randomKikUser', type: 'text', chatId: 123}]};
      expect(callOptions).toEqual(jasmine.objectContaining({
        method: 'POST',
        hostname: 'api.kik.com',
        path: '/v1/message',
        headers: {
          'Authorization': `Basic ${new Buffer('someRandomKikUsername' + ':' + 'RandomKikApiKey').toString('base64')}`,
          'content-type': 'application/json'
        },
        body: JSON.stringify(data)
      }));
      done();
    });
    reply({sender: 'randomKikUser', kikType: 'text', chatId: 123},
      {text: 'hello Kik'}, 'someRandomKikUsername', 'RandomKikApiKey');
  });

  it('sends messages as a string', done => {
    https.request.pipe(callOptions => {
      expect(callOptions.body).toEqual(JSON.stringify({
        messages: [
          {
            body: 'hello Kik',
            to: 'randomKikUser',
            type: 'text',
            chatId: 123
          }
        ]}));
      done();
    });
    reply({sender: 'randomKikUser', kikType: 'text', chatId: 123},
      'hello Kik', 'someRandomKikUsername', 'RandomKikApiKey');
  });

  it('does not resolve before the https endpoint responds', done => {
    https.request.pipe(done);
    reply({sender: 'randomKikUser', kikType: 'text', chatId: 123},
      'hello Kik', 'someRandomKikUsername', 'RandomKikApiKey'
    ).then(done.fail, done.fail);
  });

  it('resolves when the https endpoint responds with 200', done => {
    https.request.pipe(() => {
      setTimeout(() => {
        https.request.calls[0].respond('200', 'OK', 'Hello Kik');
      }, 10);
    });
    reply({sender: 'randomKikUser', kikType: 'text', chatId: 123},
      'hello Kik', 'someRandomKikUsername', 'RandomKikApiKey').then(done, done.fail);
  });

});
