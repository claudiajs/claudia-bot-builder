'use strict';

const isUrl = require('../is-url');

class ReplyKeyboard {
  constructor() {
    this.keyboard = [];
  }

  addButton(text, requestContact, requestLocation) {
    if (!text)
      throw new Error('Text is required for reply keyboard button');

    this.keyboard.push({
      text: text,
      request_contact: !!requestContact,
      request_location: !!requestLocation
    });

    return this;
  }

  resizeKeyboard(shouldResize) {
    this.resize_keyboard = !!shouldResize;
    return this;
  }

  oneTimeKeyboard(isOneTime) {
    this.one_time_keyboard = !!isOneTime;
    return this;
  }

  selective(isSelective) {
    this.selective = !!isSelective;
    return this;
  }

  get() {
    return {
      method: 'sendMessage',
      body: this
    };
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

class InlineKeyboard {
  constructor() {
    this.reply = {};
    this.reply.inline_keyboard = [];
  }

  addButton(text, url, callbackData, switchInlineQuery) {
    if (!text)
      throw new Error('Text is required for inline keyboard button');

    let button = {
      text: text
    };

    if (url && !isUrl(url)) {
      throw new Error('Inline keyboard button url param, if provided, needs to be a valid URL');
    } else if (url) {
      button.url = url;
    }

    if (callbackData && typeof callbackData !== 'string') {
      throw new Error('Inline keyboard button callbackData param, if provided, needs to be string');
    } else if (callbackData) {
      button.callback_data = callbackData;
    }

    if (switchInlineQuery && typeof switchInlineQuery !== 'string') {
      throw new Error('Inline keyboard button switchInlineQuery param, if provided, needs to be string');
    } else if (callbackData) {
      button.switch_inline_query = switchInlineQuery;
    }

    this.reply.inline_keyboard.push(button);

    return this;
  }

  get() {
    if (!this.reply.inline_keyboard.length)
      throw new Error('At least one button is required for an inline keyboard');

    return {
      method: 'sendMessage',
      body: this.reply
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
  ReplyKeyboard: ReplyKeyboard,
  ReplyKeyboardHide: ReplyKeyboardHide,
  InlineKeyboard: InlineKeyboard,
  ForceReply: ForceReply
};
