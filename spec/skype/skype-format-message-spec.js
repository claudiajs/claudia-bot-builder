/*global describe, it, expect, require */
'use strict';

const formatMessage = require('../../lib/skype/format-message');

describe('Skype format message', () => {
  it('should export an object', () => {
    expect(typeof formatMessage).toBe('object');
  });

  describe('Photo', () => {
    it('should be a class', () => {
      const message = new formatMessage.Photo('foo');
      expect(typeof formatMessage.Photo).toBe('function');
      expect(message instanceof formatMessage.Photo).toBeTruthy();
    });

    it('should throw an error if photo url is not provided', () => {
      expect(() => new formatMessage.Photo()).toThrowError('Photo is required for the Skype Text template');
    });

    it('should generate a valid Skype template object', () => {
      const message = new formatMessage.Photo('base_64_string').get();
      expect(message).toEqual({
        type: 'message/image',
        attachments: [
          {
            contentUrl: 'base_64_string'
          }
        ]
      });
    });
  });
});
