'use strict';

class ViberMessage {
  constructor() {
    this.template = {};
  }

  addReplyKeyboard(isDefaultHeight, backgroundColor) {

    const replyKeyboard = {
      Type: 'keyboard',
      DefaultHeight: isDefaultHeight || true,
      BgColor: backgroundColor || '#FFFFFF',
      Buttons: []
    };

    this.template.keyboard = replyKeyboard;

    return this;
  }

  /**
   *
   * @param buttonObj - Object containing all of the possible attributes:
   * {
   *    text: String, HTML value of text with attributes
   *    actionType: String,
   *    actionBody: String,
   *    columnSize: Number, number value 1-6
   *    rowSize: Number, number value 1-2
   *    backgroundColor: String, hexadecimal value with Hash
   *    image: String - URL
   * }
   * @returns {ViberMessage}
   */
  addKeyboardButton(buttonObj) {

    if (!this.template.keyboard || !Array.isArray(this.template.keyboard.Buttons))
      throw new Error('KeyboardButton can only be added if you previously added the ReplyKeyboard');

    if (!buttonObj.text || typeof buttonObj.text !== 'string')
      throw new Error('Text is required for the Viber KeyboardButton template');

    if (!buttonObj.actionType || typeof buttonObj.actionType !== 'string' || (buttonObj.actionType !== 'reply' && buttonObj.actionType !== 'open-url') || typeof buttonObj.actionBody !== 'string')
      throw new Error('actionType and actionBody are required for the Viber KeyboardButton template');

    var button = {
      Text: buttonObj.text,
      ActionType: buttonObj.actionType,
      ActionBody: buttonObj.actionBody
    };

    if (buttonObj.columnSize && typeof buttonObj.columnSize == 'number' && buttonObj.columnSize > 0 && buttonObj.columnSize <= 6)
      button.Columns = buttonObj.columnSize;

    if (buttonObj.rowSize && typeof buttonObj.rowSize === 'number' && buttonObj.rowSize > 0 && buttonObj.rowSize <= 2)
      button.Rows = buttonObj.rowSize;

    if (buttonObj.backgroundColor && typeof buttonObj.backgroundColor === 'string' && buttonObj.backgroundColor.length == 7)
      button.BgColor = buttonObj.backgroundColor;

    if (buttonObj.image && typeof buttonObj.image === 'string' && buttonObj.image.length > 7)
      button.Image = buttonObj.image;

    this.template.keyboard.Buttons.unshift(button);

    return this;
  }

  get() {
    return this.template;
  }
}

class Text extends ViberMessage {
  constructor(text) {
    super();
    if (!text || typeof text !== 'string')
      throw new Error('Text is required for the Viber Text template');

    this.template = {
      type: 'text',
      text: text
    };
  }
}

class Photo extends ViberMessage {
  constructor(media, text) {
    super();
    if (!media || typeof media !== 'string')
      throw new Error('Photo needs to be an URL for the Viber Photo method');
    if (!text || typeof text !== 'string')
      throw new Error('Text needs to be an URL for the Viber Photo method');

    this.template = {
      type: 'picture',
      media: media,
      text: text
    };
  }
}

class Video extends ViberMessage {
  constructor(media, size, duration) {
    super();
    if (!media || typeof media !== 'string')
      throw new Error('Media needs to be an URL for Viber Video method');

    if (!size || typeof size !== 'number')
      throw new Error('Size needs to be a Number representing size in bytes for Viber Video method');

    this.template = {
      type: 'video',
      media: media,
      size: size
    };

    if (duration && typeof duration === 'number')
      this.template.duration = duration;
  }
}

class File extends ViberMessage {
  constructor(media, size, fileName) {
    super();
    if (!media || typeof media !== 'string')
      throw new Error('Media needs to be an URL for the Viber File method');

    if (!size || typeof size !== 'number')
      throw new Error('Size needs to be a Number representing size in bytes for the Viber File method');

    if (!fileName || typeof fileName !== 'string')
      throw new Error('File name needs to be a String representing the name of the file for the Viber File method');

    this.template = {
      type: 'file',
      media: media,
      size: size,
      file_name: fileName
    };
  }
}

class Contact extends ViberMessage {
  constructor(name, phone_number) {
    super();
    if (!name || !phone_number || typeof name !== 'string' || typeof phone_number !== 'string')
      throw new Error('Contact name and phone number are required for the Viber Contact template');

    this.template = {
      type: 'contact',
      contact: {
        name: name,
        phone_number: phone_number
      }
    };
  }
}


class Location extends ViberMessage {
  constructor(latitude, longitude) {
    super();
    if (!latitude || !longitude || typeof latitude !== 'number' || typeof longitude !== 'number')
      throw new Error('Latitude and longitude are required for the Viber Location template');

    this.template = {
      type: 'location',
      location: {
        lat: latitude,
        lon: longitude
      }
    };
  }
}

class Url extends ViberMessage {
  constructor(media) {
    super();
    if (!media || typeof media !== 'string')
      throw new Error('Media needs to be an URL for the Viber URL method');

    if (media.length > 2000)
      throw new Error('Media URL can not be longer than 2000 characters for the Viber URL method');

    this.template = {
      type: 'url',
      media: media
    };
  }
}

module.exports = {
  Text: Text,
  Photo: Photo,
  Video: Video,
  File: File,
  Contact: Contact,
  Location: Location,
  Url: Url
};
