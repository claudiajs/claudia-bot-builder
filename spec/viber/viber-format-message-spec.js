/*global describe, it, expect, require */
'use strict';

const formatMessage = require('../../lib/viber/format-message');

describe('Viber format message', () => {
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
      expect(() => new formatMessage.Text()).toThrowError('Text is required for the Viber Text template');
    });

    it('should generate a valid Viber template object', () => {
      const message = new formatMessage.Text('Some text').get();
      expect(message).toEqual({
        type: 'text',
        text: 'Some text'
      });
    });

    it('should add reply keyboard', () => {
      const message = new formatMessage
        .Text('Some text')
        .addReplyKeyboard(true, '#FAFAFA')
        .get();
      expect(message).toEqual({
        type: 'text',
        text: 'Some text',
        keyboard: {
          Type: 'keyboard',
          DefaultHeight: true,
          BgColor: '#FAFAFA',
          Buttons: []
        }
      });
    });

    it('should add reply keyboard with reply action button', () => {
      const message = new formatMessage.Text('Some text')
        .addReplyKeyboard(true)
          .addKeyboardButton('test', 'test body', 2, 1)
        .get();
      expect(message).toEqual({
        type: 'text',
        text: 'Some text',
        keyboard: {
          Type: 'keyboard',
          DefaultHeight: true,
          BgColor: '#FFFFFF',
          Buttons: [
            {
              Text: 'test',
              ActionType: 'reply',
              ActionBody: 'test body',
              Columns: 2,
              Rows: 1
            }
          ]
        }
      });
    });

    it('should reply text and add reply keyboard with open-url action button', () => {
      const message = new formatMessage.Text('Claudia.js')
        .addReplyKeyboard()
          .addKeyboardButton('Open Claudia.js website', 'https://claudiajs.com', 2, 1)
        .get();
      expect(message).toEqual({
        type: 'text',
        text: 'Claudia.js',
        keyboard: {
          Type: 'keyboard',
          DefaultHeight: true,
          BgColor: '#FFFFFF',
          Buttons: [
            {
              Text: 'Open Claudia.js website',
              ActionType: 'open-url',
              ActionBody: 'https://claudiajs.com',
              Columns: 2,
              Rows: 1
            }
          ]
        }
      });
    });
  });

  it('should reply text and add reply keyboard with open-url action button and button color if custom object is passed', () => {
    const message = new formatMessage.Text('Claudia.js')
      .addReplyKeyboard()
        .addKeyboardButton('Open Claudia.js website', 'https://claudiajs.com', 2, 1, {
          BgColor: '#BADA55'
        })
      .get();
    expect(message).toEqual({
      type: 'text',
      text: 'Claudia.js',
      keyboard: {
        Type: 'keyboard',
        DefaultHeight: true,
        BgColor: '#FFFFFF',
        Buttons: [
          {
            Text: 'Open Claudia.js website',
            ActionType: 'open-url',
            ActionBody: 'https://claudiajs.com',
            Columns: 2,
            Rows: 1,
            BgColor: '#BADA55'
          }
        ]
      }
    });
  });

  describe('Photo', () => {
    it('should be a class', () => {
      const message = new formatMessage.Photo('https://claudiajs.com/assets/claudiajs.svg', 'Claudia.js photo text');
      expect(typeof formatMessage.Photo).toBe('function');
      expect(message instanceof formatMessage.Photo).toBeTruthy();
    });

    it('should throw an error if photo url is not provided', () => {
      expect(() => new formatMessage.Photo()).toThrowError('Photo needs to be an URL for the Viber Photo method');
    });

    it('should throw an error if photo text is provided but not string', () => {
      expect(() => new formatMessage.Photo('https://claudiajs.com/assets/claudiajs.svg', { foo: 'bar' })).toThrowError('Text needs to be a string for Viber Photo method');
    });

    it('should generate a valid Viber template object', () => {
      const message = new formatMessage.Photo('https://claudiajs.com/assets/claudiajs.svg', 'Claudia.js photo text').get();
      expect(message).toEqual({
        type: 'picture',
        media: 'https://claudiajs.com/assets/claudiajs.svg',
        text: 'Claudia.js photo text'
      });
    });

    it('should generate a valid Viber template object with an empty text if it is not provided', () => {
      const message = new formatMessage.Photo('https://claudiajs.com/assets/claudiajs.svg').get();
      expect(message).toEqual({
        type: 'picture',
        media: 'https://claudiajs.com/assets/claudiajs.svg',
        text: ''
      });
    });

    it('should generate a valid Telegram template object with caption', () => {
      const message = new formatMessage.Photo('https://claudiajs.com/assets/claudiajs.svg', 'Claudia.js photo text').get();
      expect(message).toEqual({
        type: 'picture',
        media: 'https://claudiajs.com/assets/claudiajs.svg',
        text: 'Claudia.js photo text'
      });
    });
  });

  describe('Video', () => {
    it('should be a class', () => {
      const message = new formatMessage.Video('https://vimeo.com/170647056', 25600, 156);
      expect(typeof formatMessage.Video).toBe('function');
      expect(message instanceof formatMessage.Video).toBeTruthy();
    });

    it('should throw an error if video url is not available', () => {
      expect(() => new formatMessage.Video()).toThrowError('Media needs to be an URL for Viber Video method');
    });

    it('should throw an error if video size is not available', () => {
      expect(() => new formatMessage.Video('https://vimeo.com/170647056')).toThrowError('Size needs to be a Number representing size in bytes for Viber Video method');
    });

    it('should generate a valid Viber Video template object', () => {
      const message = new formatMessage.Video('https://vimeo.com/170647056', 25600, 156).get();
      expect(message).toEqual({
        type: 'video',
        media: 'https://vimeo.com/170647056',
        size: 25600,
        duration: 156
      });
    });
  });

  describe('File', () => {
    it('should be a class', () => {
      const message = new formatMessage.File('https://some.file.com/address.md', 25600, 'addressing');
      expect(typeof formatMessage.File).toBe('function');
      expect(message instanceof formatMessage.File).toBeTruthy();
    });

    it('should throw an error if file url is not available', () => {
      expect(() => new formatMessage.File()).toThrowError('Media needs to be an URL for the Viber File method');
    });

    it('should throw an error if file size is not available', () => {
      expect(() => new formatMessage.File('https://some.file.com/address.md')).toThrowError('Size needs to be a Number representing size in bytes for the Viber File method');
    });

    it('should throw an error if file_name is not available', () => {
      expect(() => new formatMessage.File('https://some.file.com/address.md', 25600)).toThrowError('File name needs to be a String representing the name of the file for the Viber File method');
    });

    it('should generate a valid Viber File template object', () => {
      const message = new formatMessage.File('https://some.file.com/address.md', 25600, 'addressing').get();
      expect(message).toEqual({
        type: 'file',
        media: 'https://some.file.com/address.md',
        size: 25600,
        file_name: 'addressing'
      });
    });
  });

  describe('Contact', () => {
    it('should be a class', () => {
      const message = new formatMessage.Contact('claudia', '+333333333');
      expect(typeof formatMessage.Contact).toBe('function');
      expect(message instanceof formatMessage.Contact).toBeTruthy();
    });

    it('should throw an error if contact name and contact phone number are not valid', () => {
      expect(() => new formatMessage.Contact()).toThrowError('Contact name and phone number are required for the Viber Contact template');
    });

    it('should generate a valid Viber Contact template object', () => {
      const message = new formatMessage.Contact('claudia', '+333333333').get();
      expect(message).toEqual({
        type: 'contact',
        contact: {
          name: 'claudia',
          phone_number: '+333333333'
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
      expect(() => new formatMessage.Location()).toThrowError('Latitude and longitude are required for the Viber Location template');
    });

    it('should generate a valid Viber Location template object', () => {
      const message = new formatMessage.Location(20, 44).get();
      expect(message).toEqual({
        type: 'location',
        location: {
          lat: 20,
          lon: 44
        }
      });
    });
  });

  describe('Url', () => {
    it('should be a class', () => {
      const message = new formatMessage.Url('https://claudiajs.com');
      expect(typeof formatMessage.Url).toBe('function');
      expect(message instanceof formatMessage.Url).toBeTruthy();
    });

    it('should throw an error if media url is not valid', () => {
      expect(() => new formatMessage.Url()).toThrowError('Media needs to be an URL for the Viber URL method');
    });

    it('should generate a valid Viber Url template object', () => {
      const message = new formatMessage.Url('https://claudiajs.com').get();
      expect(message).toEqual({
        type: 'url',
        media: 'https://claudiajs.com'
      });
    });
  });

});
