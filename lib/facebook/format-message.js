'use strict';

const isUrl = require('../is-url');

function isNumber(number) {
  return !isNaN(parseFloat(number)) && isFinite(number);
}

class image {
  constructor(url) {
    if (!url || !isUrl(url))
      throw new Error('Image template requires a valid URL as a first paramether');

    this.url = url;
  }

  get() {
    if (!this.url || !isUrl(this.url))
      throw new Error('Image template requires a valid URL as a first paramether');

    return {
      attachment: {
        type: 'image',
        payload: {
          url: this.url
        }
      }
    };
  }
}

class generic{
  constructor() {
    this.bubbles = [];
  }

  getLastBubble() {
    if (!this.bubbles || !this.bubbles.length)
      throw new Error('Add at least one bubble first!');

    return this.bubbles[this.bubbles.length - 1];
  }

  addBubble(title, subtitle) {
    if (this.bubbles.length === 10)
      throw new Error('10 bubbles are maximum for Generic template');

    if (!title)
      throw new Error('Bubble title cannot be empty');

    if (title.length > 80)
      throw new Error('Bubble title cannot be longer than 80 characters');

    if (subtitle && subtitle.length > 80)
      throw new Error('Bubble subtitle cannot be longer than 80 characters');

    let bubble = {
      title: title
    };

    if (subtitle)
      bubble['subtitle'] = subtitle;

    this.bubbles.push(bubble);

    return this;
  }

  addUrl(url) {
    if (!url)
      throw new Error('URL is required for addUrl method');

    if (!isUrl(url))
      throw new Error('URL needs to be valid for addUrl method');

    this.getLastBubble()['item_url'] = url;

    return this;
  }

  addImage(url) {
    if (!url)
      throw new Error('Image URL is required for addImage method');

    if (!isUrl(url))
      throw new Error('Image URL needs to be valid for addImage method');

    this.getLastBubble()['image_url'] = url;

    return this;
  }

  addButton(title, value) {
    const bubble = this.getLastBubble();

    bubble.buttons = bubble.buttons || [];

    if (bubble.buttons.length === 3)
      throw new Error('3 buttons are already added and that\'s the maximum');

    if (!title)
      throw new Error('Button title cannot be empty');

    if (!value)
      throw new Error('Bubble value is required');

    const button = {
      title: title
    };

    if (isUrl(value)) {
      button.type = 'web_url';
      button.url = value;
    } else {
      button.type = 'postback';
      button.payload = value;
    }

    bubble.buttons.push(button);

    return this;
  }

  get() {
    if (!this.bubbles || !this.bubbles.length)
      throw new Error('Add at least one bubble first!');

    return {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: this.bubbles
        }
      }
    };
  }
}

class button {
  constructor(text) {
    if (!text)
      throw new Error('Button template text cannot be empty');

    if (text.length > 80)
      throw new Error('Button template text cannot be longer than 80 characters');

    this.text = text;
    this.buttons = [];
  }

  addButton(title, value) {
    if (this.buttons.length === 3)
      throw new Error('3 buttons are already added and that\'s the maximum');

    if (!title)
      throw new Error('Button title cannot be empty');

    if (!value)
      throw new Error('Bubble value is required');

    const button = {
      title: title
    };

    if (isUrl(value)) {
      button.type = 'web_url';
      button.url = value;
    } else {
      button.type = 'postback';
      button.payload = value;
    }

    this.buttons.push(button);

    return this;
  }

  get() {
    if (!this.buttons.length)
      throw new Error('Add at least one button first!');

    return {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: this.text,
          buttons: this.buttons
        }
      }
    };
  }
}

class receipt{
  constructor(name, orderNumber, currency, paymentMethod) {
    if (!name)
      throw new Error('Recipient\'s name cannot be empty');

    if (!orderNumber)
      throw new Error('Order number cannot be empty');

    if (!currency)
      throw new Error('Currency cannot be empty');

    if (!paymentMethod)
      throw new Error('Payment method cannot be empty');

    this.output = {};

    this.output.recipient_name = name;
    this.output.order_number = orderNumber;
    this.output.currency = currency;
    this.output.payment_method = paymentMethod;
    this.output.elements = [];
    this.output.summary = {};
  }

  addTimestamp(timestamp) {
    if (!timestamp)
      throw new Error('Timestamp is required for addTimestamp method');

    if (!(timestamp instanceof Date))
      throw new Error('Timestamp needs to be a valid Date object');

    this.output.timestamp = timestamp.getTime();

    return this;
  }

