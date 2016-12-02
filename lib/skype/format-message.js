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

class Photo extends SkypeMessage {
  constructor(base64Photo) {
    super();
    if (!base64Photo || typeof base64Photo !== 'string')
      throw new Error('Photo is required for the Skype Photo template');

    this.template = {
      type: 'message/image',
      attachments: [{
        contentUrl: base64Photo
      }]
    };
  }
}

class Carousel extends SkypeMessage {
  constructor(summary, text) {
    super();

    this.template = {
      type: 'message/card.carousel',
      attachmentLayout: 'carousel',
      summary: summary || '',
      text: text || '',
      attachments: []
    };

    this.currentAttachment = -1;

    return this;
  }

  addHero(title, subtitle, text, images) {
    if(images && !Array.isArray(images)) {
      throw new Error('Images should be sent as array for the Skype Hero template');
    }

    this.template.attachments.push({
      contentType: 'application/vnd.microsoft.card.hero',
      content: {
        title: title || '',
        subtitle: subtitle || '',
        text: text || '',
        images: images ? images.map(image => ({url: image, alt: ''})) : [],
        buttons: []
      }
    });

    this.currentAttachment++;

    return this;
  }

  addThumbnail(title, subtitle, text, images) {
    if(images && !Array.isArray(images)) {
      throw new Error('Images should be sent as array for the Skype Thumbnail template');
    }

    this.template.attachments.push({
      contentType: 'application/vnd.microsoft.card.thumbnail',
      content: {
        title: title || '',
        subtitle: subtitle || '',
        text: text || '',
        images: images ? images.map(image => ({url: image, alt: ''})) : [],
        buttons: []
      }
    });

    this.currentAttachment++;

    return this;
  }

  addReceipt(title, subtitle, text, total, tax, vat) {
    this.template.attachments.push({
      contentType: 'application/vnd.microsoft.card.receipt',
      content: {
        title: title || '',
        subtitle: subtitle || '',
        text: text || '',
        total: total || '',
        tax: tax || '',
        vat: vat || '',
        items: [],
        facts: [],
        buttons: []
      }
    });

    this.currentAttachment++;

    return this;
  }

  addFact(key, value) {
    this.template.attachments[this.currentAttachment].content.facts.push({
      key: key || '',
      value: value || ''
    });

    return this;
  }

  addItem(title, subtitle, text, price, quantity, image) {
    this.template.attachments[this.currentAttachment].content.items.push({
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

  addButton(title, value, type) {
    if (!title || typeof title !== 'string')
      throw new Error('Title needs to be a string for Skype addButton method');

    if (!value || typeof value !== 'string')
      throw new Error('Value needs to be a string for Skype addButton method');

    if (!type || typeof type !== 'string')
      throw new Error('Type needs to be a string for Skype addButton method');

    this.template.attachments[this.currentAttachment].content.buttons.push({
      type: type,
      title: title,
      value: value
    });

    return this;
  }
}

//TODO: investigate how to send Hero, Thumbnail and Receipt without carousel

module.exports = {
  Photo: Photo,
  Carousel: Carousel
};
