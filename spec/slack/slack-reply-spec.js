/*global describe, it, expect */
'use strict';
var reply = require('../../lib/slack/reply');

describe('Slack Reply', () => {

  it('should export a function', () =>
    expect(typeof reply).toBe('function')
  );

  it('should throw an error if channel ID is not provided', () =>
    expect(() => reply()).toThrowError('Channel ID is required for Slack reply and it needs to be a string.')
  );

  it('should throw an error if channel ID is not a string', () => {
    expect(() => reply(123)).toThrowError('Channel ID is required for Slack reply and it needs to be a string.');
    expect(() => reply({ a: 1 })).toThrowError('Channel ID is required for Slack reply and it needs to be a string.');
    expect(() => reply([1, 2, 3])).toThrowError('Channel ID is required for Slack reply and it needs to be a string.');
  });

  it('should throw an error if message is not provided', () =>
    expect(() => reply('C1234567')).toThrowError('Message needs to be string or object for Slack reply.')
  );

  it('should throw an error if message is not a text or an object', () => {
    expect(() => reply('C1234567', 42)).toThrowError('Message needs to be string or object for Slack reply.');
    expect(() => reply('C1234567', 12.34)).toThrowError('Message needs to be string or object for Slack reply.');
    expect(() => reply('C1234567', () => 'hello')).toThrowError('Message needs to be string or object for Slack reply.');
  });

  it('should throw an error if message object is not valid', () => {
    expect(() => reply('C1234567', {})).toThrowError('Message object requires text or attachment property for Slack reply.');
    expect(() => reply('C1234567', { a: 1 })).toThrowError('Message object requires text or attachment property for Slack reply.');
    expect(() => reply('C1234567', [])).toThrowError('Message object requires text or attachment property for Slack reply.');
  });

  it('should throw an error if token is not provided', () =>
    expect(() => reply('C1234567', 'hello')).toThrowError('Token is required for Slack reply.')
  );

  it('should throw an error if token is provided but is not in an expected format', () => {
    expect(() => reply('C1234567', 'hello', 123)).toThrowError('Token is required for Slack reply.');
    expect(() => reply('C1234567', 'hello', ['test'])).toThrowError('Token is required for Slack reply.');
    expect(() => reply('C1234567', 'hello', { a: 1 })).toThrowError('Token is required for Slack reply.');
  });

  it('should send the text message if channel, message and token are provided and valid', () => {
    reply('C1234567', 'Hello!', 'VALID_TOKEN')
      .then(JSON.parse)
      .then(response => {
        expect(response).toEqual({
          ok: true,
          channel: 'C1234567',
          ts: '1484156225.000004',
          message: {
            type: 'message',
            user: 'U1234567',
            text: 'Hello!',
            bot_id: 'B1234567',
            ts: '1484156225.000004'
          }
        });
      });
  });
});
