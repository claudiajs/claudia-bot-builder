/*global describe, it, expect, require, jasmine */
var reply = require('../lib/facebook/reply'),
  https = require('https');
describe('Facebook Reply', () => {
  it('includes the token in the path request', done => {
    https.request.pipe(callOptions => {
      expect(callOptions).toEqual(jasmine.objectContaining({
        method: 'POST',
        hostname: 'graph.facebook.com',
        path: '/v2.6/me/messages?access_token=ACCESS123',
        headers: {
          'Content-Type': 'application/json'
        }
      }));
      done();
    });
    reply('user123', 'Hi there', 'ACCESS123');
  });
  it('sends string messages as a text object', done => {
    https.request.pipe(callOptions => {
      expect(JSON.parse(callOptions.body)).toEqual({
        recipient: {
          id: 'user123'
        },
        message: {
          text: 'Hi there'
        }
      });
      done();
    });
    reply('user123', 'Hi there', 'ACCESS123');
  });
  it('sends complex messages without transforming into a text object', done => {
    https.request.pipe(callOptions => {
      expect(JSON.parse(callOptions.body)).toEqual({
        recipient: {
          id: 'user123'
        },
        message: {
          template: 'big',
          contents: {
            title: 'red'
          }
        }
      });
      done();
    });
    reply('user123', {template: 'big', contents: { title: 'red'} }, 'ACCESS123');
  });
  it('does not resolve before the https endpoint responds', done => {
    https.request.pipe(done);
    reply('user123', {template: 'big', contents: { title: 'red'} }, 'ACCESS123').then(done.fail, done.fail);
  });
  it('resolves when the https endpoint responds with 200', done => {
    https.request.pipe(() => {
      setTimeout(() => {
        https.request.calls[0].respond('200', 'OK', 'Hi there');
      }, 10);
    });
    reply('user123', {template: 'big', contents: { title: 'red'} }, 'ACCESS123').then(done, done.fail);
  });
});
