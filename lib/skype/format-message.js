'use strict';

class SkypeMessage {
  constructor() {
    this.template = {};
    this.template.attachments = [];
  }

  get() {
    return this.template;
  }
}

class Text extends SkypeMessage {
  constructor(text, format) {
    super();
    if (!text || typeof text !== 'string')
      throw new Error('Text is required for Skype Text template');

    this.template = {
      type: 'message',
      text: text,
      textFormat: format || 'plain'
    };
  }
}

class Photo extends SkypeMessage {
  constructor(base64Photo) {
    super();
    if (!base64Photo || typeof base64Photo !== 'string')
      throw new Error('Photo is required for the Skype Photo template');

    this.template = {
      type: 'message',
      attachments: [{
        contentType: 'image/png',
        contentUrl: base64Photo
      }]
    };
  }
}

class Carousel extends SkypeMessage {
  constructor(summary, text) {
    super();

    this.template = {
      type: 'message',
      attachmentLayout: 'carousel',
      summary: summary || '',
      text: text || '',
      attachments: []
    };

    return this;
  }

  getCurrentAttachment() {
    let current = this.template.attachments.length - 1;

    if (current < 0) {
      throw new Error('You need to add attachment to Carousel');
    }

    return current;
  }

  addHero(images) {
    if(images && !Array.isArray(images)) {
      throw new Error('Images should be sent as array for the Skype Hero template');
    }

    this.template.attachments.push({
      contentType: 'application/vnd.microsoft.card.hero',
      content: {
        title: '',
        subtitle: '',
        text: '',
        images: images ? images.map(image => ({url: image, alt: ''})) : [],
        buttons: []
      }
    });

    return this;
  }

  addThumbnail(images) {
    if(images && !Array.isArray(images)) {
      throw new Error('Images should be sent as array for the Skype Thumbnail template');
    }

    this.template.attachments.push({
      contentType: 'application/vnd.microsoft.card.thumbnail',
      content: {
        title: '',
        subtitle: '',
        text: '',
        images: images ? images.map(image => ({url: image, alt: ''})) : [],
        buttons: []
      }
    });

    return this;
  }

  addReceipt(total, tax, vat) {
    this.template.attachments.push({
      contentType: 'application/vnd.microsoft.card.receipt',
      content: {
        title: '',
        subtitle: '',
        text: '',
        total: total || '',
        tax: tax || '',
        vat: vat || '',
        items: [],
        facts: [],
        buttons: []
      }
    });

    return this;
  }

  addFact(key, value) {
    let currentAttachment = this.getCurrentAttachment();

    this.template.attachments[currentAttachment].content.facts.push({
      key: key || '',
      value: value || ''
    });

    return this;
  }

  addItem(title, subtitle, text, price, quantity, image) {
    let currentAttachment = this.getCurrentAttachment();

    this.template.attachments[currentAttachment].content.items.push({
      title: title || '',
      subtitle: subtitle || '',
      text: text || '',
      price: price || '',
      quantity: quantity || '',
      image: {
        url: image || ''
      }
    });

    return this;
  }

  addTitle(title) {
    let currentAttachment = this.getCurrentAttachment();

    if (!title || typeof title !== 'string')
      throw new Error('Title needs to be a string for Skype addTitle method');

    this.template.attachments[currentAttachment].content.title = title;

    return this;
  }

  addSubtitle(subtitle) {
    let currentAttachment = this.getCurrentAttachment();

    if (!subtitle || typeof subtitle !== 'string')
      throw new Error('Subtitle needs to be a string for Skype addSubtitle method');

    this.template.attachments[currentAttachment].content.subtitle = subtitle;

    return this;
  }

  addText(text) {
    let currentAttachment = this.getCurrentAttachment();

    if (!text || typeof text !== 'string')
      throw new Error('Text needs to be a string for Skype addText method');

    this.template.attachments[currentAttachment].content.text = text;

    return this;
  }

  addButton(title, value, type) {
    let currentAttachment = this.getCurrentAttachment();

    if (!title || typeof title !== 'string')
      throw new Error('Title needs to be a string for Skype addButton method');

    if (!value || typeof value !== 'string')
      throw new Error('Value needs to be a string for Skype addButton method');

    if (!type || typeof type !== 'string')
      throw new Error('Type needs to be a string for Skype addButton method');

    let validTypes = ['openUrl', 'imBack', 'postBack', 'playAudio', 'playVideo', 'showImage', 'downloadFile', 'signin'];
    if (validTypes.indexOf(type) == -1)
      throw new Error('Type needs to be a valid type string for Skype addButton method');

    this.template.attachments[currentAttachment].content.buttons.push({
      type: type,
      title: title,
      value: value
    });

    return this;
  }
}

class Typing extends SkypeMessage {
  constructor() {
    super();
    this.template = {
      type: 'typing'
    };

    return this.template;
  }
}

//TODO: investigate how to send Hero, Thumbnail and Receipt without carousel

module.exports = {
  Text: Text,
  Photo: Photo,
  Carousel: Carousel,
  Typing: Typing
};
