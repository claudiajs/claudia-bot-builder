'use strict';

class SkypeMessage {
  constructor() {
    this.template = {};
  }

  addHero(title, subtitle, text, images) {
    this.template.attachments.push({
      contentType: 'application/vnd.microsoft.card.hero',
      content: {
        title: title,
        subtitle: subtitle,
        text: text,
        images: images.map(image => ({url: image, alt: ''})),
        buttons: []
      }
    });

    this.currentAttachment++;

    return this;
  }

  addThumbnail(title, subtitle, text, images) {
    this.template.attachments.push({
      contentType: 'application/vnd.microsoft.card.thumbnail',
      content: {
        title: title,
        subtitle: subtitle,
        text: text,
        images: images.map(image => ({url: image, alt: ''})),
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
        title: title,
        subtitle: subtitle,
        text: text,
        total: total,
        tax: tax,
        vat: vat,
        items: [],
        facts: [],
        buttons: []
      }
    });

    this.currentAttachment++;

    return this;
  }

  addFact(key, value) {
    this.template.attachments[this.currentAttachment].facts.push({
      key: key,
      value: value
    });
  }

  addItem(title, subtitle, text, price, quantity, image) {
    this.template.attachments[this.currentAttachment].items.push({
      title: title,
      subtitle: subtitle,
      text: text,
      price: price,
      quantity: quantity,
      image: {
        url: image
      }
    });

    return this;
  }

  addButton(value, caption) {
    this.template.attachments[this.currentAttachment].content.buttons.push({
      type: 'imBack',
      title: value,
      value: caption
    });

    return this;
  }

  get() {
    return this.template;
  }
}

class Photo extends SkypeMessage {
  constructor(base64Photo) {
    super();
    if (!base64Photo || typeof base64Photo !== 'string')
      throw new Error('Photo is required for the Skype Text template');

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
      summary: summary,
      text: text,
      attachments: []
    };

    this.currentAttachment = -1;

    return this;
  }
}

//TODO: investigate how to send Hero, Thumbnail and Receipt without carousel

module.exports = {
  Photo: Photo,
  Carousel: Carousel
};
