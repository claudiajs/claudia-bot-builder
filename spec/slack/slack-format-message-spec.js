/*global describe, it, expect */
'use strict';

const formatSlackMessage = require('../../lib/slack/format-message');

describe('Slack format message', () => {
  it('should export a function', () => {
    expect(typeof formatSlackMessage).toBe('function');
  });

  describe('Template builder', () => {
    it('should be a class', () => {
      let template = new formatSlackMessage('test');
      expect(typeof formatSlackMessage).toBe('function');
      expect(template instanceof formatSlackMessage).toBeTruthy();
    });

    it('should not add text if you don\'t provide it in the constructor', () => {
      let message = new formatSlackMessage();
      expect(message.template.text).toBeFalsy();
    });

    it('should add text if you provide it in the constructor', () => {
      let message = new formatSlackMessage('Message text');
      expect(message.template.text).toBe('Message text');
    });

    it('should add replace_original to the template if you use replaceOriginal method', () => {
      let message = new formatSlackMessage().replaceOriginal(true);
      expect(message.template.replace_original).toBeTruthy();
    });

    it('should enable markdown by default', () => {
      let message = new formatSlackMessage();
      expect(message.template.mrkdwn).toBeTruthy();
    });

    it('should disable markdown if you use disableMarkdown method', () => {
      let message = new formatSlackMessage().disableMarkdown(true);
      expect(message.template.mrkdwn).toBeFalsy();
    });

    it('should set message type to `in_channel` if you use channelMessage method', () => {
      let message = new formatSlackMessage().channelMessage(true);
      expect(message.template.response_type).toBe('in_channel');
    });

    it('should throw an error if you use getLatestAttachment without adding an attachment', () => {
      let message = new formatSlackMessage();
      expect(() => message.getLatestAttachment()).toThrowError('Add at least one attachment first');
    });

    it('should add an attachment with default fallback when you use addAttachment method', () => {
      let message = new formatSlackMessage().addAttachment();
      expect(message.template.attachments.length).toBe(1);
      expect(message.template.attachments[0].fallback).toBe('Slack told us that you are not able to see this attachment 😢');
    });

    it('should add an attachment with custom fallback and callback id if they are provided', () => {
      let message = new formatSlackMessage().addAttachment('CB', 'Fallback');
      expect(message.template.attachments.length).toBe(1);
      expect(message.template.attachments[0].callback_id).toBe('CB');
      expect(message.template.attachments[0].fallback).toBe('Fallback');
    });

    it('should throw an error if you use addTitle without adding a title', () => {
      let message = new formatSlackMessage().addAttachment();
      expect(() => message.addTitle()).toThrowError('Title text is required for addTitle method');
    });

    it('should add a title for the attachment if you use addTitle method', () => {
      let message = new formatSlackMessage().addAttachment().addTitle('This is a title');
      expect(message.template.attachments[0].title).toBe('This is a title');
    });

    it('should throw an error if you use addText without adding a text', () => {
      let message = new formatSlackMessage().addAttachment();
      expect(() => message.addText()).toThrowError('Text is required for addText method');
    });

    it('should add a text for the attachment if you use addText method', () => {
      let message = new formatSlackMessage().addAttachment().addText('text');
      expect(message.template.attachments[0].text).toBe('text');
    });

    it('should throw an error if you use addPretext without adding a text', () => {
      let message = new formatSlackMessage().addAttachment();
      expect(() => message.addPretext()).toThrowError('Text is required for addPretext method');
    });

    it('should add a pretext for the attachment if you use addText method', () => {
      let message = new formatSlackMessage().addAttachment().addPretext('pretext');
      expect(message.template.attachments[0].pretext).toBe('pretext');
    });
  });
});
