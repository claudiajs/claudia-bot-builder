'use strict';

class SkypeMessage {
  constructor() {
    this.template = {};
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
      attachments: [
        {
          contentUrl: base64Photo
        }
      ]
    };
  }
}

class Carousel extends SkypeMessage {
  constructor(summary, text) {
    super();

    this.template = {
      type: "message/card.carousel",
      summary: summary,
      text: text,
      attachments: []
    };

    this.currentAttachment = -1;
  }

  addHero(title, subtitle, text, image) {
    this.template.attachments.push({
      contentType: "application/vnd.microsoft.card.hero",
      content: {
        title: title,
        subtitle: subtitle,
        text: text,
        images: [
          {
            image: image,
            alt: 'alt'
          }
        ],
        buttons: []
      }
    });

    this.currentAttachment++;

    return this;
  }

  addThumbnail(title, subtitle, text, image) {
    this.template.attachments.push({
      contentType: "application/vnd.microsoft.card.thumbnail",
      content: {
        title: title,
        subtitle: subtitle,
        text: text,
        images: [
          {
            image: image,
            alt: 'alt'
          }
        ],
        buttons: []
      }
    });

    this.currentAttachment++;

    return this;
  }

  addButton(value, caption) {
    this.template.attachments[this.currentAttachment].content.buttons.push({
      type: "imBack",
      title: value,
      value: caption
    });

    return this;
  }
}

module.exports = {
  Photo: Photo,
  Carousel: Carousel
};
