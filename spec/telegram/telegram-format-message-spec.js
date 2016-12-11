/*global describe, it, expect, require */
'use strict';

const formatMessage = require('../../lib/telegram/format-message');

describe('Telegram format message', () => {
  it('should export an object', () => {
    expect(typeof formatMessage).toBe('object');
  });

  describe('Text', () => {
    it('should be a class', () => {
      const message = new formatMessage.Text('text');
      expect(typeof formatMessage.Text).toBe('function');
      expect(message instanceof formatMessage.Text).toBeTruthy();
    });

    it('should throw an error if text is not provided', () => {
      expect(() => new formatMessage.Text()).toThrowError('Text is required for Telegram Text template');
    });

    it('should generate a valid Telegram template object with markdown enabled by default', () => {
      const message = new formatMessage.Text('Some text').get();
      expect(message).toEqual({
        text: 'Some text',
        parse_mode: 'Markdown'
      });
    });

    it('should disable markdown', () => {
      const message = new formatMessage.Text('Some text').disableMarkdown().get();
      expect(message).toEqual({
        text: 'Some text'
      });
    });

    it('should add reply keyboard markup', () => {
      const message = new formatMessage
        .Text('Some text')
        .addReplyKeyboard([
          [1], [2], [3]
        ])
        .get();
      expect(message).toEqual({
        text: 'Some text',
        parse_mode: 'Markdown',
        reply_markup: '{"keyboard":[[1],[2],[3]]}'
      });
    });

    it('should add inline keyboard markup', () => {
      const message = new formatMessage
        .Text('Some text')
        .addInlineKeyboard([
          [1], [2], [3]
        ])
        .get();
      expect(message).toEqual({
        text: 'Some text',
        parse_mode: 'Markdown',
        reply_markup: '{"inline_keyboard":[[1],[2],[3]]}'
      });
    });

    it('should overwrite keyboard markup if there is more than 1', () => {
      const message = new formatMessage
        .Text('Some text')
        .addInlineKeyboard([
          [1], [2], [3]
        ])
        .addReplyKeyboard([
          [1], [2], [3]
        ])
        .get();
      expect(message).toEqual({
        text: 'Some text',
        parse_mode: 'Markdown',
        reply_markup: '{"keyboard":[[1],[2],[3]]}'
      });
    });
  });

  describe('Photo', () => {
    it('should be a class', () => {
      const message = new formatMessage.Photo('foo');
      expect(typeof formatMessage.Photo).toBe('function');
      expect(message instanceof formatMessage.Photo).toBeTruthy();
    });

    it('should throw an error if photo url or id is not provided', () => {
      expect(() => new formatMessage.Photo()).toThrowError('Photo needs to be an ID or URL for Telegram Photo method');
    });

    it('should generate a valid Telegram template object', () => {
      const message = new formatMessage.Photo('http://some.random/photo/url').get();
      expect(message).toEqual({
        method: 'sendPhoto',
        body: {
          photo: 'http://some.random/photo/url'
        }
      });
    });

    it('should generate a valid Telegram template object with caption', () => {
      const message = new formatMessage.Photo('http://some.random/photo/url', 'Some caption').get();
      expect(message).toEqual({
        method: 'sendPhoto',
        body: {
          photo: 'http://some.random/photo/url',
          caption: 'Some caption'
        }
      });
    });

    it('should ignore caption if it is not a string', () => {
      const message = new formatMessage.Photo('http://some.random/photo/url', {}).get();
      expect(message).toEqual({
        method: 'sendPhoto',
        body: {
          photo: 'http://some.random/photo/url'
        }
      });
    });
  });

  describe('Audio', () => {
    it('should be a class', () => {
      const message = new formatMessage.Audio('foo');
      expect(typeof formatMessage.Audio).toBe('function');
      expect(message instanceof formatMessage.Audio).toBeTruthy();
    });

    it('should throw an error if audio url or id is not provided', () => {
      expect(() => new formatMessage.Audio()).toThrowError('Audio needs to be an ID or URL for Telegram Audio method');
    });

    it('should generate a valid Telegram template object', () => {
      const message = new formatMessage.Audio('http://some.random/audio/url').get();
      expect(message).toEqual({
        method: 'sendAudio',
        body: {
          audio: 'http://some.random/audio/url'
        }
      });
    });

    it('should add a caption and duration if they exists', () => {
      const message = new formatMessage.Audio('http://some.random/audio/url', 'Some caption', 1000).get();
      expect(message).toEqual({
        method: 'sendAudio',
        body: {
          audio: 'http://some.random/audio/url',
          caption: 'Some caption',
          duration: 1000
        }
      });
    });

    it('should ignore caption if it is not a string', () => {
      const message = new formatMessage.Audio('http://some.random/audio/url', {}, 1000).get();
      expect(message).toEqual({
        method: 'sendAudio',
        body: {
          audio: 'http://some.random/audio/url',
          duration: 1000
        }
      });
    });

    it('should ignore duration if it is not a number', () => {
      const message = new formatMessage.Audio('http://some.random/audio/url', 'Hey', {}).get();
      expect(message).toEqual({
        method: 'sendAudio',
        body: {
          audio: 'http://some.random/audio/url',
          caption: 'Hey'
        }
      });
    });

    it('should throw an error if addTitle method is invoked without a valid title', () => {
      expect(() => new formatMessage.Audio('http://some.random/audio/url').addTitle()).toThrowError('Title is required for Telegram addTitle method');
    });

    it('should throw an error if addPerformer method is invoked without a valid performer', () => {
      expect(() => new formatMessage.Audio('http://some.random/audio/url').addPerformer()).toThrowError('Performer is required for Telegram addPerformer method');
    });

    it('should add title and performer', () => {
      const message = new formatMessage
        .Audio('http://some.random/audio/url')
        .addTitle('Some title')
        .addPerformer('Some performer')
        .get();

      expect(message).toEqual({
        method: 'sendAudio',
        body: {
          audio: 'http://some.random/audio/url',
          title: 'Some title',
          performer: 'Some performer'
        }
      });
    });
  });

  describe('Location', () => {
    it('should be a class', () => {
      const message = new formatMessage.Location(20, 44);
      expect(typeof formatMessage.Location).toBe('function');
      expect(message instanceof formatMessage.Location).toBeTruthy();
    });

    it('should throw an error if latitude and longitude are not valid', () => {
      expect(() => new formatMessage.Location()).toThrowError('Latitude and longitude are required for Telegram Location template');
    });

    it('should generate a valid Telegram template object', () => {
      const message = new formatMessage.Location(20, 44).get();
      expect(message).toEqual({
        method: 'sendLocation',
        body: {
          latitude: 20,
          longitude: 44
        }
      });
    });
  });

  describe('Venue', () => {
    it('should be a class', () => {
      const message = new formatMessage.Venue(20, 44, 'Belgrade', 'Belgrade, Serbia');
      expect(typeof formatMessage.Venue).toBe('function');
      expect(message instanceof formatMessage.Venue).toBeTruthy();
    });

    it('should throw an error if latitude and longitude are not valid', () => {
      expect(() => new formatMessage.Venue()).toThrowError('Latitude and longitude are required for Telegram Venue template');
    });

    it('should throw an error if title is not valid', () => {
      expect(() => new formatMessage.Venue(20, 44)).toThrowError('Title is required for Telegram Venue template');
    });

    it('should throw an error if address is not valid', () => {
      expect(() => new formatMessage.Venue(20, 44, 'Title')).toThrowError('Address is required for Telegram Venue template');
    });

    it('should generate a valid Telegram template object', () => {
      const message = new formatMessage.Venue(20, 44, 'Some title', 'Some address').get();
      expect(message).toEqual({
        method: 'sendVenue',
        body: {
          latitude: 20,
          longitude: 44,
          title: 'Some title',
          address: 'Some address'
        }
      });
    });

    it('should throw an error if foursquareId is not valid for addFoursqare method', () => {
      expect(() => new formatMessage.Venue(20, 44, 'Title', 'Address').addFoursqare()).toThrowError('Foursquare ID is required for Telegram Venue template addFoursqare method');
    });

    it('should add foursquare ID', () => {
      const message = new formatMessage
        .Venue(20, 44, 'Some title', 'Some address')
        .addFoursqare(123)
        .get();
      expect(message).toEqual({
        method: 'sendVenue',
        body: {
          latitude: 20,
          longitude: 44,
          title: 'Some title',
          address: 'Some address',
          foursquare_id: 123
        }
      });
    });
  });

  describe('ChatAction', () => {
    it('should be a class', () => {
      const message = new formatMessage.ChatAction('typing');
      expect(typeof formatMessage.ChatAction).toBe('function');
      expect(message instanceof formatMessage.ChatAction).toBeTruthy();
    });

    it('should throw an error if chat action is not valid', () => {
      expect(() => new formatMessage.ChatAction()).toThrowError('Valid action is required for Telegram ChatAction template. Check https://core.telegram.org/bots/api#sendchataction for all available actions.');
    });

    it('should generate a valid Telegram template object', () => {
      const message = new formatMessage.ChatAction('typing').get();
      expect(message).toEqual({
        method: 'sendChatAction',
        body: {
          action: 'typing'
        }
      });
    });
  });

  describe('Pause', () => {
    it('should be a class', () => {
      const message = new formatMessage.Pause(200);
      expect(typeof formatMessage.Pause).toBe('function');
      expect(message instanceof formatMessage.Pause).toBeTruthy();
    });

    it('should generate an object with a defined value', () => {
      const message = new formatMessage.Pause(1000).get();
      expect(message).toEqual({
        claudiaPause: 1000
      });
    });

    it('should generate an object with a default value', () => {
      const message = new formatMessage.Pause().get();
      expect(message).toEqual({
        claudiaPause: 500
      });
    });
  });

  describe('File', () => {
    it('should be a class', () => {
      const message = new formatMessage.File('https://some.file.com/address.md');
      expect(typeof formatMessage.File).toBe('function');
      expect(message instanceof formatMessage.File).toBeTruthy();
    });

    it('should throw an error if file url is not available', () => {
      expect(() => new formatMessage.File()).toThrowError('Document needs to be an URL for the Telegram File method');
    });

    it('should generate a valid Telegram File template object if caption is not sent', () => {
      const message = new formatMessage.File('https://some.file.com/address.md').get();
      expect(message).toEqual({
        method: 'sendDocument',
        body: {
          document: 'https://some.file.com/address.md'
        }
      });
    });

    it('should generate a valid Telegram File template object if caption is sent', () => {
      const message = new formatMessage.File('https://some.file.com/address.md', 'addressing').get();
      expect(message).toEqual({
        method: 'sendDocument',
        body: {
          document: 'https://some.file.com/address.md',
          caption: 'addressing'
        }
      });
    });
  });

  describe('Sticker', () => {
    it('should be a class', () => {
      const message = new formatMessage.Sticker('https://some.file.com/address.md');
      expect(typeof formatMessage.Sticker).toBe('function');
      expect(message instanceof formatMessage.Sticker).toBeTruthy();
    });

    it('should throw an error if sticker URL or ID is not available', () => {
      expect(() => new formatMessage.Sticker()).toThrowError('Sticker needs to be an URL or sticker ID for the Telegram Sticker method');
    });

    it('should generate a valid Telegram Sticker template object', () => {
      const message = new formatMessage.Sticker('stickerID').get();
      expect(message).toEqual({
        method: 'sendSticker',
        body: {
          sticker: 'stickerID'
        }
      });
    });
  });

  describe('Contact', () => {
    it('should be a class', () => {
      const message = new formatMessage.Contact('123456789', 'John');
      expect(typeof formatMessage.Contact).toBe('function');
      expect(message instanceof formatMessage.Contact).toBeTruthy();
    });

    it('should throw an error if phone number is not available', () => {
      expect(() => new formatMessage.Contact()).toThrowError('Phone number needs to be a string for Telegram Contact method');
    });

    it('should throw an error if first name is not available', () => {
      expect(() => new formatMessage.Contact('123456789')).toThrowError('First name needs to be a string for Telegram Contact method');
    });

    it('should generate a valid Telegram Contact template object', () => {
      const message = new formatMessage.Contact('123456789', 'John', 'Doe').get();
      expect(message).toEqual({
        method: 'sendContact',
        body: {
          phone_number: '123456789',
          first_name: 'John',
          last_name: 'Doe'
        }
      });
    });

    it('should generate a valid Telegram Contact template object without last name', () => {
      const message = new formatMessage.Contact('123456789', 'John').get();
      expect(message).toEqual({
        method: 'sendContact',
        body: {
          phone_number: '123456789',
          first_name: 'John'
        }
      });
    });
  });
});
