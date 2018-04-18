/*global describe, it, expect, require, jasmine, beforeEach */
var reply = require('../../lib/facebook/reply'),
  https = require('https');

describe('Facebook Reply', () => {
  'use strict';
  beforeEach(() =>{
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
  });

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

  it('sends large text messages split into several', done => {
    var longLongMessage = new Array(201).join('blok ');

    https.request.pipe(function () {
      this.respond('200', 'OK', 'Hi there');
    });

    reply('user123', longLongMessage, 'ACCESS123').then(() => {
      expect(https.request.calls.length).toEqual(2);
      expect(JSON.parse(https.request.calls[0].args[0].body)).toEqual({
        recipient: {
          id: 'user123'
        },
        message: {
          text: new Array(640/5).join('blok ') + 'blok'
        }
      });
      expect(JSON.parse(https.request.calls[1].args[0].body)).toEqual({
        recipient: {
          id: 'user123'
        },
        message: {
          text: new Array((1000 - 640)/5).join('blok ') + 'blok'
        }
      });
    }).then(done, done.fail);
  });

  it('sends requests in sequence', done => {
    var fiveHundred = new Array(101).join('blok ');

    https.request.pipe(() => {
      Promise.resolve()
        .then(() => {
          expect(https.request.calls.length).toEqual(1);
        })
        .then(done);
    });

    reply('user123', fiveHundred, 'ACCESS123');
  });

  describe('when an array is passed', () => {
    it('does not send the second request until the first one completes', done => {
      let answers = ['foo', 'bar'];
      https.request.pipe(() => {
        Promise.resolve()
          .then(() => {
            expect(https.request.calls.length).toEqual(1);
          })
          .then(done);
      });
      reply('user123', answers, 'ACCESS123');
    });
    it('sends the requests in sequence', done => {
      let answers = ['foo', 'bar'];
      https.request.pipe(function () {
        this.respond('200', 'OK');
        if (https.request.calls.length === 2) {
          expect(JSON.parse(https.request.calls[0].body[0])).toEqual({recipient:{id:'user123'},message:{text:'foo'}});
          expect(JSON.parse(https.request.calls[1].body[0])).toEqual({recipient:{id:'user123'},message:{text:'bar'}});
          done();
        }
      });
      reply('user123', answers, 'ACCESS123');

    });

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

  it('does not send a message if message is not provided', () => {
    reply('user123', null, 'ACCESS123')
      .then(() => {
        expect(https.request.calls).toBeUndefined();
      })
      .catch(err => console.log(err));

    reply('user123', false, 'ACCESS123')
      .then(() => {
        expect(https.request.calls).toBeUndefined();
      })
      .catch(err => console.log(err));

    reply('user123', undefined, 'ACCESS123')
      .then(() => {
        expect(https.request.calls).toBeUndefined();
      })
      .catch(err => console.log(err));
  });

  it('sets a typing action if "sender_action" is passed', done => {
    https.request.pipe(callOptions => {
      expect(JSON.parse(callOptions.body)).toEqual({
        recipient: {
          id: 'user123'
        },
        sender_action: 'typing_on'
      });
      done();
    });
    reply('user123', { sender_action: 'typing_on' }, 'ACCESS123');
  });

  it('sets a notification type if "notification_type" is passed', done => {
    https.request.pipe(callOptions => {
      expect(JSON.parse(callOptions.body)).toEqual({
        recipient: {
          id: 'user123'
        },
        notification_type: 'SILENT',
        message: {}
      });
      done();
    });
    reply('user123', { notification_type: 'SILENT' }, 'ACCESS123');
  });

  it('sets a messaging type if "messaging_type" is passed', done => {
    https.request.pipe(callOptions => {
      expect(JSON.parse(callOptions.body)).toEqual({
        recipient: {
          id: 'user123'
        },
        messaging_type: 'RESPONSE',
        message: {}
      });
      done();
    });
    reply('user123', { messaging_type: 'RESPONSE' }, 'ACCESS123');
  });

  it('sets a message tag if "message_tag" is passed', done => {
    https.request.pipe(callOptions => {
      expect(JSON.parse(callOptions.body)).toEqual({
        recipient: {
          id: 'user123'
        },
        tag: 'ACCOUNT_UPDATE',
        message: {}
      });
      done();
    });
    reply('user123', { message_tag: 'ACCOUNT_UPDATE' }, 'ACCESS123');
  });

  it('does not resolve before the https endpoint responds', done => {
    https.request.pipe(done);
    reply('user123', {template: 'big', contents: { title: 'red'} }, 'ACCESS123').then(done.fail, done.fail);
  });

  it('resolves when the https endpoint responds with 200', done => {
    https.request.pipe(function () {
      this.respond('200', 'OK', 'Hi there');
    });
    reply('user123', {template: 'big', contents: { title: 'red'} }, 'ACCESS123').then(done, done.fail);
  });

});
