'use strict';

class slackTemplate {
  constructor(text) {
    this.template = {};
    this.template.attachments = [];

    if (text)
      this.template.text = text;
  }

  replaceOriginal(value) {
    this.template.replace_original = !!value;
    return this;
  }

  getLatestAttachment() {
    return this.template.attachments[this.template.attachments.length - 1];
  }

  addAttachment(callbackId, type, fallback) {
    const attachment = {
      actions: []
    };

    if (callbackId)
      attachment.callback_id = callbackId;

    if (type)
      attachment.attachment_type = type;

    if (type)
      attachment.fallback = fallback;

    this.template.attachments.push(attachment);

    return this;
  }

  addText(text) {
    const attachment = this.getLatestAttachment();
    attachment.text = text;

    return this;
  }

  addColor(color) {
    const attachment = this.getLatestAttachment();
    attachment.color = color;

    return this;
  }

  addAction(text, name, value, style) {
    const action = {
      text: text,
      name: name,
      value: value,
      type: 'button'
    };

    if (style)
      action.style = style;

    this.getLatestAttachment().actions.push(action);

    return this;
  }

  get() {
    return this.template;
  }
}

module.exports = slackTemplate;
