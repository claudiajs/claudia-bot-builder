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
      const message = new formatSlackMessage();
      expect(message.template.text).toBeFalsy();
    });

    it('should add text if you provide it in the constructor', () => {
      const message = new formatSlackMessage('Message text');
      expect(message.template.text).toBe('Message text');
    });

    it('should add replace_original to the template if you use replaceOriginal method', () => {
      const message = new formatSlackMessage().replaceOriginal(true);
      expect(message.template.replace_original).toBeTruthy();
    });

    it('should enable markdown by default', () => {
      const message = new formatSlackMessage();
      expect(message.template.mrkdwn).toBeTruthy();
    });

    it('should disable markdown if you use disableMarkdown method', () => {
      const message = new formatSlackMessage().disableMarkdown(true);
      expect(message.template.mrkdwn).toBeFalsy();
    });

    it('should set message type to `in_channel` if you use channelMessage method', () => {
      const message = new formatSlackMessage().channelMessage(true);
      expect(message.template.response_type).toBe('in_channel');
    });

    it('should throw an error if you use getLatestAttachment without adding an attachment', () => {
      const message = new formatSlackMessage();
      expect(() => message.getLatestAttachment()).toThrowError('Add at least one attachment first');
    });

    it('should add an attachment with default fallback when you use addAttachment method', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(message.template.attachments.length).toBe(1);
      expect(message.template.attachments[0].fallback).toBe('Slack told us that you are not able to see this attachment 😢');
    });

    it('should add an attachment with custom fallback and callback id if they are provided', () => {
      const message = new formatSlackMessage().addAttachment('CB', 'Fallback');
      expect(message.template.attachments.length).toBe(1);
      expect(message.template.attachments[0].callback_id).toBe('CB');
      expect(message.template.attachments[0].fallback).toBe('Fallback');
    });

    it('should add 20 attachments', () => {
      const message = new formatSlackMessage()
        .addAttachment().addAttachment().addAttachment().addAttachment().addAttachment()
        .addAttachment().addAttachment().addAttachment().addAttachment().addAttachment()
        .addAttachment().addAttachment().addAttachment().addAttachment().addAttachment()
        .addAttachment().addAttachment().addAttachment().addAttachment().addAttachment();

      expect(message.template.attachments.length).toBe(20);
    });

    it('should throw an error if you add more than 20 attachments', () => {
      const message = new formatSlackMessage()
        .addAttachment().addAttachment().addAttachment().addAttachment().addAttachment()
        .addAttachment().addAttachment().addAttachment().addAttachment().addAttachment()
        .addAttachment().addAttachment().addAttachment().addAttachment().addAttachment()
        .addAttachment().addAttachment().addAttachment().addAttachment().addAttachment();

      expect(() => message.addAttachment()).toThrowError('You can not add more than 20 attachments');
    });

    it('should throw an error if you use addTitle without adding a title', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(() => message.addTitle()).toThrowError('Title text is required for addTitle method');
    });

    it('should add a title for the attachment if you use addTitle method', () => {
      const message = new formatSlackMessage().addAttachment().addTitle('This is a title');
      expect(message.template.attachments[0].title).toBe('This is a title');
    });

    it('should throw an error if you use addText without adding a text', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(() => message.addText()).toThrowError('Text is required for addText method');
    });

    it('should add a text for the attachment if you use addText method', () => {
      const message = new formatSlackMessage().addAttachment().addText('text');
      expect(message.template.attachments[0].text).toBe('text');
    });

    it('should throw an error if you use addPretext without adding a text', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(() => message.addPretext()).toThrowError('Text is required for addPretext method');
    });

    it('should add a pretext for the attachment if you use addText method', () => {
      const message = new formatSlackMessage().addAttachment().addPretext('pretext');
      expect(message.template.attachments[0].pretext).toBe('pretext');
    });

    it('should throw an error if you try to addUrl without providing it', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(() => message.addImage()).toThrowError('addImage method requires a valid URL');
    });

    it('should throw an error if you try to addUrl with invalid url', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(() => message.addImage('http:invalid-url')).toThrowError('addImage method requires a valid URL');
    });

    it('should add an image if you call addUrl with valid URL', () => {
      const message = new formatSlackMessage().addAttachment().addImage('http://claudiajs.org/path/to/image.png');
      expect(message.template.attachments[0].image_url).toBe('http://claudiajs.org/path/to/image.png');
    });

    it('should throw an error if you try to addThumbnail without providing it', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(() => message.addThumbnail()).toThrowError('addThumbnail method requires a valid URL');
    });

    it('should throw an error if you try to addThumbnail with invalid url', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(() => message.addThumbnail('http:invalid-url')).toThrowError('addThumbnail method requires a valid URL');
    });

    it('should add an image if you call addThumbnail with valid URL', () => {
      const message = new formatSlackMessage().addAttachment().addThumbnail('http://claudiajs.org/path/to/image.png');
      expect(message.template.attachments[0].thumb_url).toBe('http://claudiajs.org/path/to/image.png');
    });

    it('should throw an error if you try to addAuthor without providing author name', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(() => message.addAuthor()).toThrowError('Name is required for addAuthor method');
    });

    it('should add an author if you provide valid data', () => {
      const message = new formatSlackMessage().addAttachment().addAuthor('Jorge Luis Borges', 'http://claudiajs.org/path/to/icon.png', 'http://claudiajs.org/');
      expect(message.template.attachments[0].author_name).toBe('Jorge Luis Borges');
      expect(message.template.attachments[0].author_icon).toBe('http://claudiajs.org/path/to/icon.png');
      expect(message.template.attachments[0].author_link).toBe('http://claudiajs.org/');
    });

    it('should ignore author link if format is not valid', () => {
      const message = new formatSlackMessage().addAttachment().addAuthor('Jorge Luis Borges', 'http://claudiajs.org/path/to/icon.png', 'http:invalid-url');
      expect(message.template.attachments[0].author_name).toBe('Jorge Luis Borges');
      expect(message.template.attachments[0].author_icon).toBe('http://claudiajs.org/path/to/icon.png');
      expect(message.template.attachments[0].author_link).toBeFalsy();
    });

    it('should throw an error if you try to addFooter without providing a text', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(() => message.addFooter()).toThrowError('Text is required for addFooter method');
    });

    it('should add a footer if data is valid', () => {
      const message = new formatSlackMessage().addAttachment().addFooter('test', 'http://claudiajs.org/path/to/icon.png');
      expect(message.template.attachments[0].footer).toBe('test');
      expect(message.template.attachments[0].footer_icon).toBe('http://claudiajs.org/path/to/icon.png');
    });

    it('should throw an error if you try to addColor without providing it', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(() => message.addColor()).toThrowError('Color is required for addColor method');
    });

    it('should add a color if data is valid', () => {
      const message = new formatSlackMessage().addAttachment().addColor('#B4D455');
      expect(message.template.attachments[0].color).toBe('#B4D455');
    });

    it('should throw an error if you call addTimestamp with anything but Date object', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(() => message.addTimestamp('Something')).toThrowError('Timestamp needs to be a valid Date object');
    });

    it('should add a timestamp if you call addTimestamp method', () => {
      const message = new formatSlackMessage().addAttachment().addTimestamp(new Date('2016-06-14T20:55:31.438Z'));
      expect(message.template.attachments[0].ts).toBe(new Date('2016-06-14T20:55:31.438Z').getTime());
    });

    it('should throw an error if you call addField without providing an info', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(() => message.addField()).toThrowError('Title and value are required for addField method');
    });

    it('should add a field with provided values', () => {
      const message = new formatSlackMessage().addAttachment().addField('title', 'value');
      expect(message.template.attachments[0].fields.length).toBe(1);
      expect(message.template.attachments[0].fields[0].title).toBe('title');
      expect(message.template.attachments[0].fields[0].value).toBe('value');
      expect(message.template.attachments[0].fields[0].short).toBe(false);
    });

    it('should throw an error if you addAction without valid data', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(() => message.addAction()).toThrowError('Text, name and value are requeired for addAction method');
    });

    it('should add an action', () => {
      const message = new formatSlackMessage().addAttachment().addAction('FooBar', 'foo', 'bar');
      expect(message.template.attachments[0].actions.length).toBe(1);
      expect(message.template.attachments[0].actions[0].text).toBe('FooBar');
      expect(message.template.attachments[0].actions[0].name).toBe('foo');
      expect(message.template.attachments[0].actions[0].value).toBe('bar');
      expect(message.template.attachments[0].actions[0].type).toBe('button');
    });

    it('should add an action with style', () => {
      const message = new formatSlackMessage().addAttachment().addAction('FooBar', 'foo', 'bar', 'primary');
      expect(message.template.attachments[0].actions.length).toBe(1);
      expect(message.template.attachments[0].actions[0].text).toBe('FooBar');
      expect(message.template.attachments[0].actions[0].name).toBe('foo');
      expect(message.template.attachments[0].actions[0].value).toBe('bar');
      expect(message.template.attachments[0].actions[0].style).toBe('primary');
    });

    it('should add multiple actions', () => {
      const message = new formatSlackMessage().addAttachment()
        .addAction('A1', 'foo', 'bar')
        .addAction('A2', 'foo', 'bar')
        .addAction('A3', 'foo', 'bar')
        .addAction('A4', 'foo', 'bar')
        .addAction('A5', 'foo', 'bar');
      expect(message.template.attachments[0].actions.length).toBe(5);
    });

    it('should throw an error if you try to add more than 5 actions', () => {
      const message = new formatSlackMessage().addAttachment()
        .addAction('A1', 'foo', 'bar')
        .addAction('A2', 'foo', 'bar')
        .addAction('A3', 'foo', 'bar')
        .addAction('A4', 'foo', 'bar')
        .addAction('A5', 'foo', 'bar');
      expect(() => message.addAction('A6', 'foo', 'bar')).toThrowError('You can not add more than 5 actions');
    });

    it('should throw an error if you addSelect without valid data', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(() => message.addSelect()).toThrowError('Text and name are requeired for addAction method');
    });
    
    it('should throw an error if you addSelect without valid data', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(() => message.addSelect()).toThrowError('Text and name are requeired for addAction method');
    });
    
    it('should throw an error if you addSelect with name with two or more words', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(() => message.addSelect('Select menu', 'one two')).toThrowError('Name need to be one word');
    });

    it('should throw an error if addSelect with options is not valid array', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(() => message.addSelect('Select menu', 'select', {}))
        .toThrowError('options needs to be a valid array');
      expect(() => message.addSelect('Select menu', 'select', ''))
        .toThrowError('options needs to be a valid array');
      expect(() => message.addSelect('Select menu', 'select', false))
        .toThrowError('options needs to be a valid array');
    });

    it('should throw an error if you addSelect with dataSource is not static, users, channels, conversations or external', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(() => message.addSelect('Selecte menu', 'select', null, 'else'))
        .toThrowError('The value of the dataSource can be users, channels, conversations, external or static');
      expect(() => message.addSelect('Selecte menu', 'select', null, true))
        .toThrowError('The value of the dataSource can be users, channels, conversations, external or static');
      expect(() => message.addSelect('Selecte menu', 'select', null, {}))
        .toThrowError('The value of the dataSource can be users, channels, conversations, external or static');
    });

    it('should throw an error if addSelect with dataSource provide static without options', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(() => message.addSelect('Selecte menu', 'select', null, 'static'))
        .toThrowError('options needs to be a valid array');
    });

    it('should a valid addSelect with dataSource provide static', () => {
      const message = new formatSlackMessage().addAttachment();
      message.addSelect('Select menu', 'select', [], 'static');
      expect(message.template.attachments[0].actions[0].data_source).toBe('static');
    });

    it('should a valid addSelect with dataSource provide users', () => {
      const message = new formatSlackMessage().addAttachment();
      message.addSelect('Select menu', 'select', null, 'users');
      expect(message.template.attachments[0].actions[0].data_source).toBe('users');
    });

    it('should a valid addSelect with dataSource provide channels', () => {
      const message = new formatSlackMessage().addAttachment();
      message.addSelect('Select menu', 'select', null, 'channels');
      expect(message.template.attachments[0].actions[0].data_source).toBe('channels');
    });

    it('should a valid addSelect with dataSource provide conversations', () => {
      const message = new formatSlackMessage().addAttachment();
      message.addSelect('Select menu', 'select', null, 'conversations');
      expect(message.template.attachments[0].actions[0].data_source).toBe('conversations');
    });

    it('should a valid addSelect with dataSource provide external', () => {
      const message = new formatSlackMessage().addAttachment();
      message.addSelect('Select menu', 'select', null, 'external');
      expect(message.template.attachments[0].actions[0].data_source).toBe('external');
    });

    it('should throw an error if addSelect with minQueryLength is not number', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(() => message.addSelect('Select menu', 'select', undefined, 'static', '123'))
        .toThrowError('minQueryLength needs to be a valid number');
      expect(() => message.addSelect('Select menu', 'select', undefined, 'static', true))
        .toThrowError('minQueryLength needs to be a valid number');
      expect(() => message.addSelect('Select menu', 'select', undefined, 'static', {}))
        .toThrowError('minQueryLength needs to be a valid number');
    });

    it('should add a select', () => {
      const options = [{ text: 'Foo', value: 'foo' }, { text: 'Bar', value: 'bar' }];
      const message = new formatSlackMessage().addAttachment().addSelect('Select menu', 'select', options);
      expect(message.template.attachments[0].actions.length).toBe(1);
      expect(message.template.attachments[0].actions[0].text).toBe('Select menu');
      expect(message.template.attachments[0].actions[0].name).toBe('select');
      expect(message.template.attachments[0].actions[0].options).toEqual(options);
      expect(message.template.attachments[0].actions[0].type).toBe('select');
    });

    
    it('should throw an error if you addLinkButton without valid data', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(() => message.addLinkButton()).toThrowError('Text and URL are requeired for addLinkButton method');
    });
    
    it('should throw an error if you addLinkButton without valid data', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(() => message.addLinkButton('Button name')).toThrowError('Text and URL are requeired for addLinkButton method');
    });
    
    it('should throw an error if you addLinkButton without valid data', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(() => message.addLinkButton('Button Name', 'foo')).toThrowError('URL need to be a valid');
    });

    it('should throw an error if you try to add more than 5 actions and link buttons', () => {
      const message = new formatSlackMessage().addAttachment()
        .addAction('A1', 'foo', 'bar')
        .addAction('A2', 'foo', 'bar')
        .addAction('A3', 'foo', 'bar')
        .addAction('A4', 'foo', 'bar')
        .addAction('A5', 'foo', 'bar');
      expect(() => message.addLinkButton('Button', 'http://foo.bar')).toThrowError('You can not add more than 5 actions and link buttons');
    });

    it('should throw an error if you try to add confirmation before adding an action', () => {
      const message = new formatSlackMessage().addAttachment();
      expect(() => message.addConfirmation()).toThrowError('At least one action is requeired for getLatestAction method');
    });

    it('should throw an error if you try to add confirmation without valid data', () => {
      const message = new formatSlackMessage().addAttachment().addAction('FooBar', 'foo', 'bar');
      expect(() => message.addConfirmation()).toThrowError('Title and text are required for addConfirmation method');
    });

    it('should add a confirmation', () => {
      const message = new formatSlackMessage().addAttachment().addAction('FooBar', 'foo', 'bar').addConfirmation('Title', 'Text');
      expect(message.template.attachments[0].actions[0].confirm.title).toBe('Title');
      expect(message.template.attachments[0].actions[0].confirm.text).toBe('Text');
      expect(message.template.attachments[0].actions[0].confirm.ok_text).toBe('Ok');
      expect(message.template.attachments[0].actions[0].confirm.dismiss_text).toBe('Dismiss');
    });

    it('should add a confirmation to the last action', () => {
      const message = new formatSlackMessage()
        .addAttachment()
          .addAction('First', 'foo', 'bar')
          .addAction('Second', 'foo', 'bar')
          .addAction('Last', 'foo', 'bar')
            .addConfirmation('Title', 'Text', 'Yes', 'No');
      expect(message.template.attachments[0].actions[message.template.attachments[0].actions.length - 1].confirm.title).toBe('Title');
      expect(message.template.attachments[0].actions[message.template.attachments[0].actions.length - 1].confirm.text).toBe('Text');
      expect(message.template.attachments[0].actions[message.template.attachments[0].actions.length - 1].confirm.ok_text).toBe('Yes');
      expect(message.template.attachments[0].actions[message.template.attachments[0].actions.length - 1].confirm.dismiss_text).toBe('No');
    });

    it('should return an json object', () => {
      const message = new formatSlackMessage('Something').channelMessage(true).get();
      expect(typeof message).toBe('object');
      expect(message).toEqual({
        text: 'Something',
        response_type: 'in_channel',
        mrkdwn: true,
        attachments: []
      });
    });
  });
});
