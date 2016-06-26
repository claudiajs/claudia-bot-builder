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

  addTitle(text, link) {
    const attachment = this.getLatestAttachment();
    attachment.title = text;
    attachment.title_link = link;

    return text;
  }

  addText(text) {
    const attachment = this.getLatestAttachment();
    attachment.text = text;

    return this;
  }

  addPretext(text) {
    const attachment = this.getLatestAttachment();
    attachment.pretext = text;

    return this;
  }

  addImage(url) {
    const attachment = this.getLatestAttachment();
    attachment.image_url = url;

    return this;
  }

  addThumbnail(url) {
    const attachment = this.getLatestAttachment();
    attachment.thumb_url = url;

    return this;
  }

  addAuthor(name, icon, link) {
    const attachment = this.getLatestAttachment();
    attachment.author_name = name;
    attachment.author_icon = icon;
    attachment.author_link = link;

    return this;
  }

  addFooter(text, icon) {
    const attachment = this.getLatestAttachment();
    attachment.footer = text;
    attachment.footer_icon = icon;

    return this;
  }

  addColor(color) {
    const attachment = this.getLatestAttachment();
    attachment.color = color;

    return this;
  }

  addTimestamp(timestamp) {
    const attachment = this.getLatestAttachment();
    attachment.ts = timestamp.getTime();

    return this;
  }

  addField(title, value, isShort) {
    const attachment = this.getLatestAttachment();
    if (!attachment.fields)
      attachment.fields = [];

    attachment.fields.push({
      title: title,
      value: value,
      short: !!isShort
    });
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

  getLatestAction() {
    const actions = this.getLatestAttachment().actions;
    return actions[actions.length - 1];
  }

  addConfirmation(title, text, okLabel, dismissLabel) {
    const action = this.getLatestAction();

    action.confim = {
      title: title,
      text: text,
      ok_text: okLabel,
      dismiss_text: dismissLabel
    };

    return this;
  }

  get() {
    return this.template;
  }
}

module.exports = slackTemplate;