  addOrderUrl(url) {
    if (!url)
      throw new Error('Url is required for addOrderUrl method');

    if (!isUrl(url))
      throw new Error('Url needs to be valid for addOrderUrl method');

    this.output.order_url = url;

    return this;
  }

  getLastItem() {
    if (!this.output.elements || !this.output.elements.length)
      throw new Error('Add at least one order item first!');

    return this.output.elements[this.output.elements.length - 1];
  }

  addItem(title) {
    if (!title)
      throw new Error('Item title is required');

    this.output.elements.push({
      title: title
    });

    return this;
  }

  addSubtitle(subtitle) {
    if (!subtitle)
      throw new Error('Subtitle is required for addSubtitle method');

    let item = this.getLastItem();

    item.subtitle = subtitle;

    return this;
  }

  addQuantity(quantity) {
    if (!quantity)
      throw new Error('Quantity is required for addQuantity method');

    if (!isNumber(quantity))
      throw new Error('Quantity needs to be a number');

    let item = this.getLastItem();

    item.quantity = quantity;

    return this;
  }

  addPrice(price) {
    if (!price)
      throw new Error('Price is required for addPrice method');

    if (!isNumber(price))
      throw new Error('Price needs to be a number');

    let item = this.getLastItem();

    item.price = price;

    return this;
  }

  addCurrency(currency) {
    if (!currency)
      throw new Error('Currency is required for addCurrency method');

    let item = this.getLastItem();

    item.currency = currency;

    return this;
  }

  addImage(image) {
    if (!image)
      throw new Error('Url is required for addImage method');

    if (!isUrl(image))
      throw new Error('Valid url is required for addImage method');

    let item = this.getLastItem();

    item.image_url = image;

    return this;
  }

  addShippingAddress(street1, street2, city, zip, state, country) {
    if (!street1)
      throw new Error('Street is required for addShippingAddress');

    if (!city)
      throw new Error('City is required for addShippingAddress method');

    if (!zip)
      throw new Error('Zip code is required for addShippingAddress method');

    if (!state)
      throw new Error('State is required for addShippingAddress method');

    if (!country)
      throw new Error('Country is required for addShippingAddress method');

    this.output.address = {
      street_1: street1,
      city: city,
      postal_code: zip,
      state: state,
      country: country
    };

    if (street2)
      this.output.address.street_2 = street2;

    return this;
  }

  addAdjustment(name, amount) {
    if (amount && isNumber(amount))
      throw new Error('Adjustment amount must be a number');

    let adjustment = {};

    if (name)
      adjustment.name = name;

    if (amount)
      adjustment.amount = amount;

    if (name || amount) {
      this.output.adjustments = this.output.adjustments || [];
      this.output.adjustments.push(adjustment);
    }

    return this;
  }

  addSubtotal(subtotal) {
    if (!subtotal)
      throw new Error('Subtotal is required for addSubtotal method');

    if (!isNumber(subtotal))
      throw new Error('Subtotal must be a number');

    this.output.summary.subtotal = subtotal;

    return this;
  }

  addShippingCost(shippingCost) {
    if (!shippingCost)
      throw new Error('shippingCost is required for addShippingCost method');

    if (!isNumber(shippingCost))
      throw new Error('Shipping cost must be a number');

    this.output.summary.shipping_cost = shippingCost;

    return this;
  }

  addTax(tax) {
    if (!tax)
      throw new Error('Total tax amount is required for addSubtotal method');

    if (!isNumber(tax))
      throw new Error('Total tax amount must be a number');

    this.output.summary.total_tax = tax;

    return this;
  }

  addTotal(total) {
    if (!total)
      throw new Error('Total amount is required for addSubtotal method');

    if (!isNumber(total))
      throw new Error('Total amount must be a number');

    this.output.summary.total_amount = total;

    return this;
  }

  get() {
    if (!this.output.elements.length)
      throw new Error('At least one element/item is required');

    if (!this.output.summary.total_amount)
      throw new Error('Total amount is required');

    let payload = this.output;
    payload.template_type = 'receipt';

    return {
      attachment: {
        type: 'template',
        payload: payload
      }
    };
  }
}

module.exports = {
  image: image,
  generic: generic,
  button: button,
  receipt: receipt
};
