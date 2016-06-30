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
  });
});
