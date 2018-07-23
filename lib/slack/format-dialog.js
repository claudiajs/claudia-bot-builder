'use strict';

class SlackDialog {
  constructor(triggerId, title, submitLabel, callbackId, notifyOnCancel = false) {
    this.template = {
      trigger_id: triggerId,
      dialog: {
        title: title,
        submit_label: submitLabel,
        callback_id: callbackId,
        notify_on_cancel: notifyOnCancel,
        elements: []
      }
    };
  }

  addInput(text, name, maxLength = 150, minLength = 0, optional = false, hint, subtype, value, placeholder) {
    if (this.template.dialog.elements.length === 5)
      throw new Error('You can not add more than 5 elements');

    if (!text || !name)
      throw new Error('Text and name are requeired for addInput method');

    if (text > 24)
      throw new Error('Text needs to be less or equal to 24 characters');

    if (name > 300)
      throw new Error('Name needs to be less or equal to 300 characters');

    if (maxLength && (Number.isInteger(maxLength) || maxLength > 150))
      throw new Error('Max length needs to be a valid number and less or equal to 150');

    if (minLength && (Number.isInteger(minLength) || minLength < 150))
      throw new Error('Min length needs to be a valid number and less or equal to 150');

    if (optional && typeof optional !== 'boolean')
      throw new Error('Optional needs to be a boolean');

    if (hint && (typeof hint !== 'string' || hint.length > 150))
      throw new Error('Hint needs to be a valid string and less or equal to 150 characters');

    if (subtype && ['text', 'email', 'number', 'tel', 'url'].indexOf(subtype) > -1)
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


    this.this.template.dialog.elements.push(inputElement);

    return this;
  }

  // addTextarea() { }
  addTextarea(text, name, placeholder, maxLength = 3000, minLength = 3000, optional = false, hint, subtype, value) {
    if (this.template.dialog.elements.length === 5)
      throw new Error('You can not add more than 5 elements');

    if (!text || !name)
      throw new Error('Text and name are requeired for addInput method');

    if (text > 300)
      throw new Error('Text needs to be less or equal to 24 characters');
    
    if (name > 24)
      throw new Error('Name needs to be less or equal to 300 characters');

    if (placeholder && (typeof placeholder !== 'string' || placeholder.length > 150))
      throw new Error('Placeholder needs to be a valid string and less or equal to 150 characters');

    if (maxLength && (Number.isInteger(maxLength) || maxLength > 3000))
      throw new Error('Max length needs to be a valid number and less or equal to 3000');

    if (minLength && (Number.isInteger(minLength) || minLength < 3000))
      throw new Error('Min length needs to be a valid number and less or equal to 3000');

    if (optional && typeof optional !== 'boolean')
      throw new Error('Optional needs to be a boolean');

    if (hint && (typeof hint !== 'string' || hint.length > 150))
      throw new Error('Hint needs to be a valid string and less or equal to 150 characters');

    if (subtype && ['text', 'email', 'number', 'tel', 'url'].indexOf(subtype) > -1)
      throw new Error('The value of the subtype can be email, number, tel, url or text');

    if (value && (typeof value !== 'string' || value.length > 3000))
      throw new Error('Value needs to be a valid string and less or equal to 3000 characters');

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


    this.this.template.dialog.elements.push(textareaElement);

    return this;
  }


  addSelect(text, name, dataSource = 'static', minQueryLength, placeholder, optional, value, selectedOptions, options) { 
    if (this.template.dialog.elements.length === 5)
      throw new Error('You can not add more than 5 elements');

    if (!text || !name)
      throw new Error('Text and name are requeired for addInput method');

    if (text > 300)
      throw new Error('Text needs to be less or equal to 24 characters');

    if (name > 24)
      throw new Error('Name needs to be less or equal to 300 characters');

    if (dataSource && ['static', 'users', 'channels', 'conversations', 'external'].indexOf(dataSource) > -1)
      throw new Error('The value of the dataSource can be users, channels, conversations, external or static');

    if (minQueryLength && !Number.isInteger(minQueryLength))
      throw new Error('minQueryLength needs to be a valid number');

    if (placeholder && (typeof placeholder !== 'string' || placeholder.length > 150))
      throw new Error('Placeholder needs to be a valid string and less or equal to 150 characters');

    if (optional && typeof optional !== 'boolean')
      throw new Error('Optional needs to be a boolean');

    if (value && typeof value !== 'string')
      throw new Error('Value needs to be a valid string');
    
    if (selectedOptions && !Array.isArray(selectedOptions))
      throw new Error('selectedOptions needs to be a valid array');
    
    if (options && Array.isArray(options))
      throw new Error('options needs to be a valid array');

    let selectElement = {
      label: text,
      name: name,
      type: 'textarea',
      data_source: dataSource
    };

    if (minQueryLength)
      inputElement.minQueryLength = minQueryLength;

    if (placeholder)
      inputElement.placeholder = placeholder;

    if (optional)
      inputElement.optional = optional;

    if (value)
      inputElement.value = value;
    
    if (selectedOptions)
      inputElement.selectedOptions = selectedOptions;
    
    if (options)
      inputElement.options = options;


    this.this.template.dialog.elements.push(selectElement);

    return this;
  }

  get() {
    this.template.dialog = JSON.stringify(this.template.dialog);
    return this.template
  }
}

module.exports = SlackDialog;
