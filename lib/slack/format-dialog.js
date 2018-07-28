'use strict';

class SlackDialog {
  constructor(token, triggerId, title, submitLabel, callbackId, notifyOnCancel = false) {
    if (!token || !triggerId || !title)
      throw new Error('token, triggerId and title are requeired for dialog.open method');

    if (title.length > 24)
      throw new Error('Title needs to be less or equal to 24 characters');
    
    if (submitLabel && submitLabel.length > 24)
      throw new Error('submit_label needs to be less or equal to 24 characters');

    if (submitLabel && submitLabel.split(' ').length > 1) 
      throw new Error('submit_label can only be one word');

    
    if (callbackId && callbackId.length > 255)
      throw new Error('callback_id needs to be less or equal to 255 characters');

    if (notifyOnCancel && typeof(notifyOnCancel) !== 'boolean')
      throw new Error('notify_on_cancel needs to be a boolean');

    this.template = {
      token: token,
      trigger_id: triggerId,
      dialog: {
        title: title,
        notify_on_cancel: notifyOnCancel,
        elements: []
      }
    };

    if (submitLabel)
      this.template.dialog.submit_label = submitLabel;

    if (callbackId)
      this.template.dialog.callback_id = callbackId;

  }

  addInput(text, name, maxLength = 150, minLength = 0, optional = false, hint, subtype, value, placeholder) {
    if (this.template.dialog.elements.length === 5)
      throw new Error('You can not add more than 5 elements');

    if (!text || !name)
      throw new Error('Text and name are requeired for addInput method');

    if (text.length > 24)
      throw new Error('Text needs to be less or equal to 24 characters');

    if (name.length > 300)
      throw new Error('Name needs to be less or equal to 300 characters');

    if (!(/^\+?(0|[1-9]\d*)$/.test(maxLength)) || maxLength > 150 || maxLength == 0)
      throw new Error('Max length needs to be a valid number and less or equal to 150');

    if (!(/^\+?(0|[1-9]\d*)$/.test(minLength)) || minLength >= 150)
      throw new Error('Min length needs to be a valid number and less or equal to 150');

    if (optional && typeof optional !== 'boolean')
      throw new Error('Optional needs to be a boolean');

    if (hint && (typeof hint !== 'string' || hint.length > 150))
      throw new Error('Hint needs to be a valid string and less or equal to 150 characters');

    if (subtype && (['text', 'email', 'number', 'tel', 'url'].indexOf(subtype) === -1 || typeof subtype !== 'string' || typeof subtype === 'boolean'))
      throw new Error('The value of the subtype can be email, number, tel, url or text');

    if (value && (typeof value !== 'string' || value.length > 150))
      throw new Error('Value needs to be a valid string and less or equal to 150 characters');

    if (placeholder && (typeof placeholder !== 'string' || placeholder.length > 150))
      throw new Error('Placeholder needs to be a valid string and less or equal to 150 characters');

    const inputElement = {
      label: text,
      name: name,
      type: 'text',
      max_length: maxLength,
      min_length: minLength,
      optional: optional
    };

    if (hint)
      inputElement.hint = hint;

    if (subtype)
      inputElement.subtype = subtype;

    if (value)
      inputElement.value = value;

    if (placeholder)
      inputElement.placeholder = placeholder;

    this.template.dialog.elements.push(inputElement);

    return this;
  }

