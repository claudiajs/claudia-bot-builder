/*global describe, xdescribe, it, expect, beforeEach, require */
'use strict';

const formatFbMessage = require('../../lib/facebook/format-message');

describe('Facebook format message', () => {
  it('should export an object', () => {
    expect(typeof formatFbMessage).toBe('object');
  });

  describe('Generic template', () => {
    let generic;

    beforeEach(() => {
      generic = new formatFbMessage.generic();
    });

    it('should be a class', () => {
      expect(typeof formatFbMessage.generic).toBe('function');
      expect(generic instanceof formatFbMessage.generic).toBeTruthy();
    });

    it('should throw an error if at least one bubble/element is not added', () => {
      expect(() => generic.get()).toThrowError('Add at least one bubble first!');
    });

    it('should throw an error if bubble title does not exist', () => {
      expect(() => generic.addBubble()).toThrowError('Bubble title cannot be empty');
    });

    it('should throw an error if bubble title is too long', () => {
      expect(() => generic.addBubble('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua')).toThrowError('Bubble title cannot be longer than 80 characters');
    });

    it('should throw an error if bubble subtitle is too long', () => {
      expect(() => generic.addBubble('Test', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua')).toThrowError('Bubble subtitle cannot be longer than 80 characters');
    });

    it('should throw an error if there\'s more than 10 bubbles', () => {
      expect(() =>
        generic
          .addBubble('1', 'hello')
          .addBubble('2', 'hello')
          .addBubble('3', 'hello')
          .addBubble('4', 'hello')
          .addBubble('5', 'hello')
          .addBubble('6', 'hello')
          .addBubble('7', 'hello')
          .addBubble('8', 'hello')
          .addBubble('9', 'hello')
          .addBubble('10', 'hello')
          .addBubble('11', 'hello')
      )
      .toThrowError('10 bubbles are maximum for Generic template');
    });
  });

  xdescribe('Button template', () => {

  });

  xdescribe('Receipt template', () => {

  });

  xdescribe('Image attachment', () => {

  });
});
