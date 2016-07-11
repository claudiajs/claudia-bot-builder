/*global describe, it, expect, beforeEach, require */
'use strict';

const formatFbMessage = require('../../lib/facebook/format-message');

describe('Facebook format message', () => {
  it('should export an object', () => {
    expect(typeof formatFbMessage).toBe('object');
  });

  describe('Text', () => {
    it('should be a class', () => {
      const message = new formatFbMessage.text('text');
      expect(typeof formatFbMessage.text).toBe('function');
      expect(message instanceof formatFbMessage.text).toBeTruthy();
    });

    it('should throw an error if text is not provided', () => {
      expect(() => new formatFbMessage.text()).toThrowError('Text is required for text template');
    });

    it('should add a text', () => {
      const message = new formatFbMessage.text('Some text');
      expect(message.text).toBe('Some text');
    });

    it('should return a simple text object', () => {
      const message = new formatFbMessage.text('Some text');
      expect(message.get()).toEqual({
        text: 'Some text'
      });
    });

    it('should throw an error if addQuickReply arguments are not provided', () => {
      const message = new formatFbMessage.text('Some text');
      expect(() => message.addQuickReply()).toThrowError('Both text and payload are required for quick reply');
    });

    it('should throw an error if addQuickReply payload is too long', () => {
      const message = new formatFbMessage.text('Some text');
      let payload = new Array(102).join('0123456789');
      expect(() => message.addQuickReply('title', payload)).toThrowError('Payload can not be more than 1000 characters long');
    });

    it('should add a quick reply', () => {
      const message = new formatFbMessage.text('Some text')
        .addQuickReply('title', 'PAYLOAD');
      expect(message.quickReplies.length).toBe(1);
      expect(message.quickReplies[0].title).toBe('title');
      expect(message.quickReplies[0].payload).toBe('PAYLOAD');
    });

    it('should add 10 quick replies', () => {
      const message = new formatFbMessage.text('Some text')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD');
      expect(message.quickReplies.length).toBe(10);
    });

    it('should throw an error if there\'s more than 10 quick replies', () => {
      const message = new formatFbMessage.text('Some text')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD')
        .addQuickReply('title', 'PAYLOAD');
      expect(() => message.addQuickReply('title', 'PAYLOAD')).toThrowError('There can not be more than 10 quick replies');
    });

    it('should trim the title if it is too long', () => {
      let title = new Array(4).join('0123456789');
      const message = new formatFbMessage.text('Some text')
        .addQuickReply(title, 'PAYLOAD');
      expect(message.quickReplies[0].title).toBe('01234567890123456789');
    });

    it('should return a json with text and quick replies', () => {
      const message = new formatFbMessage.text('Some text')
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

    it('should throw an error if you add a button without the title', () => {
      generic
        .addBubble('Test');

      expect(() => generic.addButton()).toThrowError('Button title cannot be empty');
    });

    it('should throw an error if you add a button without the value', () => {
      generic
        .addBubble('Test');

      expect(() => generic.addButton('Title')).toThrowError('Bubble value is required');
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
      let button = new formatFbMessage.button('Test');

      expect(typeof formatFbMessage.button).toBe('function');
      expect(button instanceof formatFbMessage.button).toBeTruthy();
    });

    it('should throw an error if button text is not provided', () => {
      expect(() => new formatFbMessage.button()).toThrowError('Button template text cannot be empty');
    });

    it('should throw an error if button text is longer than 80 characters', () => {
      expect(() => new formatFbMessage.button('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua')).toThrowError('Button template text cannot be longer than 80 characters');
    });

    it('should create a button template with the text when valid text is provided', () => {
      let button = new formatFbMessage.button('Test');

      expect(button.text).toBe('Test');
    });

    it('should throw an error if you add a button without the title', () => {
      let button = new formatFbMessage.button('Test');

      expect(() => button.addButton()).toThrowError('Button title cannot be empty');
    });

    it('should throw an error if you add a button without the value', () => {
      let button = new formatFbMessage.button('Test');

      expect(() => button.addButton('Title')).toThrowError('Bubble value is required');
    });

    it('should add a button with title and payload if you pass valid format', () => {
      let button = new formatFbMessage.button('Test');
      button.addButton('Title 1', 1);

      expect(button.buttons.length).toBe(1);
      expect(button.buttons[0].title).toBe('Title 1');
      expect(button.buttons[0].type).toBe('postback');
      expect(button.buttons[0].payload).toBe(1);
      expect(button.buttons[0].url).not.toBeDefined();
    });

    it('should add a button with title and url if you pass valid format', () => {
      let button = new formatFbMessage.button('Test');
      button.addButton('Title 1', 'http://google.com');

      expect(button.buttons.length).toBe(1);
      expect(button.buttons[0].title).toBe('Title 1');
      expect(button.buttons[0].type).toBe('web_url');
      expect(button.buttons[0].url).toBe('http://google.com');
      expect(button.buttons[0].payload).not.toBeDefined();
    });

    it('should add 3 buttons with valid titles and formats', () => {
      let button = new formatFbMessage.button('Test');
      button
        .addButton('b1', 'v1')
        .addButton('b2', 'v2')
        .addButton('b3', 'v3');

      expect(button.buttons.length).toBe(3);
      expect(button.buttons[0].title).toBe('b1');
      expect(button.buttons[0].payload).toBe('v1');
      expect(button.buttons[1].title).toBe('b2');
      expect(button.buttons[1].payload).toBe('v2');
      expect(button.buttons[2].title).toBe('b3');
      expect(button.buttons[2].payload).toBe('v3');
    });

    it('should return a formated object in the end', () => {
      expect(
        new formatFbMessage.button('Test')
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
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');

      expect(typeof formatFbMessage.receipt).toBe('function');
      expect(receipt instanceof formatFbMessage.receipt).toBeTruthy();
    });

    it('should throw an error if recipient\'s name is not defined', () => {
      expect(() => new formatFbMessage.receipt()).toThrowError('Recipient\'s name cannot be empty');
    });

    it('should throw an error if order number is not defined', () => {
      expect(() => new formatFbMessage.receipt('John Doe')).toThrowError('Order number cannot be empty');
    });

    it('should throw an error if currency is not defined', () => {
      expect(() => new formatFbMessage.receipt('John Doe', 'O123')).toThrowError('Currency cannot be empty');
    });

    it('should throw an error if payment method is not defined', () => {
      expect(() => new formatFbMessage.receipt('John Doe', 'O123', '$')).toThrowError('Payment method cannot be empty');
    });

    it('should create a receipt template object if recipient, order number, currency and payment method are passed', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');

      expect(typeof receipt).toBe('object');
      expect(receipt.output.recipient_name).toBe('John Doe');
      expect(receipt.output.order_number).toBe('O123');
      expect(receipt.output.currency).toBe('$');
      expect(receipt.output.payment_method).toBe('Paypal');
    });

    it('should throw an error if user tries to add timestamp but don\'t provide it', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');

      expect(() => receipt.addTimestamp()).toThrowError('Timestamp is required for addTimestamp method');
    });

    it('should throw an error if timestamp is not valid date object', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');

      expect(() => receipt.addTimestamp('invalid-timestamp')).toThrowError('Timestamp needs to be a valid Date object');
    });

    it('should add a timestamp if it is a valid date object', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');
      receipt.addTimestamp(new Date('2016-06-14T20:55:31.438Z'));

      expect(receipt.output.timestamp).toBe(new Date('2016-06-14T20:55:31.438Z').getTime());
    });

    it('should should throw an error if user tries to add order url but doesn\'t provide it', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');

      expect(() => receipt.addOrderUrl()).toThrowError('Url is required for addOrderUrl method');
    });

    it('should should throw an error if order url is not a valid url', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');

      expect(() => receipt.addOrderUrl('http//invalid-url')).toThrowError('Url needs to be valid for addOrderUrl method');
    });

    it('should add an order url if it is a valid url', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');
      receipt.addOrderUrl('http://google.com');

      expect(receipt.output.order_url).toBe('http://google.com');
    });

    it('should throw an error if there\'s no items in order', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');

      expect(() => receipt.get()).toThrowError('At least one element/item is required');
    });

    it('should throw an error if user tries to add an item without title', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');

      expect(() => receipt.addItem()).toThrowError('Item title is required');
    });

    it('should add an item if valid title is provided', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');
      receipt.addItem('Title');

      expect(receipt.output.elements.length).toBe(1);
      expect(receipt.output.elements[0].title).toBe('Title');
    });

    it('should throw an error if user tries to add an item\'s subtitle but doesn\'t provide it', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');
      receipt.addItem('Title');

      expect(() => receipt.addSubtitle()).toThrowError('Subtitle is required for addSubtitle method');
    });

    it('should add an item with a subtitle if valid subtitle is provided', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');
      receipt
        .addItem('Title')
        .addSubtitle('Subtitle');

      expect(receipt.output.elements.length).toBe(1);
      expect(receipt.output.elements[0].subtitle).toBe('Subtitle');
    });

    it('should throw an error if user tries to add an item\'s quantity but doesn\'t provide it', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');
      receipt.addItem('Title');

      expect(() => receipt.addQuantity()).toThrowError('Quantity is required for addQuantity method');
    });

    it('should throw an error if user tries to add an item\'s quantity which is not a number', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');
      receipt.addItem('Title');

      expect(() => receipt.addQuantity('test')).toThrowError('Quantity needs to be a number');
    });

    it('should add an item with a quantity if valid number is provided', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');
      receipt
        .addItem('Title')
        .addQuantity(42);

      expect(receipt.output.elements.length).toBe(1);
      expect(receipt.output.elements[0].quantity).toBe(42);
    });

    it('should throw an error if user tries to add an item\'s price but doesn\'t provide it', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');
      receipt.addItem('Title');

      expect(() => receipt.addPrice()).toThrowError('Price is required for addPrice method');
    });

    it('should throw an error if user tries to add an item\'s price which is not a number', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');
      receipt.addItem('Title');

      expect(() => receipt.addPrice('test')).toThrowError('Price needs to be a number');
    });

    it('should add an item with a quantity if valid price is provided', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');
      receipt
        .addItem('Title')
        .addPrice(4.2);

      expect(receipt.output.elements.length).toBe(1);
      expect(receipt.output.elements[0].price).toBe(4.2);
    });

    it('should throw an error if user tries to add an item\'s currency but doesn\'t provide it', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');
      receipt.addItem('Title');

      expect(() => receipt.addCurrency()).toThrowError('Currency is required for addCurrency method');
    });

    it('should add an item with a currency if valid currency is provided', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');
      receipt
        .addItem('Title')
        .addCurrency('$');

      expect(receipt.output.elements.length).toBe(1);
      expect(receipt.output.elements[0].currency).toBe('$');
    });

    it('should throw an error if user tries to add an item\'s image but doesn\'t provide it', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');
      receipt.addItem('Title');

      expect(() => receipt.addImage()).toThrowError('Url is required for addImage method');
    });

    it('should throw an error if user tries to add an item\'s image which is not a valid url', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');
      receipt.addItem('Title');

      expect(() => receipt.addImage('test')).toThrowError('Valid url is required for addImage method');
    });

    it('should add an item with an image if valid url is provided', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');
      receipt
        .addItem('Title')
        .addImage('http://google.com/path/to/image.png');

      expect(receipt.output.elements.length).toBe(1);
      expect(receipt.output.elements[0].image_url).toBe('http://google.com/path/to/image.png');
    });

    it('should add more than 1 item if titles are valid', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');
      receipt
        .addItem('Title 1')
        .addItem('Title 2');

      expect(receipt.output.elements.length).toBe(2);
      expect(receipt.output.elements[0].title).toBe('Title 1');
      expect(receipt.output.elements[1].title).toBe('Title 2');
    });

    it('should throw an error if user tries to add a shipping address without a street address', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');
      receipt
        .addItem('Title 1');

      expect(() => receipt.addShippingAddress()).toThrowError('Street is required for addShippingAddress');
    });

    it('should throw an error if user tries to add a shipping address without the city', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');
      receipt
        .addItem('Title 1');

      expect(() => receipt.addShippingAddress('Bulevar Nikole Tesle 42', null)).toThrowError('City is required for addShippingAddress method');
    });

    it('should throw an error if user tries to add a shipping address without a postal code', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');
      receipt
        .addItem('Title 1');

      expect(() => receipt.addShippingAddress('Bulevar Nikole Tesle 42', null, 'Belgrade')).toThrowError('Zip code is required for addShippingAddress method');
    });

    it('should throw an error if user tries to add a shipping address without the state', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');
      receipt
        .addItem('Title 1');

      expect(() => receipt.addShippingAddress('Bulevar Nikole Tesle 42', null, 'Belgrade', 11070)).toThrowError('State is required for addShippingAddress method');
    });

    it('should throw an error if user tries to add a shipping address without the country', () => {
      let receipt = new formatFbMessage.receipt('John Doe', 'O123', '$', 'Paypal');
      receipt
        .addItem('Title 1');

      expect(() => receipt.addShippingAddress('Bulevar Nikole Tesle 42', null, 'Belgrade', 11070, 'Serbia')).toThrowError('Country is required for addShippingAddress method');
    });

    it('should parse an example for FB documentation', () => {
      let receipt = new formatFbMessage.receipt('Stephane Crozatier', '12345678902', 'USD', 'Visa 2345')
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
      let image = new formatFbMessage.image('http://google.com');

      expect(typeof formatFbMessage.image).toBe('function');
      expect(image instanceof formatFbMessage.image).toBeTruthy();
    });

    it('should throw an error if you add an image without the url', () => {
      expect(() => new formatFbMessage.image()).toThrowError('Image template requires a valid URL as a first paramether');
    });

    it('should throw an error if you add an image with invalid url', () => {
      expect(() => new formatFbMessage.image('google')).toThrowError('Image template requires a valid URL as a first paramether');
    });

    it('should add an image with given URL if URL is valid', () => {
      let image = new formatFbMessage.image('http://google.com/path/to/image.png');

      expect(image.url).toBe('http://google.com/path/to/image.png');
    });

    it('should return a formated object in the end', () => {
      expect(
        new formatFbMessage.image('http://google.com/path/to/image.png').get()
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
});
