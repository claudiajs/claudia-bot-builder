/*global describe, it, expect, require */
'use strict';

const formatMessage = require('../../lib/telegram/format-message');

describe('Telegram format message', () => {
  it('should export an object', () => {
    expect(typeof formatMessage).toBe('object');
  });

  describe('ReplyKeyboard', () => {
    it('should be a class', () => {
      const message = new formatMessage.ReplyKeyboard();
      expect(typeof formatMessage.ReplyKeyboard).toBe('function');
      expect(message instanceof formatMessage.ReplyKeyboard).toBeTruthy();
    });
  });

  describe('ReplyKeyboardHide', () => {
    it('should be a class', () => {
      const message = new formatMessage.ReplyKeyboardHide();
      expect(typeof formatMessage.ReplyKeyboardHide).toBe('function');
      expect(message instanceof formatMessage.ReplyKeyboardHide).toBeTruthy();
    });
  });

  describe('InlineKeyboard', () => {
    it('should be a class', () => {
      const keyboard = new formatMessage.InlineKeyboard();
      expect(typeof formatMessage.InlineKeyboard).toBe('function');
      expect(keyboard instanceof formatMessage.InlineKeyboard).toBeTruthy();
    });

    it(`should throw an error if at least one button is not added`, () => {
      const keyboard = new formatMessage.InlineKeyboard();
      expect(() => keyboard.get()).toThrowError('At least one button is required for an inline keyboard');
    });

    it(`should throw an error if a button is provided but without the text`, () => {
      const keyboard = new formatMessage.InlineKeyboard();
      expect(() => keyboard.addButton()).toThrowError('Text is required for inline keyboard button');
    });

    it(`should return a keyboard with a button`, () => {
      const keyboard = new formatMessage.InlineKeyboard();
      keyboard.addButton('button');
      expect(keyboard.get()).toEqual({
        method: 'sendMessage',
        body: {
          inline_keyboard: [{
            text: 'button'
          }]
        }
      });
    });

    it(`should throw an error if url for a button is not valid`, () => {
      const keyboard = new formatMessage.InlineKeyboard();
      expect(() => keyboard.addButton('button', 'https://invalid-url')).toThrowError('Inline keyboard button url param, if provided, needs to be a valid URL');
    });

    it(`should return a keyboard with an url button`, () => {
      const keyboard = new formatMessage.InlineKeyboard();
      keyboard.addButton('button', 'https://claudiajs.com');
      expect(keyboard.get()).toEqual({
        method: 'sendMessage',
        body: {
          inline_keyboard: [{
            text: 'button',
            url: 'https://claudiajs.com'
          }]
        }
      });
    });

    it(`should throw an error if callbackData for a button is not string`, () => {
      const keyboard = new formatMessage.InlineKeyboard();
      expect(() => keyboard.addButton('button', false, {})).toThrowError('Inline keyboard button callbackData param, if provided, needs to be string');
    });

    it(`should return a keyboard with a button with callback data`, () => {
      const keyboard = new formatMessage.InlineKeyboard();
      keyboard.addButton('button', 'https://claudiajs.com');
      expect(keyboard.get()).toEqual({
        method: 'sendMessage',
        body: {
          inline_keyboard: [{
            text: 'button',
            url: 'https://claudiajs.com'
          }]
        }
      });
    });
  });

  describe('ForceReply', () => {
    it('should be a class', () => {
      const message = new formatMessage.ForceReply();
      expect(typeof formatMessage.ForceReply).toBe('function');
      expect(message instanceof formatMessage.ForceReply).toBeTruthy();
    });

    it('should return a valid template object', () => {
      const message = new formatMessage.ForceReply();
      expect(message.get()).toEqual({
        method: 'sendMessage',
        body: {
          force_reply: true,
          selective: false
        }
      });
    });
  });
});