  addTextarea(text, name, maxLength = 3000, minLength = 0, optional = false, hint, subtype, value, placeholder) {
    if (this.template.dialog.elements.length === 5)
      throw new Error('You can not add more than 5 elements');

    if (!text || !name)
      throw new Error('Text and name are requeired for addTextarea method');

    if (text.length > 24)
      throw new Error('Text needs to be less or equal to 24 characters');
    
    if (name.length > 300)
      throw new Error('Name needs to be less or equal to 300 characters');

    if (!(/^\+?(0|[1-9]\d*)$/.test(maxLength)) || maxLength > 3000 || maxLength == 0)
      throw new Error('Max length needs to be a valid number and less or equal to 3000');

    if (!(/^\+?(0|[1-9]\d*)$/.test(minLength)) || minLength >= 3000)
      throw new Error('Min length needs to be a valid number and less or equal to 3000');

    if (optional && typeof optional !== 'boolean')
      throw new Error('Optional needs to be a boolean');

    if (hint && (typeof hint !== 'string' || hint.length > 150))
      throw new Error('Hint needs to be a valid string and less or equal to 150 characters');

    if (subtype && (['text', 'email', 'number', 'tel', 'url'].indexOf(subtype) === -1 || typeof subtype !== 'string' || typeof subtype === 'boolean'))
      throw new Error('The value of the subtype can be email, number, tel, url or text');


    if (value && (typeof value !== 'string' || value.length > 3000))
      throw new Error('Value needs to be a valid string and less or equal to 3000 characters');

    if (placeholder && (typeof placeholder !== 'string' || placeholder.length > 150))
      throw new Error('Placeholder needs to be a valid string and less or equal to 150 characters');

    let textareaElement = {
      label: text,
      name: name,
      type: 'textarea',
      max_length: maxLength,
      min_length: minLength,
      optional: optional
    };

    if (hint)
      textareaElement.hint = hint;

    if (subtype)
      textareaElement.subtype = subtype;

    if (value)
      textareaElement.value = value;

    if (placeholder)
      textareaElement.placeholder = placeholder;

    this.template.dialog.elements.push(textareaElement);

    return this;
  }

  addSelect(text, name, dataSource = 'static', minQueryLength, placeholder, optional = false, value, selectedOptions, options) { 
    if (this.template.dialog.elements.length === 5)
      throw new Error('You can not add more than 5 elements');

    if (!text || !name)
      throw new Error('Text and name are requeired for addSelect method');

    if (text.length > 24)
      throw new Error('Text needs to be less or equal to 24 characters');

    if (name.length > 300)
      throw new Error('Name needs to be less or equal to 300 characters');

    if (dataSource && (['static', 'users', 'channels', 'conversations', 'external'].indexOf(dataSource) === -1 || typeof dataSource !== 'string' || typeof dataSource === 'boolean'))
      throw new Error('The value of the dataSource can be users, channels, conversations, external or static');

    if (minQueryLength && !Number.isInteger(minQueryLength))
      throw new Error('minQueryLength needs to be a valid number');

    if (placeholder && (typeof placeholder !== 'string' || placeholder.length > 150))
      throw new Error('Placeholder needs to be a valid string and less or equal to 150 characters');

    if (optional && typeof optional !== 'boolean')
      throw new Error('Optional needs to be a boolean');

    if (value && typeof value !== 'string')
      throw new Error('Value needs to be a valid string');
    
    if (typeof selectedOptions !== 'undefined' && (!Array.isArray(selectedOptions) || typeof (selectedOptions) === 'boolean'))
      throw new Error('selectedOptions needs to be a valid array');
    
    if (typeof options !== 'undefined' && (!Array.isArray(options) || typeof(options) === 'boolean'))
      throw new Error('options needs to be a valid array');

    let selectElement = {
      label: text,
      name: name,
      type: 'select',
      data_source: dataSource
    };

    if (minQueryLength)
      selectElement.minQueryLength = minQueryLength;

    if (placeholder)
      selectElement.placeholder = placeholder;

    if (optional)
      selectElement.optional = optional;

    if (value)
      selectElement.value = value;
    
    if (selectedOptions)
      selectElement.selectedOptions = selectedOptions;
    
    if (options)
      selectElement.options = options;

    this.template.dialog.elements.push(selectElement);

    return this;
  }

  get() {
    this.template.dialog = JSON.stringify(this.template.dialog);
    
    return this.template;
  }
}

module.exports = SlackDialog;
