/*global describe, it, expect, beforeEach, require */
'use strict';

const formatFbMessage = require('../../lib/facebook/format-message');
const messageTags = ['COMMUNITY_ALERT', 'CONFIRMED_EVENT_REMINDER',
 'NON_PROMOTIONAL_SUBSCRIPTION', 'PAIRING_UPDATE', 'APPLICATION_UPDATE',
 'ACCOUNT_UPDATE', 'PAYMENT_UPDATE', 'PERSONAL_FINANCE_UPDATE',
 'SHIPPING_UPDATE', 'RESERVATION_UPDATE','ISSUE_RESOLUTION',
 'APPOINTMENT_UPDATE', 'GAME_EVENT', 'TRANSPORTATION_UPDATE',
 'FEATURE_FUNCTIONALITY_UPDATE', 'TICKET_UPDATE'];

describe('Facebook format message', () => {
  it('should export an object', () => {
    expect(typeof formatFbMessage).toBe('object');
  });

  describe('Text', () => {
    it('should be a class', () => {
      const message = new formatFbMessage.Text('text');
      expect(typeof formatFbMessage.Text).toBe('function');
      expect(message instanceof formatFbMessage.Text).toBeTruthy();
    });

    it('should throw an error if text is not provided', () => {
      expect(() => new formatFbMessage.Text()).toThrowError('Text is required for text template');
    });

    it('should add a text', () => {
      const message = new formatFbMessage.Text('Some text').get();
      expect(message.text).toBe('Some text');
    });

    it('should return a simple text object', () => {
      const message = new formatFbMessage.Text('Some text');
      expect(message.get()).toEqual({
        text: 'Some text'
      });
    });

    it('should throw an error if addQuickReply arguments are not provided', () => {
      const message = new formatFbMessage.Text('Some text');
      expect(() => message.addQuickReply()).toThrowError('Both text and payload are required for a quick reply');
    });

    it('should throw an error if addQuickReply payload is too long', () => {
      const message = new formatFbMessage.Text('Some text');
      let payload = new Array(102).join('0123456789');
      expect(() => message.addQuickReply('title', payload)).toThrowError('Payload can not be more than 1000 characters long');
    });

    it('should throw an error if addQuickReply imageUrl is not an url', () => {
      const message = new formatFbMessage.Text('Some text');
      const imageUrl = 'http//invalid-url';
      expect(() => message.addQuickReply('title', 'PAYLOAD', imageUrl)).toThrowError('Image has a bad url');
    });

    it('should add a quick reply', () => {
      const message = new formatFbMessage.Text('Some text')
        .addQuickReply('title', 'PAYLOAD')
        .get();
      expect(message.quick_replies.length).toBe(1);
      expect(message.quick_replies[0].title).toBe('title');
      expect(message.quick_replies[0].payload).toBe('PAYLOAD');
    });

    it('should add a quick reply with an image', () => {
      const message = new formatFbMessage.Text('Some text')
        .addQuickReply('title', 'PAYLOAD','http://google.com/path/to/image.png')
        .get();
      expect(message.quick_replies.length).toBe(1);
      expect(message.quick_replies[0].content_type).toBe('text');
      expect(message.quick_replies[0].title).toBe('title');
      expect(message.quick_replies[0].payload).toBe('PAYLOAD');
      expect(message.quick_replies[0].image_url).toBe('http://google.com/path/to/image.png');
    });

    it('should add a quick reply with a location', () => {
      const message = new formatFbMessage.Text('Some text')
        .addQuickReplyLocation()
        .get();
      expect(message.quick_replies.length).toBe(1);
      expect(message.quick_replies[0].content_type).toBe('location');
    });

    it('should add 11 quick replies', () => {
      const message = new formatFbMessage.Text('Some text')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReplyLocation()
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .get();
      expect(message.quick_replies.length).toBe(11);
    });

    it('should throw an error if there\'s more than 11 quick replies', () => {
      const message = new formatFbMessage.Text('Some text')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReplyLocation()
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD');
      expect(() => message.addQuickReply('title', 'PAYLOAD')).toThrowError('There can not be more than 11 quick replies');
    });

    it ('should set the messaging type', () => {
      const response = new formatFbMessage.Text('Some text')
        .setMessagingType('RESPONSE')
        .get();
      expect(response.messaging_type).toBe('RESPONSE');
      const update = new formatFbMessage.Text('Some text')
        .setMessagingType('UPDATE')
        .get();
      expect(update.messaging_type).toBe('UPDATE');
      const msgTag = new formatFbMessage.Text('Some text')
        .setMessagingType('MESSAGE_TAG')
        .get();
      expect(msgTag.messaging_type).toBe('MESSAGE_TAG');
    });

    it('should set messaging type to "RESPONSE" if no valid type supplied', () => {
      const defaultType = new formatFbMessage.Text('Some text')
        .setMessagingType('FACE_SLAP')
        .get();
      expect(defaultType.messaging_type).toBe('RESPONSE');
    });

    it ('should set the message tag', () => {
      const community_alert = new formatFbMessage.Text('Some text')
        .setMessageTag('COMMUNITY_ALERT')
        .get();
      expect(community_alert.message_tag).toBe('COMMUNITY_ALERT');

      const event_reminder = new formatFbMessage.Text('Some text')
        .setMessageTag('CONFIRMED_EVENT_REMINDER')
        .get();
      expect(event_reminder.message_tag).toBe('CONFIRMED_EVENT_REMINDER');

      const subscription = new formatFbMessage.Text('Some text')
        .setMessageTag('NON_PROMOTIONAL_SUBSCRIPTION')
        .get();
      expect(subscription.message_tag).toBe('NON_PROMOTIONAL_SUBSCRIPTION');

      const pairing_update = new formatFbMessage.Text('Some text')
        .setMessageTag('PAIRING_UPDATE')
        .get();
      expect(pairing_update.message_tag).toBe('PAIRING_UPDATE');

      const application_update = new formatFbMessage.Text('Some text')
        .setMessageTag('APPLICATION_UPDATE')
        .get();
      expect(application_update.message_tag).toBe('APPLICATION_UPDATE');

      const account_update = new formatFbMessage.Text('Some text')
        .setMessageTag('ACCOUNT_UPDATE')
        .get();
      expect(account_update .message_tag).toBe('ACCOUNT_UPDATE');

      const shipping_update = new formatFbMessage.Text('Some text')
        .setMessageTag('SHIPPING_UPDATE')
        .get();
      expect(shipping_update.message_tag).toBe('SHIPPING_UPDATE');
    });

    it('should throw an error on setMessageTag when given an invalid value', () => {
      expect(() => new formatFbMessage.Text('Some text').setMessageTag('FACE_SLAP').toThrowError(`Message tag must be one of the following: ${JSON.stringify(messageTags, null, 2)}`));
    });

    it('should set the notification type', () => {
      const regular = new formatFbMessage.Text('Some text')
        .setNotificationType('REGULAR')
        .get();
      expect(regular.notification_type).toBe('REGULAR');

      const silent = new formatFbMessage.Text('Some text')
        .setNotificationType('SILENT_PUSH')
        .get();
      expect(silent.notification_type).toBe('SILENT_PUSH');

      const none = new formatFbMessage.Text('Some text')
        .setNotificationType('NO_PUSH')
        .get();
      expect(none.notification_type).toBe('NO_PUSH');
    });


    it('should throw an on setNotificationType with invalid value', () => {
      expect(() => new formatFbMessage.Text('Some text').setNotificationType('FACE_SLAP')).toThrowError('Notification type must be one of REGULAR, SILENT_PUSH, or NO_PUSH');
    });

    it('should trim the title if it is too long', () => {
      let title = new Array(4).join('0123456789');
      const message = new formatFbMessage.Text('Some text')
        .addQuickReply(title, 'PAYLOAD')
        .get();
      expect(message.quick_replies[0].title).toBe('01234567890123456789');
    });

    it('should return a json with text and quick replies', () => {
      const message = new formatFbMessage.Text('Some text')
        .addQuickReply('title', 'PAYLOAD');
      expect(message.get()).toEqual({
        text: 'Some text',
        quick_replies: [{
          title: 'title',
          payload: 'PAYLOAD',
          content_type: 'text'
        }]
      });
    });
  });

  describe('Generic template', () => {
    let generic;

    beforeEach(() => {
      generic = new formatFbMessage.Generic();
    });

    it('should be a class', () => {
      expect(typeof formatFbMessage.Generic).toBe('function');
      expect(generic instanceof formatFbMessage.Generic).toBeTruthy();
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

    it('should add a bubble with a provided title', () => {
      generic.addBubble('Test');

      expect(generic.bubbles.length).toBe(1);
      expect(generic.bubbles[0].title).toBe('Test');
    });

    it('should add a bubble with a provided title and subtitle', () => {
      generic.addBubble('Test Title', 'Test Subtitle');

      expect(generic.bubbles.length).toBe(1);
      expect(generic.bubbles[0].title).toBe('Test Title');
      expect(generic.bubbles[0].subtitle).toBe('Test Subtitle');
    });

    it('should throw an error if you try to add an url but not provide it', () => {
      generic.addBubble('Test');

      expect(() => generic.addUrl()).toThrowError('URL is required for addUrl method');
    });

    it('should throw an error if you try to add an url in invalid format', () => {
      generic.addBubble('Test');

      expect(() => generic.addUrl('http//invalid-url')).toThrowError('URL needs to be valid for addUrl method');
    });

    it('should add an url if it is valid', () => {
      generic
        .addBubble('Test')
        .addUrl('http://google.com');

      expect(generic.bubbles.length).toBe(1);
      expect(generic.bubbles[0].item_url).toBe('http://google.com');
    });

    it('should throw an error if you try to add an image but not provide an url', () => {
      generic
        .addBubble('Test');

      expect(() => generic.addImage()).toThrowError('Image URL is required for addImage method');
    });

    it('should throw an error if you try to add an image, but url is in invalid format', () => {
      generic
        .addBubble('Test');

      expect(() => generic.addImage('http//invalid-url')).toThrowError('Image URL needs to be valid for addImage method');
    });

    it('should add an image if it is valid', () => {
      generic
        .addBubble('Test')
        .addImage('http://google.com/path/to/image.png');

      expect(generic.bubbles.length).toBe(1);
      expect(generic.bubbles[0].image_url).toBe('http://google.com/path/to/image.png');
    });

    it('should use square aspect ratio for images if "useSquareImages" method is chained', () => {
      generic
        .useSquareImages()
        .addBubble('Test')
        .addImage('http://google.com/path/to/image.png');

      expect(generic.bubbles.length).toBe(1);
      expect(generic.bubbles[0].image_url).toBe('http://google.com/path/to/image.png');
      expect(generic.get().attachment.payload.image_aspect_ratio).toBe('square');
    });

    it('should throw an error if you add a default action without the url', () => {
      generic
        .addBubble('Test');

      expect(() => generic.addDefaultAction()).toThrowError('Bubble default action URL is required');
    });

    it('should throw an error if you add a default action with an invalid url', () => {
      generic
        .addBubble('Test');

      expect(() => generic.addDefaultAction('some_url')).toThrowError('Bubble default action URL must be valid URL');
    });

    it('should throw an error if you add more than one default action', () => {
      generic
        .addBubble('Test')
        .addDefaultAction('http://google.com/some/action');

      expect(() => generic.addDefaultAction('http://google.com/some/action')).toThrowError('Bubble already has default action');
    });

    it('should add default action', () => {
      generic
        .addBubble('1', 'hello')
        .addDefaultAction('http://google.com/some/action');

      expect(generic.bubbles.length).toBe(1);
      expect(generic.bubbles[0].default_action.type).toBe('web_url');
      expect(generic.bubbles[0].default_action.url).toBe('http://google.com/some/action');
    });

    it('should throw an error if you add a button without the title', () => {
      generic
        .addBubble('Test');

      expect(() => generic.addButton()).toThrowError('Button title cannot be empty');
    });

    it('should throw an error if you add a button without the value', () => {
      generic
        .addBubble('Test');

      expect(() => generic.addButton('Title')).toThrowError('Button value is required');
    });

    it('should add a button with title and payload if you pass valid format', () => {
      generic
        .addBubble('Test')
        .addButton('Title 1', 1);

      expect(generic.bubbles[0].buttons.length).toBe(1);
      expect(generic.bubbles[0].buttons[0].title).toBe('Title 1');
      expect(generic.bubbles[0].buttons[0].type).toBe('postback');
      expect(generic.bubbles[0].buttons[0].payload).toBe(1);
      expect(generic.bubbles[0].buttons[0].url).not.toBeDefined();
    });

    it('should add a button with a share url', () => {
      generic
        .addBubble('Test')
        .addShareButton();

      expect(generic.bubbles[0].buttons.length).toBe(1);
      expect(generic.bubbles[0].buttons[0].type).toBe('element_share');
    });

    it('should add a button with title and url if you pass valid format', () => {
      generic
        .addBubble('Test')
        .addButton('Title 1', 'http://google.com');

      expect(generic.bubbles[0].buttons.length).toBe(1);
      expect(generic.bubbles[0].buttons[0].title).toBe('Title 1');
      expect(generic.bubbles[0].buttons[0].type).toBe('web_url');
      expect(generic.bubbles[0].buttons[0].url).toBe('http://google.com');
      expect(generic.bubbles[0].buttons[0].payload).not.toBeDefined();
    });

    it('should add 3 buttons with valid titles and formats', () => {
      generic
        .addBubble('Test')
        .addButton('b1', 'v1')
        .addButton('b2', 'v2')
        .addButton('b3', 'v3');

      expect(generic.bubbles[0].buttons.length).toBe(3);
      expect(generic.bubbles[0].buttons[0].title).toBe('b1');
      expect(generic.bubbles[0].buttons[0].payload).toBe('v1');
      expect(generic.bubbles[0].buttons[1].title).toBe('b2');
      expect(generic.bubbles[0].buttons[1].payload).toBe('v2');
      expect(generic.bubbles[0].buttons[2].title).toBe('b3');
      expect(generic.bubbles[0].buttons[2].payload).toBe('v3');
    });

    it('should throw an error if call button is added with wrong phone format', () => {
      generic.addBubble('Test');
      expect(() => generic.addCallButton('Title')).toThrowError('Call button value needs to be a valid phone number in following format: +1234567...');
      expect(() => generic.addCallButton('Title', 123)).toThrowError('Call button value needs to be a valid phone number in following format: +1234567...');
      expect(() => generic.addCallButton('Title', 'abc')).toThrowError('Call button value needs to be a valid phone number in following format: +1234567...');
      expect(() => generic.addCallButton('Title', '+123')).toThrowError('Call button value needs to be a valid phone number in following format: +1234567...');
    });

    it('should add a call button', () => {
      generic.addBubble('Test')
        .addCallButton('Button 1', '+123456789');

      expect(generic.bubbles[0].buttons.length).toBe(1);
      expect(generic.bubbles[0].buttons[0].title).toBe('Button 1');
      expect(generic.bubbles[0].buttons[0].payload).toBe('+123456789');
      expect(generic.bubbles[0].buttons[0].type).toBe('phone_number');
    });

    it('should add a share button', () => {
      generic.addBubble('Test')
        .addShareButton();

      expect(generic.bubbles[0].buttons.length).toBe(1);
      expect(generic.bubbles[0].buttons[0].title).toBeUndefined();
      expect(generic.bubbles[0].buttons[0].type).toBe('element_share');
    });

    it('should add a share button with share content', () => {
      const shareContent = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: `I took Peter's "Which Hat Are You?" Quiz`,
                subtitle: 'My result: Fez',
                image_url: 'https//bot.peters-hats.com/img/hats/fez.jpg',
                default_action: {
                  type: 'web_url',
                  url: 'http://m.me/petershats?ref=invited_by_24601'
                },
                buttons: [{
                  type: 'web_url',
                  url: 'http://m.me/petershats?ref=invited_by_24601',
                  title: 'Take Quiz'
                }]
              }
            ]
          }
        }
      };
      generic.addBubble('Test')
        .addShareButton(shareContent);

      expect(generic.bubbles[0].buttons.length).toBe(1);
      expect(generic.bubbles[0].buttons[0].title).toBeUndefined();
      expect(generic.bubbles[0].buttons[0].type).toBe('element_share');
      expect(generic.bubbles[0].buttons[0].share_contents).toEqual(shareContent);
    });

    it('should throw an error if all arguments are not provided for buy button', () => {
      generic.addBubble('Test');

      expect(() => generic.addBuyButton()).toThrowError('Button value is required');
      expect(() => generic.addBuyButton('Title')).toThrowError('Button value is required');
      expect(() => generic.addBuyButton('Title', 'PAYLOAD')).toThrowError('Payment summary is required for buy button');
      expect(() => generic.addBuyButton('Title', 'PAYLOAD', 123)).toThrowError('Payment summary is required for buy button');
      expect(() => generic.addBuyButton('Title', 'PAYLOAD', 'abc')).toThrowError('Payment summary is required for buy button');
    });

    it('should add a buy button', () => {
      generic.addBubble('Test')
        .addBuyButton('Buy', 'BUY_PAYLOAD', {
          additionalOptions: true
        });

      expect(generic.bubbles[0].buttons.length).toBe(1);
      expect(generic.bubbles[0].buttons[0].title).toBe('Buy');
      expect(generic.bubbles[0].buttons[0].type).toBe('payment');
      expect(generic.bubbles[0].buttons[0].payload).toBe('BUY_PAYLOAD');
      expect(generic.bubbles[0].buttons[0].payment_summary).toEqual({
        additionalOptions: true
      });
    });

    it('should throw an error if url provided for login button is not valid', () => {
      generic.addBubble('Test');

      expect(() => generic.addLoginButton()).toThrowError('Valid URL is required for Login button');
      expect(() => generic.addLoginButton('123')).toThrowError('Valid URL is required for Login button');
    });

    it('should add a login button', () => {
      generic.addBubble('Test')
        .addLoginButton('https://example.com');

      expect(generic.bubbles[0].buttons.length).toBe(1);
      expect(generic.bubbles[0].buttons[0].title).toBeUndefined();
      expect(generic.bubbles[0].buttons[0].type).toBe('account_link');
      expect(generic.bubbles[0].buttons[0].url).toBe('https://example.com');
    });

    it('should add a logout button', () => {
      generic.addBubble('Test')
        .addLogoutButton();

      expect(generic.bubbles[0].buttons.length).toBe(1);
      expect(generic.bubbles[0].buttons[0].title).toBeUndefined();
      expect(generic.bubbles[0].buttons[0].type).toBe('account_unlink');
    });

    it('should throw an error if you add more than 3 buttons', () => {
      generic
        .addBubble('Test');

      expect(() => {
        generic
          .addButton('Title 1', 1)
          .addButton('Title 2', 2)
          .addButton('Title 3', 3)
          .addButton('Title 4', 4);
      }).toThrowError('3 buttons are already added and that\'s the maximum');
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

    it('should return a formated object in the end', () => {
      expect(
        generic
          .addBubble('Title')
          .get()
      ).toEqual({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [{
              title: 'Title'
            }]
          }
        }
      });
    });
  });

  describe('Button template', () => {
    it('should be a class', () => {
      let button = new formatFbMessage.Button('Test');

      expect(typeof formatFbMessage.Button).toBe('function');
      expect(button instanceof formatFbMessage.Button).toBeTruthy();
    });

    it('should throw an error if button text is not provided', () => {
      expect(() => new formatFbMessage.Button()).toThrowError('Button template text cannot be empty');
    });

    it('should throw an error if button text is longer than 640 characters', () => {
      expect(() => new formatFbMessage.Button(Array(641).fill('x').join(''))).toThrowError('Button template text cannot be longer than 640 characters');
    });

    it('should create a button template with the text when valid text is provided', () => {
      let button = new formatFbMessage.Button('Test');

      expect(button.template.attachment.payload.text).toBe('Test');
    });

    it('should throw an error if you add a button without the title', () => {
      let button = new formatFbMessage.Button('Test');

      expect(() => button.addButton()).toThrowError('Button title cannot be empty');
    });

    it('should throw an error if you add a button without the value', () => {
      let button = new formatFbMessage.Button('Test');

      expect(() => button.addButton('Title')).toThrowError('Button value is required');
    });

    it('should add a button with title and payload if you pass valid format', () => {
      let button = new formatFbMessage.Button('Test');
      button.addButton('Title 1', 1);

      expect(button.template.attachment.payload.buttons.length).toBe(1);
      expect(button.template.attachment.payload.buttons[0].title).toBe('Title 1');
      expect(button.template.attachment.payload.buttons[0].type).toBe('postback');
      expect(button.template.attachment.payload.buttons[0].payload).toBe(1);
      expect(button.template.attachment.payload.buttons[0].url).not.toBeDefined();
    });

    it('should add a button with title and url if you pass valid format', () => {
      let button = new formatFbMessage.Button('Test');
      button.addButton('Title 1', 'http://google.com');

      expect(button.template.attachment.payload.buttons.length).toBe(1);
      expect(button.template.attachment.payload.buttons[0].title).toBe('Title 1');
      expect(button.template.attachment.payload.buttons[0].type).toBe('web_url');
      expect(button.template.attachment.payload.buttons[0].url).toBe('http://google.com');
      expect(button.template.attachment.payload.buttons[0].payload).not.toBeDefined();
    });

    it('should add 3 buttons with valid titles and formats', () => {
      const button = new formatFbMessage.Button('Test');
      button
        .addButton('b1', 'v1')
        .addButton('b2', 'v2')
        .addButton('b3', 'v3');

      expect(button.template.attachment.payload.buttons.length).toBe(3);
      expect(button.template.attachment.payload.buttons[0].title).toBe('b1');
      expect(button.template.attachment.payload.buttons[0].payload).toBe('v1');
      expect(button.template.attachment.payload.buttons[1].title).toBe('b2');
      expect(button.template.attachment.payload.buttons[1].payload).toBe('v2');
      expect(button.template.attachment.payload.buttons[2].title).toBe('b3');
      expect(button.template.attachment.payload.buttons[2].payload).toBe('v3');
    });

    it('should throw an error if call button is added with wrong phone format', () => {
      const button = new formatFbMessage.Button('Test');
      expect(() => button.addCallButton('Title')).toThrowError('Call button value needs to be a valid phone number in following format: +1234567...');
      expect(() => button.addCallButton('Title', 123)).toThrowError('Call button value needs to be a valid phone number in following format: +1234567...');
      expect(() => button.addCallButton('Title', 'abc')).toThrowError('Call button value needs to be a valid phone number in following format: +1234567...');
      expect(() => button.addCallButton('Title', '+123')).toThrowError('Call button value needs to be a valid phone number in following format: +1234567...');
    });

    it('should add a call button', () => {
      const button = new formatFbMessage.Button('Test')
        .addCallButton('Button 1', '+123456789');

      expect(button.template.attachment.payload.buttons.length).toBe(1);
      expect(button.template.attachment.payload.buttons[0].title).toBe('Button 1');
      expect(button.template.attachment.payload.buttons[0].payload).toBe('+123456789');
      expect(button.template.attachment.payload.buttons[0].type).toBe('phone_number');
    });
    it('should add a share button', () => {
      const button = new formatFbMessage.Button('Test')
        .addShareButton();

      expect(button.template.attachment.payload.buttons.length).toBe(1);
      expect(button.template.attachment.payload.buttons[0].title).toBeUndefined();
      expect(button.template.attachment.payload.buttons[0].type).toBe('element_share');
    });

    it('should add a share button with share content', () => {
      const shareContent = {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: `I took Peter's "Which Hat Are You?" Quiz`,
                subtitle: 'My result: Fez',
                image_url: 'https//bot.peters-hats.com/img/hats/fez.jpg',
                default_action: {
                  type: 'web_url',
                  url: 'http://m.me/petershats?ref=invited_by_24601'
                },
                buttons: [{
                  type: 'web_url',
                  url: 'http://m.me/petershats?ref=invited_by_24601',
                  title: 'Take Quiz'
                }]
              }
            ]
          }
        }
      };
      const button = new formatFbMessage.Button('Test')
        .addShareButton(shareContent);

      expect(button.template.attachment.payload.buttons.length).toBe(1);
      expect(button.template.attachment.payload.buttons[0].title).toBeUndefined();
      expect(button.template.attachment.payload.buttons[0].type).toBe('element_share');
      expect(button.template.attachment.payload.buttons[0].share_contents).toEqual(shareContent);
    });

    it('should throw an error if all arguments are not provided for buy button', () => {
      const button = new formatFbMessage.Button('Test');

      expect(() => button.addBuyButton()).toThrowError('Button value is required');
      expect(() => button.addBuyButton('Title')).toThrowError('Button value is required');
      expect(() => button.addBuyButton('Title', 'PAYLOAD')).toThrowError('Payment summary is required for buy button');
      expect(() => button.addBuyButton('Title', 'PAYLOAD', 123)).toThrowError('Payment summary is required for buy button');
      expect(() => button.addBuyButton('Title', 'PAYLOAD', 'abc')).toThrowError('Payment summary is required for buy button');
    });

    it('should add a buy button', () => {
      const button = new formatFbMessage.Button('Test')
        .addBuyButton('Buy', 'BUY_PAYLOAD', {
          additionalOptions: true
        });

      expect(button.template.attachment.payload.buttons.length).toBe(1);
      expect(button.template.attachment.payload.buttons[0].title).toBe('Buy');
      expect(button.template.attachment.payload.buttons[0].type).toBe('payment');
      expect(button.template.attachment.payload.buttons[0].payload).toBe('BUY_PAYLOAD');
      expect(button.template.attachment.payload.buttons[0].payment_summary).toEqual({
        additionalOptions: true
      });
    });

    it('should throw an error if url provided for login button is not valid', () => {
      const button = new formatFbMessage.Button('Test');

      expect(() => button.addLoginButton()).toThrowError('Valid URL is required for Login button');
      expect(() => button.addLoginButton('123')).toThrowError('Valid URL is required for Login button');
    });

    it('should add a login button', () => {
      const button = new formatFbMessage.Button('Test')
        .addLoginButton('https://example.com');

      expect(button.template.attachment.payload.buttons.length).toBe(1);
      expect(button.template.attachment.payload.buttons[0].title).toBeUndefined();
      expect(button.template.attachment.payload.buttons[0].type).toBe('account_link');
      expect(button.template.attachment.payload.buttons[0].url).toBe('https://example.com');
    });

    it('should add a logout button', () => {
      const button = new formatFbMessage.Button('Test')
        .addLogoutButton();

      expect(button.template.attachment.payload.buttons.length).toBe(1);
      expect(button.template.attachment.payload.buttons[0].title).toBeUndefined();
      expect(button.template.attachment.payload.buttons[0].type).toBe('account_unlink');
    });

    it('should return a formated object in the end', () => {
      expect(
        new formatFbMessage.Button('Test')
          .addButton('Title 1', 1)
          .get()
      ).toEqual({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'button',
            text: 'Test',
            buttons: [{
              type: 'postback',
              title: 'Title 1',
              payload: 1
            }]
          }
        }
      });
    });
  });

  describe('Receipt template', () => {
    let fbExample = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'receipt',
          recipient_name: 'Stephane Crozatier',
          order_number: '12345678902',
          currency: 'USD',
          payment_method: 'Visa 2345',
          order_url: 'http://petersapparel.parseapp.com/order?order_id=123456',
          timestamp: 1428444852,
          elements: [
            {
              title: 'Classic White T-Shirt',
              subtitle: '100% Soft and Luxurious Cotton',
              quantity: 2,
              price: 50,
              currency: 'USD',
              image_url: 'http://petersapparel.parseapp.com/img/whiteshirt.png'
            },
            {
              title: 'Classic Gray T-Shirt',
              subtitle: '100% Soft and Luxurious Cotton',
              quantity: 1,
              price: 25,
              currency: 'USD',
              image_url: 'http://petersapparel.parseapp.com/img/grayshirt.png'
            }
          ],
          address: {
            street_1: '1 Hacker Way',
            street_2: '',
            city: 'Menlo Park',
            postal_code: '94025',
            state: 'CA',
            country: 'US'
          },
          summary: {
            subtotal: 75.00,
            shipping_cost: 4.95,
            total_tax: 6.19,
            total_cost: 56.14
          },
          adjustments: [
            {
              name: 'New Customer Discount',
              amount: 20
            },
            {
              name: '$10 Off Coupon',
              amount: 10
            }
          ]
        }
      }
    };

    it('should be a class', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');

      expect(typeof formatFbMessage.Receipt).toBe('function');
      expect(receipt instanceof formatFbMessage.Receipt).toBeTruthy();
    });

    it('should throw an error if recipient\'s name is not defined', () => {
      expect(() => new formatFbMessage.Receipt()).toThrowError('Recipient\'s name cannot be empty');
    });

    it('should throw an error if order number is not defined', () => {
      expect(() => new formatFbMessage.Receipt('John Doe')).toThrowError('Order number cannot be empty');
    });

    it('should throw an error if currency is not defined', () => {
      expect(() => new formatFbMessage.Receipt('John Doe', 'O123')).toThrowError('Currency cannot be empty');
    });

    it('should throw an error if payment method is not defined', () => {
      expect(() => new formatFbMessage.Receipt('John Doe', 'O123', '$')).toThrowError('Payment method cannot be empty');
    });

    it('should create a receipt template object if recipient, order number, currency and payment method are passed', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');

      expect(typeof receipt).toBe('object');
      expect(receipt.template.attachment.payload.recipient_name).toBe('John Doe');
      expect(receipt.template.attachment.payload.order_number).toBe('O123');
      expect(receipt.template.attachment.payload.currency).toBe('$');
      expect(receipt.template.attachment.payload.payment_method).toBe('Paypal');
    });

    it('should throw an error if user tries to add timestamp but don\'t provide it', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');

      expect(() => receipt.addTimestamp()).toThrowError('Timestamp is required for addTimestamp method');
    });

    it('should throw an error if timestamp is not valid date object', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');

      expect(() => receipt.addTimestamp('invalid-timestamp')).toThrowError('Timestamp needs to be a valid Date object');
    });

    it('should add a timestamp if it is a valid date object', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');
      receipt.addTimestamp(new Date('2016-06-14T20:55:31.438Z'));

      expect(receipt.template.attachment.payload.timestamp).toBe(new Date('2016-06-14T20:55:31.438Z').getTime());
    });

    it('should should throw an error if user tries to add order url but doesn\'t provide it', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');

      expect(() => receipt.addOrderUrl()).toThrowError('Url is required for addOrderUrl method');
    });

    it('should should throw an error if order url is not a valid url', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');

      expect(() => receipt.addOrderUrl('http//invalid-url')).toThrowError('Url needs to be valid for addOrderUrl method');
    });

    it('should add an order url if it is a valid url', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');
      receipt.addOrderUrl('http://google.com');

      expect(receipt.template.attachment.payload.order_url).toBe('http://google.com');
    });

    it('should throw an error if there\'s no items in order', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');

      expect(() => receipt.get()).toThrowError('At least one element/item is required');
    });

    it('should throw an error if user tries to add an item without title', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');

      expect(() => receipt.addItem()).toThrowError('Item title is required');
    });

    it('should add an item if valid title is provided', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');
      receipt.addItem('Title');

      expect(receipt.template.attachment.payload.elements.length).toBe(1);
      expect(receipt.template.attachment.payload.elements[0].title).toBe('Title');
    });

    it('should throw an error if user tries to add an item\'s subtitle but doesn\'t provide it', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');
      receipt.addItem('Title');

      expect(() => receipt.addSubtitle()).toThrowError('Subtitle is required for addSubtitle method');
    });

    it('should add an item with a subtitle if valid subtitle is provided', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');
      receipt
        .addItem('Title')
        .addSubtitle('Subtitle');

      expect(receipt.template.attachment.payload.elements.length).toBe(1);
      expect(receipt.template.attachment.payload.elements[0].subtitle).toBe('Subtitle');
    });

    it('should throw an error if user tries to add an item\'s quantity but doesn\'t provide it', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');
      receipt.addItem('Title');

      expect(() => receipt.addQuantity()).toThrowError('Quantity is required for addQuantity method');
    });

    it('should throw an error if user tries to add an item\'s quantity which is not a number', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');
      receipt.addItem('Title');

      expect(() => receipt.addQuantity('test')).toThrowError('Quantity needs to be a number');
    });

    it('should add an item with a quantity if valid number is provided', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');
      receipt
        .addItem('Title')
        .addQuantity(42);

      expect(receipt.template.attachment.payload.elements.length).toBe(1);
      expect(receipt.template.attachment.payload.elements[0].quantity).toBe(42);
    });

    it('should throw an error if user tries to add an item\'s price but doesn\'t provide it', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');
      receipt.addItem('Title');

      expect(() => receipt.addPrice()).toThrowError('Price is required for addPrice method');
    });

    it('should throw an error if user tries to add an item\'s price which is not a number', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');
      receipt.addItem('Title');

      expect(() => receipt.addPrice('test')).toThrowError('Price needs to be a number');
    });

    it('should add an item with a quantity if valid price is provided', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');
      receipt
        .addItem('Title')
        .addPrice(4.2);

      expect(receipt.template.attachment.payload.elements.length).toBe(1);
      expect(receipt.template.attachment.payload.elements[0].price).toBe(4.2);
    });

    it('should throw an error if user tries to add an item\'s currency but doesn\'t provide it', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');
      receipt.addItem('Title');

      expect(() => receipt.addCurrency()).toThrowError('Currency is required for addCurrency method');
    });

    it('should add an item with a currency if valid currency is provided', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');
      receipt
        .addItem('Title')
        .addCurrency('$');

      expect(receipt.template.attachment.payload.elements.length).toBe(1);
      expect(receipt.template.attachment.payload.elements[0].currency).toBe('$');
    });

    it('should throw an error if user tries to add an item\'s image but doesn\'t provide it', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');
      receipt.addItem('Title');

      expect(() => receipt.addImage()).toThrowError('Absolute url is required for addImage method');
    });

    it('should throw an error if user tries to add an item\'s image which is not a valid url', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');
      receipt.addItem('Title');

      expect(() => receipt.addImage('test')).toThrowError('Valid absolute url is required for addImage method');
    });

    it('should add an item with an image if valid url is provided', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');
      receipt
        .addItem('Title')
        .addImage('http://google.com/path/to/image.png');

      expect(receipt.template.attachment.payload.elements.length).toBe(1);
      expect(receipt.template.attachment.payload.elements[0].image_url).toBe('http://google.com/path/to/image.png');
    });

    it('should add more than 1 item if titles are valid', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');
      receipt
        .addItem('Title 1')
        .addItem('Title 2');

      expect(receipt.template.attachment.payload.elements.length).toBe(2);
      expect(receipt.template.attachment.payload.elements[0].title).toBe('Title 1');
      expect(receipt.template.attachment.payload.elements[1].title).toBe('Title 2');
    });

    it('should throw an error if user tries to add a shipping address without a street address', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');
      receipt
        .addItem('Title 1');

      expect(() => receipt.addShippingAddress()).toThrowError('Street is required for addShippingAddress');
    });

    it('should throw an error if user tries to add a shipping address without the city', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');
      receipt
        .addItem('Title 1');

      expect(() => receipt.addShippingAddress('Bulevar Nikole Tesle 42', null)).toThrowError('City is required for addShippingAddress method');
    });

    it('should throw an error if user tries to add a shipping address without a postal code', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');
      receipt
        .addItem('Title 1');

      expect(() => receipt.addShippingAddress('Bulevar Nikole Tesle 42', null, 'Belgrade')).toThrowError('Zip code is required for addShippingAddress method');
    });

    it('should throw an error if user tries to add a shipping address without the state', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');
      receipt
        .addItem('Title 1');

      expect(() => receipt.addShippingAddress('Bulevar Nikole Tesle 42', null, 'Belgrade', 11070)).toThrowError('State is required for addShippingAddress method');
    });

    it('should throw an error if user tries to add a shipping address without the country', () => {
      let receipt = new formatFbMessage.Receipt('John Doe', 'O123', '$', 'Paypal');
      receipt
        .addItem('Title 1');

      expect(() => receipt.addShippingAddress('Bulevar Nikole Tesle 42', null, 'Belgrade', 11070, 'Serbia')).toThrowError('Country is required for addShippingAddress method');
    });

    it('should parse an example for FB documentation', () => {
      let receipt = new formatFbMessage.Receipt('Stephane Crozatier', '12345678902', 'USD', 'Visa 2345')
        .addTimestamp(new Date(1428444852))
        .addOrderUrl('http://petersapparel.parseapp.com/order?order_id=123456')
        .addItem('Classic White T-Shirt')
          .addSubtitle('100% Soft and Luxurious Cotton')
          .addQuantity(2)
          .addPrice(50)
          .addCurrency('USD')
          .addImage('http://petersapparel.parseapp.com/img/whiteshirt.png')
        .addItem('Classic Gray T-Shirt')
          .addSubtitle('100% Soft and Luxurious Cotton')
          .addQuantity(1)
          .addPrice(25)
          .addCurrency('USD')
          .addImage('http://petersapparel.parseapp.com/img/grayshirt.png')
        .addShippingAddress('1 Hacker Way', '', 'Menlo Park', '94025',  'CA', 'US')
        .addSubtotal(75.00)
        .addShippingCost(4.95)
        .addTax(6.19)
        .addTotal(56.14)
        .addAdjustment('New Customer Discount', 20)
        .addAdjustment('$10 Off Coupon', 10)
        .get();

      expect(receipt).toEqual(fbExample);
    });

  });

  describe('Image attachment', () => {
    it('should be a class', () => {
      let image = new formatFbMessage.Image('http://google.com');

      expect(typeof formatFbMessage.Image).toBe('function');
      expect(image instanceof formatFbMessage.Image).toBeTruthy();
    });

    it('should throw an error if you add an image without the url', () => {
      expect(() => new formatFbMessage.Image()).toThrowError('Image template requires a valid URL as a first parameter');
    });

    it('should throw an error if you add an image with invalid url', () => {
      expect(() => new formatFbMessage.Image('google')).toThrowError('Image template requires a valid URL as a first parameter');
    });

    it('should add an image with given URL if URL is valid', () => {
      let image = new formatFbMessage.Image('http://google.com/path/to/image.png');

      expect(image.template.attachment.payload.url).toEqual('http://google.com/path/to/image.png');
    });

    it('should return a formated object in the end', () => {
      expect(
        new formatFbMessage.Image('http://google.com/path/to/image.png').get()
      ).toEqual({
        attachment: {
          type: 'image',
          payload: {
            url: 'http://google.com/path/to/image.png'
          }
        }
      });
    });
  });

  describe('List template', () => {
    let list;

    beforeEach(() => {
      list = new formatFbMessage.List();
    });

    it('should be a class', () => {
      expect(typeof formatFbMessage.List).toBe('function');
      expect(list instanceof formatFbMessage.List).toBeTruthy();
    });

    it('should throw an error if at least two bubble/element are not added', () => {
      expect(() => list.get()).toThrowError('2 bubbles are minimum for List template!');
    });

    it('should throw an error if bubble title does not exist', () => {
      expect(() => list.addBubble()).toThrowError('Bubble title cannot be empty');
    });

    it('should throw an error if bubble title is too long', () => {
      expect(() => list.addBubble('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua')).toThrowError('Bubble title cannot be longer than 80 characters');
    });

    it('should throw an error if bubble subtitle is too long', () => {
      expect(() => list.addBubble('Test', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua')).toThrowError('Bubble subtitle cannot be longer than 80 characters');
    });

    it('should add a bubble with a provided title', () => {
      list.addBubble('Test');

      expect(list.bubbles.length).toBe(1);
      expect(list.bubbles[0].title).toBe('Test');
    });

    it('should add a bubble with a provided title and subtitle', () => {
      list.addBubble('Test Title', 'Test Subtitle');

      expect(list.bubbles.length).toBe(1);
      expect(list.bubbles[0].title).toBe('Test Title');
      expect(list.bubbles[0].subtitle).toBe('Test Subtitle');
    });

    it('should throw an error if you try to add an image but not provide an url', () => {
      list
        .addBubble('Test');

      expect(() => list.addImage()).toThrowError('Image URL is required for addImage method');
    });

    it('should throw an error if you try to add an image, but url is in invalid format', () => {
      list
        .addBubble('Test');

      expect(() => list.addImage('http//invalid-url')).toThrowError('Image URL needs to be valid for addImage method');
    });

    it('should add an image if it is valid', () => {
      list
        .addBubble('Test')
        .addImage('http://google.com/path/to/image.png');

      expect(list.bubbles.length).toBe(1);
      expect(list.bubbles[0].image_url).toBe('http://google.com/path/to/image.png');
    });

    it('should throw an error if you add a button without the title', () => {
      list
        .addBubble('Test');

      expect(() => list.addButton()).toThrowError('Button title cannot be empty');
    });

    it('should throw an error if you add a button without the value', () => {
      list
        .addBubble('Test');

      expect(() => list.addButton('Title')).toThrowError('Button value is required');
    });

    it('should add a button with title and payload if you pass valid format', () => {
      list
        .addBubble('Test')
        .addButton('Title 1', 1);

      expect(list.bubbles[0].buttons.length).toBe(1);
      expect(list.bubbles[0].buttons[0].title).toBe('Title 1');
      expect(list.bubbles[0].buttons[0].type).toBe('postback');
      expect(list.bubbles[0].buttons[0].payload).toBe(1);
      expect(list.bubbles[0].buttons[0].url).not.toBeDefined();
    });

    it('should add a button with a share url', () => {
      list
        .addBubble('Test')
        .addShareButton();

      expect(list.bubbles[0].buttons.length).toBe(1);
      expect(list.bubbles[0].buttons[0].type).toBe('element_share');
    });

    it('should add a button with title and url if you pass valid format', () => {
      list
        .addBubble('Test')
        .addButton('Title 1', 'http://google.com');

      expect(list.bubbles[0].buttons.length).toBe(1);
      expect(list.bubbles[0].buttons[0].title).toBe('Title 1');
      expect(list.bubbles[0].buttons[0].type).toBe('web_url');
      expect(list.bubbles[0].buttons[0].url).toBe('http://google.com');
      expect(list.bubbles[0].buttons[0].payload).not.toBeDefined();
    });

    it('should override type when a type parameter is passed', () => {
      list
        .addBubble('Test')
        .addButton('b1', '+123456789', 'phone_number');

      expect(list.bubbles[0].buttons[0].type).toBe('phone_number');
    });

    it('should throw an error if you add more than 1 button', () => {
      list
        .addBubble('Test');

      expect(() => {
        list
          .addButton('Title 1', 1)
          .addButton('Title 2', 2);
      }).toThrowError('One button is already added and that\'s the maximum');
    });

    it('should throw an error if you add a default action without the url', () => {
      list
        .addBubble('Test');

      expect(() => list.addDefaultAction()).toThrowError('Bubble default action URL is required');
    });

    it('should throw an error if you add a default action with an invalid url', () => {
      list
        .addBubble('Test');

      expect(() => list.addDefaultAction('some_url')).toThrowError('Bubble default action URL must be valid URL');
    });

    it('should throw an error if you add more than one default action', () => {
      list
        .addBubble('Test')
        .addDefaultAction('http://google.com/some/action');

      expect(() => list.addDefaultAction('http://google.com/some/action')).toThrowError('Bubble already has default action');
    });

    it('should add default action', () => {
      list
        .addBubble('1', 'hello')
        .addDefaultAction('http://google.com/some/action');

      expect(list.bubbles.length).toBe(1);
      expect(list.bubbles[0].default_action.type).toBe('web_url');
      expect(list.bubbles[0].default_action.url).toBe('http://google.com/some/action');
    });

    it('should throw an error if there\'s more than 4 bubbles', () => {
      expect(() =>
        list
          .addBubble('1', 'hello')
          .addBubble('2', 'hello')
          .addBubble('3', 'hello')
          .addBubble('4', 'hello')
          .addBubble('5', 'hello')
      )
        .toThrowError('4 bubbles are maximum for List template');
    });

    it('should throw an error if you add a list button without the title', () => {
      list
        .addBubble('Test');

      expect(() => list.addListButton()).toThrowError('List button title cannot be empty');
    });

    it('should throw an error if you add a list button without the value', () => {
      list
        .addBubble('Test');

      expect(() => list.addListButton('Title')).toThrowError('List button value is required');
    });

    it('should throw an error if there\'s more than 1 list buttons', () => {
      expect(() =>
        list
          .addBubble('1', 'hello')
          .addListButton('Title 1', 1)
          .addListButton('Title 2', 2)
      )
        .toThrowError('One List button is already added and that\'s the maximum');
    });

    it('should add list button', () => {
      list
          .addBubble('1', 'hello')
          .addListButton('Title 1', 1);

      let buttons = list.template.attachment.payload.buttons;

      expect(buttons.length).toBe(1);
      expect(buttons[0].title).toBe('Title 1');
      expect(buttons[0].type).toBe('postback');
      expect(buttons[0].payload).toBe(1);
      expect(buttons[0].url).not.toBeDefined();
    });

    it('should return a formated object in the end', () => {
      expect(
        list
          .addBubble('Title 1')
            .addImage('http://google.com/path/to/image.png')
          .addBubble('Title 2')
          .get()
      ).toEqual({
        attachment: {
          type: 'template',
          payload: {
            template_type: 'list',
            top_element_style: 'large',
            buttons: [],
            elements: [
              {
                title: 'Title 1',
                image_url: 'http://google.com/path/to/image.png'
              },
              {
                title: 'Title 2'
              }
            ]
          }
        }
      });
    });
  });
  describe('ChatAction', () => {
    it('should send a chat action if it is correct', () => {
      expect(new formatFbMessage.ChatAction('typing_on').get()).toEqual({
        sender_action: 'typing_on'
      });
      expect(new formatFbMessage.ChatAction('typing_off').get()).toEqual({
        sender_action: 'typing_off'
      });
      expect(new formatFbMessage.ChatAction('mark_seen').get()).toEqual({
        sender_action: 'mark_seen'
      });
    });
    it('should throw an error if chat action is not valid', () => {
      expect(() => new formatFbMessage.ChatAction('invalid_chat_action').get()).toThrowError('Valid action is required for Facebook ChatAction template. Available actions are: typing_on, typing_off and mark_seen.');
    });
  });
  describe('Pause', () => {
    it('should be a class', () => {
      const message = new formatFbMessage.Pause(200);
      expect(typeof formatFbMessage.Pause).toBe('function');
      expect(message instanceof formatFbMessage.Pause).toBeTruthy();
    });

    it('should generate an object with a defined value', () => {
      const message = new formatFbMessage.Pause(1000).get();
      expect(message).toEqual({
        claudiaPause: 1000
      });
    });

    it('should generate an object with a default value', () => {
      const message = new formatFbMessage.Pause().get();
      expect(message).toEqual({
        claudiaPause: 500
      });
    });
  });
});
