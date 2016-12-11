'use strict';

class TelegramMessage {
  constructor() {
    this.template = {};
  }

  disableNotification() {
    this.template.disable_notification = true;
  }

  addReplyKeyboard(keyboardArray, resizeKeyboard, oneTimeKeyboard) {
    if (!Array.isArray(keyboardArray))
      throw new Error('KeyboardArray needs to be valid array of arrays for addReplyKeyboard method');

    const replyKeyboard = {
      keyboard: keyboardArray
    };

    if (resizeKeyboard)
      replyKeyboard.resize_keyboard = true;

    if (oneTimeKeyboard)
      replyKeyboard.one_time_keyboard = true;

    this.template.reply_markup = JSON.stringify(replyKeyboard);

    return this;
  }

  addInlineKeyboard(keyboardArray) {
    if (!Array.isArray(keyboardArray))
      throw new Error('KeyboardArray needs to be valid array of arrays for addInlineKeyboard method');

    const inlineKeyboard = {
      inline_keyboard: keyboardArray
    };

    this.template.reply_markup = JSON.stringify(inlineKeyboard);

    return this;
  }

  replyKeyboardHide(selective) {
    const replyKeyboardHide = {
      hide_keyboard: true,
      selective: !!selective
    };

    this.template.reply_markup = JSON.stringify(replyKeyboardHide);

    return this;
  }

  forceReply(selective) {
    const forceReply = {
      force_reply: true,
      selective: !!selective
    };

    this.template.reply_markup = JSON.stringify(forceReply);

    return this;
  }

  get() {
    return this.template;
  }
}

class Text extends TelegramMessage {
  constructor(text) {
    super();
    if (!text || typeof text !== 'string')
      throw new Error('Text is required for Telegram Text template');

    this.template = {
      text: text,
      parse_mode: 'Markdown'
    };
  }

  disableMarkdown() {
    delete this.template.parse_mode;
    return this;
  }
}

class Photo extends TelegramMessage {
  constructor(photo, caption) {
    super();
    if (!photo || typeof photo !== 'string')
      throw new Error('Photo needs to be an ID or URL for Telegram Photo method');

    this.template = {
      photo: photo
    };

    if (caption && typeof caption === 'string')
      this.template.caption = caption;
  }

  get() {
    return {
      method: 'sendPhoto',
      body: this.template
    };
  }
}

class Audio extends TelegramMessage {
  constructor(audio, caption, duration) {
    super();
    if (!audio || typeof audio !== 'string')
      throw new Error('Audio needs to be an ID or URL for Telegram Audio method');

    this.template = {
      audio: audio
    };

    if (caption && typeof caption === 'string')
      this.template.caption = caption;

    if (duration && typeof duration === 'number')
      this.template.duration = duration;
  }

  addTitle(title) {
    if (!title || typeof title != 'string')
      throw new Error('Title is required for Telegram addTitle method');

    this.template.title = title;

    return this;
  }

  addPerformer(performer) {
    if (!performer)
      throw new Error('Performer is required for Telegram addPerformer method');

    this.template.performer = performer;

    return this;
  }

  get() {
    return {
      method: 'sendAudio',
      body: this.template
    };
  }
}

class Location extends TelegramMessage {
  constructor(latitude, longitude) {
    super();
    if (!latitude || !longitude || typeof latitude !== 'number' || typeof longitude !== 'number')
      throw new Error('Latitude and longitude are required for Telegram Location template');

    this.template = {
      latitude: latitude,
      longitude: longitude
    };
  }

  get() {
    return {
      method: 'sendLocation',
      body: this.template
    };
  }
}

class Venue extends TelegramMessage {
  constructor(latitude, longitude, title, address) {
    super();
    if (!latitude || !longitude || typeof latitude !== 'number' || typeof longitude !== 'number')
      throw new Error('Latitude and longitude are required for Telegram Venue template');

    if (!title || typeof title !== 'string')
      throw new Error('Title is required for Telegram Venue template');

    if (!address || typeof address !== 'string')
      throw new Error('Address is required for Telegram Venue template');

    this.template = {
      latitude: latitude,
      longitude: longitude,
      title: title,
      address: address
    };
  }

  addFoursqare(foursquareId) {
    if (!foursquareId)
      throw new Error('Foursquare ID is required for Telegram Venue template addFoursqare method');

    this.template.foursquare_id = foursquareId;

    return this;
  }

  get() {
    return {
      method: 'sendVenue',
      body: this.template
    };
  }
}

class ChatAction extends TelegramMessage {
  constructor(action) {
    super();
    const AVAILABLE_TYPES = ['typing', 'upload_photo', 'record_video', 'upload_video', 'record_audio', 'upload_audio', 'upload_document', 'find_location'];

    if (AVAILABLE_TYPES.indexOf(action) < 0)
      throw new Error('Valid action is required for Telegram ChatAction template. Check https://core.telegram.org/bots/api#sendchataction for all available actions.');

    this.template = {
      action: action
    };
  }

  get() {
    return {
      method: 'sendChatAction',
      body: this.template
    };
  }
}

class Pause {
  constructor(miliseconds) {
    this.template = {
      claudiaPause: miliseconds || 500
    };
  }

  get() {
    return this.template;
  }
}

class File extends TelegramMessage {
  constructor(document, caption) {
    super();
    if (!document || typeof document !== 'string')
      throw new Error('Document needs to be an URL for the Telegram File method');

    this.template = {
      document: document
    };

    // caption is optional
    if (caption && typeof caption === 'string')
      this.template.caption = caption;
  }

  get() {
    return {
      method: 'sendDocument',
      body: this.template
    };
  }
}

class Sticker extends TelegramMessage {
  constructor(sticker) {
    super();
    if (!sticker || typeof sticker !== 'string')
      throw new Error('Sticker needs to be an URL or sticker ID for the Telegram Sticker method');

    this.template = {
      sticker: sticker
    };
  }

  get() {
    return {
      method: 'sendSticker',
      body: this.template
    };
  }
}

class Contact extends TelegramMessage {
  constructor(phone, firstName, lastName) {
    super();
    if (!phone || typeof phone !== 'string')
      throw new Error('Phone number needs to be a string for Telegram Contact method');

    if (!firstName || typeof firstName !== 'string')
      throw new Error('First name needs to be a string for Telegram Contact method');

    this.template = {
      phone_number: phone,
      first_name: firstName
    };

    // lastName is optional
    if (lastName && typeof lastName === 'string')
      this.template.last_name = lastName;
  }

  get() {
    return {
      method: 'sendContact',
      body: this.template
    };
  }
}

module.exports = {
  Text: Text,
  Photo: Photo,
  Audio: Audio,
  Location: Location,
  Venue: Venue,
  ChatAction: ChatAction,
  Pause: Pause,
  File: File,
  Sticker: Sticker,
  Contact: Contact
};
