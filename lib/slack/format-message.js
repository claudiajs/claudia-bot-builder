'use strict';

const isUrl = require('../is-url');

class SlackTemplate {
  constructor(text) {
    this.template = {
      mrkdwn: true
    };
    this.template.attachments = [];

    if (text)
      this.template.text = text;
  }

  replaceOriginal(value) {
    this.template.replace_original = !!value;
    return this;
  }

  disableMarkdown(value) {
    if (value)
      this.template.mrkdwn = !value;

    return this;
  }

  // This works for Slash commands only
  channelMessage(value) {
    if (value && value !== 'ephemeral')
      this.template.response_type = 'in_channel';

    return this;
  }

  getLatestAttachment() {
    if (!this.template.attachments.length)
      throw new Error('Add at least one attachment first');

    return this.template.attachments[this.template.attachments.length - 1];
  }

  addAttachment(callbackId, fallback) {
    if (this.template.attachments.length === 20)
      throw new Error('You can not add more than 20 attachments');

    const attachment = {
      actions: []
    };

    if (callbackId)
      attachment.callback_id = callbackId;

    attachment.fallback = fallback || 'Slack told us that you are not able to see this attachment 😢';

    this.template.attachments.push(attachment);

    return this;
  }

  addTitle(text, link) {
    if (!text)
      throw new Error('Title text is required for addTitle method');

    const attachment = this.getLatestAttachment();
    attachment.title = text;
    if (isUrl(link))
      attachment.title_link = link;

    return this;
  }

  addText(text) {
    if (!text)
      throw new Error('Text is required for addText method');

    const attachment = this.getLatestAttachment();
    attachment.text = text;

    return this;
  }

  addPretext(text) {
    if (!text)
      throw new Error('Text is required for addPretext method');

    const attachment = this.getLatestAttachment();
    attachment.pretext = text;

    return this;
  }

  addImage(url) {
    if (!isUrl(url))
      throw new Error('addImage method requires a valid URL');

    const attachment = this.getLatestAttachment();
    attachment.image_url = url;

    return this;
  }

  addThumbnail(url) {
    if (!isUrl(url))
      throw new Error('addThumbnail method requires a valid URL');

    const attachment = this.getLatestAttachment();
    attachment.thumb_url = url;

    return this;
  }

  addAuthor(name, icon, link) {
    if (!name)
      throw new Error('Name is required for addAuthor method');

    const attachment = this.getLatestAttachment();
    attachment.author_name = name;

    if (icon)
      attachment.author_icon = icon;

    if (isUrl(link))
      attachment.author_link = link;

    return this;
  }

  addFooter(text, icon) {
    if (!text)
      throw new Error('Text is required for addFooter method');

    const attachment = this.getLatestAttachment();
    attachment.footer = text;

    if (icon)
      attachment.footer_icon = icon;

    return this;
  }

  addColor(color) {
    if (!color)
      throw new Error('Color is required for addColor method');

    const attachment = this.getLatestAttachment();
    attachment.color = color;

    return this;
  }

  addTimestamp(timestamp) {
    if (!(timestamp instanceof Date))
      throw new Error('Timestamp needs to be a valid Date object');

    const attachment = this.getLatestAttachment();
    attachment.ts = timestamp.getTime();

    return this;
  }

  addField(title, value, isShort) {
    if (!title || !value)
      throw new Error('Title and value are required for addField method');

    const attachment = this.getLatestAttachment();
    if (!attachment.fields)
      attachment.fields = [];

    attachment.fields.push({
      title: title,
      value: value,
      short: !!isShort
    });

    return this;
  }

  addAction(text, name, value, style) {
    if (this.getLatestAttachment().actions.length === 5)
      throw new Error('You can not add more than 5 actions');

    if (!text || !name || !value)
      throw new Error('Text, name and value are requeired for addAction method');

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
  
  addSelect(text, name, options, dataSource = 'static', minQueryLength) {
    if (this.getLatestAttachment().actions.length === 5)
      throw new Error('You can not add more than 5 actions');

    if (!text || !name)
      throw new Error('Text and name are requeired for addAction method');

    if (name.split(' ').length > 1)
      throw new Error('Name need to be one word');

    if (['static', 'users', 'channels', 'conversations', 'external'].indexOf(dataSource) === -1)
      throw new Error('The value of the dataSource can be users, channels, conversations, external or static');

    if (minQueryLength && !Number.isInteger(minQueryLength))
      throw new Error('minQueryLength needs to be a valid number');

    const action = {
      text: text,
      name: name,
      type: 'select'
    };
    
    if (!dataSource || dataSource === 'static') {
      if (!Array.isArray(options))
        throw new Error('options needs to be a valid array');

      action.options = options;
    }

    if (dataSource)
      action.data_source = dataSource;

    if (minQueryLength)
      action.min_query_length = minQueryLength;

    this.getLatestAttachment().actions.push(action);

    return this;
  }

  addLinkButton(text, url, style) {
    if (this.getLatestAttachment().actions.length === 5)
      throw new Error('You can not add more than 5 actions and link buttons');
    
    if (!text || !url)
      throw new Error('Text and URL are requeired for addLinkButton method');
    
    if (!isUrl(url))
      throw new Error('URL need to be a valid');
    
    const action = {
      type: 'button',
      text: text,
      url: url
    };

    if (style)
      action.style = style;

    this.getLatestAttachment().actions.push(action);

    return this;
  }

  getLatestAction() {
    const actions = this.getLatestAttachment().actions;

    if (!actions.length)
      throw new Error('At least one action is requeired for getLatestAction method');

    return actions[actions.length - 1];
  }

  addConfirmation(title, text, okLabel, dismissLabel) {
    const action = this.getLatestAction();

    if (!title || !text)
      throw new Error('Title and text are required for addConfirmation method');

    action.confirm = {
      title: title,
      text: text,
      ok_text: okLabel || 'Ok',
      dismiss_text: dismissLabel || 'Dismiss'
    };

    return this;
  }

  get() {
    return this.template;
  }
}

module.exports = SlackTemplate;
