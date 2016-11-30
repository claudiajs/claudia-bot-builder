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

module.exports = {
  Photo: Photo
};
