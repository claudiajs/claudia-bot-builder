'use strict';

module.exports = {
  image: image,
  generic: generic,
  button: button,
  receipt: receipt
};

function isUrl(url) {
  const patterns = {
    protocol: '^(http(s)?(:\/\/))?(www\.)?',
    domain: '[a-zA-Z0-9-_\.]+',
    tld: '(\.[a-zA-Z0-9]{2,})',
    params: '([-a-zA-Z0-9:%_\+.~#?&//=]*)'
  };
  var pattern = new RegExp(patterns.protocol + patterns.domain + patterns.tld + patterns.params, 'gi');
  return pattern.exec(url);
}

function image() {}

function generic() {
  this.bubbles = [];
}

function getLastBubble(bubbles) {
  if (!bubbles || !bubbles.length)
    throw new Error('Add at least one bubble first!');

  return bubbles.length[bubbles.length - 1];
}

generic.prototype.addBubble = function(title, subtitle) {
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
};

generic.prototype.addUrl = function(url) {
  if (!url)
    throw new Error('URL is required for addUrl method');

  if (!isUrl(url))
    throw new Error('URL needs to be valid for addUrl method');

  getLastBubble(this.bubbles)['item_url'] = url;

  return this;
};

generic.prototype.addImage = function(url) {
  if (!url)
    throw new Error('Image URL is required for addImage method');

  if (!isUrl(url))
    throw new Error('Image URL needs to be valid for addImage method');

  getLastBubble(this.bubbles)['image_url'] = url;

  return this;
};

generic.prototype.addButton = function(title, value) {
  const bubble = getLastBubble(this.bubbles);

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
};

generic.prototype.get = function() {
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
};

function button() {}

function receipt() {}
