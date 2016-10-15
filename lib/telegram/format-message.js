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

    let replyKeyboard = {};
    replyKeyboard.keyboard = keyboardArray;

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

    let inlineKeyboard = {
      inline_keyboard: keyboardArray
    };

    this.template.reply_markup = JSON.stringify(inlineKeyboard);

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
      throw new Error('Text is required for Text template');

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
      throw new Error('Photo needs to be an ID or URL for Photo method');

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
      throw new Error('Photo needs to be an ID or URL for Photo method');

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
      throw new Error('Title is required for addTitle method');

    this.template.title = title;
  }

  addPerformer(performer) {
    if (!performer)
      throw new Error('Performer is required for addPerformer method');

    this.template.performer = performer;
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
      throw new Error('latitude and longitude are required for Location template');

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
      throw new Error('latitude and longitude are required for Location template');

    this.template = {
      latitude: latitude,
      longitude: longitude,
      title: title,
      address: address
    };
  }

  addFoursqare(foursquareId) {
    if (!foursquareId)
      throw new Error('Foursquare ID is required for addFoursqare method');

    this.template.foursquare_id = foursquareId;
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
      throw new Error('Valid action is required for ChatAction method. Check https://core.telegram.org/bots/api#sendchataction for all available actions.');

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
      claudiaPause: miliseconds
    };
  }

  get() {
    return this.template;
  }
}

class ReplyKeyboardHide {
  constructor(selective) {
    this.hide_keyboard = true;
    this.selective = !!selective;
  }

  get() {
    return {
      method: 'sendMessage',
      body: this
    };
  }
}

class ForceReply {
  constructor(selective) {
    this.reply = {};
    this.reply.force_reply = true;
    this.reply.selective = !!selective;
  }

  get() {
    return {
      method: 'sendMessage',
      body: this.reply
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
  ReplyKeyboardHide: ReplyKeyboardHide,
  ForceReply: ForceReply
};
