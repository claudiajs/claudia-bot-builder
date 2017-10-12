/*global describe, it, expect, require */
'use strict';

const formatMessage = require('../../lib/skype/format-message');

describe('Skype format message', () => {
  it('should export an object', () => {
    expect(typeof formatMessage).toBe('object');
  });

  describe('Text', () => {
    it('should be a class', () => {
      const message = new formatMessage.Text('foo');
      expect(typeof formatMessage.Text).toBe('function');
      expect(message instanceof formatMessage.Text).toBeTruthy();
    });

    it('should throw an error if text is not provided', () => {
      expect(() => new formatMessage.Text()).toThrowError('Text is required for Skype Text template');
      expect(() => new formatMessage.Text({foo: 'bar'})).toThrowError('Text is required for Skype Text template');
    });

    it('should generate a valid Skype template object with plain text default', () => {
      const message = new formatMessage.Text('foo').get();
      expect(message).toEqual({
        type: 'message',
        text: 'foo',
        textFormat: 'plain'
      });
    });

    it('should generate a valid Skype template object with explicit format set', () => {
      const message = new formatMessage.Text('foo', 'markdown').get();
      expect(message).toEqual({
        type: 'message',
        text: 'foo',
        textFormat: 'markdown'
      });
    });
  });

  describe('Photo', () => {
    it('should be a class', () => {
      const message = new formatMessage.Photo('foo');
      expect(typeof formatMessage.Photo).toBe('function');
      expect(message instanceof formatMessage.Photo).toBeTruthy();
    });

    it('should throw an error if photo url is not provided', () => {
      expect(() => new formatMessage.Photo()).toThrowError('Photo is required for the Skype Photo template');
    });

    it('should generate a valid Skype template object', () => {
      const message = new formatMessage.Photo('base_64_string').get();
      expect(message).toEqual({
        type: 'message',
        attachments: [
          {
            contentType: 'image/png',
            contentUrl: 'base_64_string'
          }
        ]
      });
    });
  });

  describe('Carousel', () => {
    it('should be a class', () => {
      const message = new formatMessage.Photo('foo');
      expect(typeof formatMessage.Photo).toBe('function');
      expect(message instanceof formatMessage.Photo).toBeTruthy();
    });

    it('should generate a valid Carousel template object', () => {
      const message = new formatMessage.Carousel('summary', 'text').get();
      expect(message).toEqual({
        type: 'message',
        attachmentLayout: 'carousel',
        summary: 'summary',
        text: 'text',
        attachments: []
      });
    });

    it('should throw error if addHero is called without images array', () => {
      expect(() => new formatMessage.Carousel('summary', 'text')
        .addHero('image')
        .get()).toThrowError('Images should be sent as array for the Skype Hero template');
    });

    it('should generate a valid Carousel template object with Hero', () => {
      const message = new formatMessage.Carousel('summary', 'text')
        .addHero(['image'])
          .addTitle('title')
          .addSubtitle('subtitle')
          .addText('text')
        .get();
      expect(message).toEqual({
        type: 'message',
        attachmentLayout: 'carousel',
        summary: 'summary',
        text: 'text',
        attachments: [{
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: 'title',
            subtitle: 'subtitle',
            text: 'text',
            images: [{url: 'image', alt: ''}],
            buttons: []
          }
        }]
      });
    });

    it('should throw error if addButton is called without attachment', () => {
      expect(() => new formatMessage.Carousel('summary', 'text')
        .addButton('title', 'test', 'imBack')
        .get()).toThrowError('You need to add attachment to Carousel');
    });

    it('should throw error if addButton is called without title', () => {
      expect(() => new formatMessage.Carousel('summary', 'text')
        .addHero()
        .addButton()
        .get()).toThrowError('Title needs to be a string for Skype addButton method');
    });

    it('should throw error if addButton is called without value', () => {
      expect(() => new formatMessage.Carousel('summary', 'text')
        .addHero()
        .addButton('title', '', 'imBack')
        .get()).toThrowError('Value needs to be a string for Skype addButton method');
    });

    it('should throw error if addButton is called without type', () => {
      expect(() => new formatMessage.Carousel('summary', 'text')
        .addHero()
        .addButton('title', 'value')
        .get()).toThrowError('Type needs to be a string for Skype addButton method');
    });

    it('should throw error if addButton is called with strange type', () => {
      expect(() => new formatMessage.Carousel('summary', 'text')
        .addHero()
        .addButton('title', 'value', 'someType')
        .get()).toThrowError('Type needs to be a valid type string for Skype addButton method');
    });

    it('should generate a valid Carousel template object with Hero with Button', () => {
      const message = new formatMessage.Carousel('summary', 'text')
        .addHero()
          .addButton('title', 'value', 'imBack')
        .get();
      expect(message).toEqual({
        type: 'message',
        attachmentLayout: 'carousel',
        summary: 'summary',
        text: 'text',
        attachments: [{
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: '',
            subtitle: '',
            text: '',
            images: [],
            buttons: [{
              type: 'imBack',
              title: 'title',
              value: 'value'
            }]
          }
        }]
      });
    });

    it('should throw error if addThumbnail is called without images array', () => {
      expect(() => new formatMessage.Carousel('summary', 'text')
        .addThumbnail('title', 'subtitle', 'text', 'image')
        .get()).toThrowError('Images should be sent as array for the Skype Thumbnail template');
    });

    it('should generate a valid Carousel template object with Thumbnail', () => {
      const message = new formatMessage.Carousel('summary', 'text')
        .addThumbnail(['image'])
          .addTitle('title')
          .addSubtitle('subtitle')
          .addText('text')
        .get();
      expect(message).toEqual({
        type: 'message',
        attachmentLayout: 'carousel',
        summary: 'summary',
        text: 'text',
        attachments: [{
          contentType: 'application/vnd.microsoft.card.thumbnail',
          content: {
            title: 'title',
            subtitle: 'subtitle',
            text: 'text',
            images: [{url: 'image', alt: ''}],
            buttons: []
          }
        }]
      });
    });

    it('should generate a valid Carousel template object with Receipt', () => {
      const message = new formatMessage.Carousel('summary', 'text')
        .addReceipt('total', 'tax', 'vat')
          .addTitle('title')
          .addSubtitle('subtitle')
          .addText('text')
        .get();
      expect(message).toEqual({
        type: 'message',
        attachmentLayout: 'carousel',
        summary: 'summary',
        text: 'text',
        attachments: [{
          contentType: 'application/vnd.microsoft.card.receipt',
          content: {
            title: 'title',
            subtitle: 'subtitle',
            text: 'text',
            total: 'total',
            tax: 'tax',
            vat: 'vat',
            items: [],
            facts: [],
            buttons: []
          }
        }]
      });
    });

    it('should generate a valid Carousel template object with Receipt with Item', () => {
      const message = new formatMessage.Carousel('summary', 'text')
        .addReceipt('total', 'tax', 'vat')
          .addTitle('title')
          .addSubtitle('subtitle')
          .addText('text')
            .addItem('title', 'subtitle', 'text', 'price', 'quantity', 'image')
        .get();
      expect(message).toEqual({
        type: 'message',
        attachmentLayout: 'carousel',
        summary: 'summary',
        text: 'text',
        attachments: [{
          contentType: 'application/vnd.microsoft.card.receipt',
          content: {
            title: 'title',
            subtitle: 'subtitle',
            text: 'text',
            total: 'total',
            tax: 'tax',
            vat: 'vat',
            items: [{
              title: 'title',
              subtitle: 'subtitle',
              text: 'text',
              price: 'price',
              quantity: 'quantity',
              image: {
                url: 'image'
              }
            }],
            facts: [],
            buttons: []
          }
        }]
      });
    });

    it('should generate a valid Carousel template object with Receipt with Fact', () => {
      const message = new formatMessage.Carousel('summary', 'text')
        .addReceipt('total', 'tax', 'vat')
          .addTitle('title')
          .addSubtitle('subtitle')
          .addText('text')
            .addFact('key', 'value')
        .get();
      expect(message).toEqual({
        type: 'message',
        attachmentLayout: 'carousel',
        summary: 'summary',
        text: 'text',
        attachments: [{
          contentType: 'application/vnd.microsoft.card.receipt',
          content: {
            title: 'title',
            subtitle: 'subtitle',
            text: 'text',
            total: 'total',
            tax: 'tax',
            vat: 'vat',
            items: [],
            facts: [{
              key: 'key',
              value: 'value'
            }],
            buttons: []
          }
        }]
      });
    });

    it('should throw error if addTitle is called without title', () => {
      expect(() => new formatMessage.Carousel('summary', 'text')
        .addHero()
          .addTitle()
        .get()).toThrowError('Title needs to be a string for Skype addTitle method');
    });

    it('should throw error if addSubtitle is called without subtitle', () => {
      expect(() => new formatMessage.Carousel('summary', 'text')
        .addHero()
        .addSubtitle()
        .get()).toThrowError('Subtitle needs to be a string for Skype addSubtitle method');
    });

    it('should throw error if addText is called without text', () => {
      expect(() => new formatMessage.Carousel('summary', 'text')
        .addHero()
        .addText()
        .get()).toThrowError('Text needs to be a string for Skype addText method');
    });

    it('should generate a valid Typing template object', () => {
      const message = new formatMessage.Typing();
      expect(message).toEqual({
        type: 'typing'
      });
    });
  });
});
