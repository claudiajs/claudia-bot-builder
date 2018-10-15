/*global describe, it, expect, beforeEach */
'use strict';

const formatSlackDialog = require('../../lib/slack/format-dialog');

let message;
describe('Slack format dialog', () => {
  beforeEach(() => {
    message = new formatSlackDialog('token', 'triggerId', 'title');
  });

  it('should export a function', () => {
    expect(typeof formatSlackDialog).toBe('function');
  });

  describe('Template builder', () => {
    it('should be a class', () => {
      let message = new formatSlackDialog('token', 'triggerId', 'title');
      expect(typeof formatSlackDialog).toBe('function');
      expect(message instanceof formatSlackDialog).toBeTruthy();
    });

    it('should throw an error if you don\'t provide token in the constructor', () => {
      expect(() => new formatSlackDialog()).toThrowError('token, triggerId and title are requeired for dialog.open method');
    });
    
    it('should throw an error if you don\'t provide triggerId in the constructor', () => {
      expect(() => new formatSlackDialog()).toThrowError('token, triggerId and title are requeired for dialog.open method');
    });
    
    it('should throw an error if you don\'t provide title in the constructor', () => {
      expect(() => new formatSlackDialog()).toThrowError('token, triggerId and title are requeired for dialog.open method');
    });

    it('should add token, triggerId and title if you provide it in the constructor', () => {
      expect(message.template.token).toBe('token');
      expect(message.template.trigger_id).toBe('triggerId');
      expect(message.template.dialog.title).toBe('title');
    });
    
    it('should throw an error if title have more of 24 characters', () => {
      expect(() => new formatSlackDialog('token', 'triggerId', 'title with more of 24 characters'))
        .toThrowError('Title needs to be less or equal to 24 characters');
    });
    
    it('should throw an error if submitLabel have more of 24 characters', () => {
      expect(() => new formatSlackDialog('token', 'triggerId', 'title', 'submitLabel with more of 24 characters'))
        .toThrowError('submit_label needs to be less or equal to 24 characters');
    });
    
    it('should throw an error if submitLabel have more of two word', () => {
      expect(() => new formatSlackDialog('token', 'triggerId', 'title', 'two words'))
        .toThrowError('submit_label can only be one word');
    });

    it('should throw an error if callbackId have more of 255 characters', () => {
      expect(() => new formatSlackDialog('token', 'triggerId', 'title', 'button', 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable.If you are going to use a passage of Lorem Ipsum, you need to be sure.'))
        .toThrowError('callback_id needs to be less or equal to 255 characters');
    });

    it('should add a submit_label if you provide it in the constructor', () => {
      const message = new formatSlackDialog('token', 'triggerId', 'title', 'approve');
      expect(message.template.dialog.submit_label).toBe('approve');
    });
    
    it('should add a callback_id if you provide it in the constructor', () => {
      const message = new formatSlackDialog('token', 'triggerId', 'title', 'approve', 'callback');
      expect(message.template.dialog.callback_id).toBe('callback');
    });

    it('should add a notify_on_cancel if you provide it in the constructor', () => {
      expect(() => new formatSlackDialog('token', 'triggerId', 'title', 'approve', 'callback', 'true'))
        .toThrowError('notify_on_cancel needs to be a boolean');
    });
    
    it('should add a notify_on_cancel if you provide it in the constructor', () => {
      const message = new formatSlackDialog('token', 'triggerId', 'title', 'approve', 'callback', true);
      expect(message.template.dialog.notify_on_cancel).toBeTruthy();
    });
    
    it('should disable a notify_on_cancel if you provide it in the constructor', () => {
      const message = new formatSlackDialog('token', 'triggerId', 'title', 'approve', 'callback', false);
      expect(message.template.dialog.notify_on_cancel).toBeFalsy();
    });

    describe('addInput', () => {
      it('should throw an error if you use without adding a title', () => {
        expect(() => message.addInput()).toThrowError('Text and name are requeired for addInput method');
      });
      
      it('should throw an error if you use without adding a name', () => {
        expect(() => message.addInput('title')).toThrowError('Text and name are requeired for addInput method');
      });
      
      it('should throw an error if you use with text more than 24 characters', () => {
        expect(() => message.addInput('some big title... more text', 'name'))
          .toThrowError('Text needs to be less or equal to 24 characters');
      });
      
      it('should throw an error if you use with name more than 300 characters', () => {
        expect(() => message.addInput('title', 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable.If you are going to use a passage of Lorem Ipsum, you need to be sure there isnt anything embarrassing hidden in the middle of text.'))
          .toThrowError('Name needs to be less or equal to 300 characters');
      });
      
      it('should throw an error if max lenght is not number', () => {
        expect(() => message.addInput('title', 'name', 'asd'))
          .toThrowError('Max length needs to be a valid number and less or equal to 150');
      });
      
      it('should throw an error if max lenght is 0', () => {
        expect(() => message.addInput('title', 'name', 0))
          .toThrowError('Max length needs to be a valid number and less or equal to 150');
      });
      
      it('should throw an error if max lenght moew then 150', () => {
        expect(() => message.addInput('title', 'name', 151))
          .toThrowError('Max length needs to be a valid number and less or equal to 150');
      });
      
      it('should throw an error if min lenght is not number', () => {
        expect(() => message.addInput('title', 'name', 150, 'asd'))
          .toThrowError('Min length needs to be a valid number and less or equal to 150');
      });
      
      it('should throw an error if min lenght is 0', () => {
        expect(() => message.addInput('title', 'name', 150, 200))
          .toThrowError('Min length needs to be a valid number and less or equal to 150');
      });
      
      it('should throw an error if optional is string', () => {
        expect(() => message.addInput('title', 'name', 150, 0, 'asd'))
          .toThrowError('Optional needs to be a boolean');
      });
      
      it('should add a optional', () => {
        message.addInput('title', 'name', 150, 0, true);
        expect(message.template.dialog.elements[0].optional).toBeTruthy();
      });
      
      it('should disable a optional', () => {
        message.addInput('title', 'name', 150, 0, false);
        expect(message.template.dialog.elements[0].optional).toBeFalsy();
      });
      
      it('should throw an error if hint is not string', () => {
        expect(() => message.addInput('title', 'name', 150, 0, true, {}))
          .toThrowError('Hint needs to be a valid string and less or equal to 150 characters');
      });
      
      it('should throw an error if hint have more than of 150 characters', () => {
        expect(() => message.addInput('title', 'name', 150, 0, true, 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable.'))
          .toThrowError('Hint needs to be a valid string and less or equal to 150 characters');
      });

      it('should throw an error if subtype is not text, email, number, tel or url', () => {
        expect(() => message.addInput('title', 'name', 150, 0, true, 'hint', 'else'))
          .toThrowError('The value of the subtype can be email, number, tel, url or text');
      });
      
      it('should a valid subtype if provide text', () => {
        message.addInput('title', 'name', 150, 0, false, 'hint', 'text');
        expect(message.template.dialog.elements[0].subtype).toBe('text');
      });
      
      it('should a valid subtype if provide email', () => {
        message.addInput('title', 'name', 150, 0, false, 'hint', 'email');
        expect(message.template.dialog.elements[0].subtype).toBe('email');
      });
      
      it('should a valid subtype if provide number', () => {
        message.addInput('title', 'name', 150, 0, false, 'hint', 'number');
        expect(message.template.dialog.elements[0].subtype).toBe('number');
      });
      
      it('should a valid subtype if provide tel', () => {
        message.addInput('title', 'name', 150, 0, false, 'hint', 'tel');
        expect(message.template.dialog.elements[0].subtype).toBe('tel');
      });
      
      it('should a valid subtype if provide url', () => {
        message.addInput('title', 'name', 150, 0, false, 'hint', 'url');
        expect(message.template.dialog.elements[0].subtype).toBe('url');
      });

      it('should throw an error if value is not string', () => {
        expect(() => message.addInput('title', 'name', 150, 0, true, 'hint', 'url', {}))
          .toThrowError('Value needs to be a valid string and less or equal to 150 characters');
      });
      
      it('should throw an error if value have more than of 150 characters', () => {
        expect(() => message.addInput('title', 'name', 150, 0, true, 'hint', 'url', 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable.'))
          .toThrowError('Value needs to be a valid string and less or equal to 150 characters');
      });

      it('should throw an error if placeholder is not string', () => {
        expect(() => message.addInput('title', 'name', 150, 0, true, 'hint', 'url', 'value', {}))
          .toThrowError('Placeholder needs to be a valid string and less or equal to 150 characters');
      });
      
      it('should throw an error if placeholder have more than of 150 characters', () => {
        expect(() => message.addInput('title', 'name', 150, 0, true, false, false, false, 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable.'))
          .toThrowError('Placeholder needs to be a valid string and less or equal to 150 characters');
      });

      it('should throw an error if you try to add more than 5 actions', () => {
        message.addInput('I1', 'foo')
          .addInput('I2', 'foo')
          .addInput('I3', 'foo')
          .addInput('I4', 'foo')
          .addInput('I5', 'foo');
        expect(() => message.addInput('Button', 'http://foo.bar')).toThrowError('You can not add more than 5 elements');
      });
    });
    
    describe('addTextarea', () => {
      it('should throw an error if you use without adding a title', () => {
        expect(() => message.addTextarea()).toThrowError('Text and name are requeired for addTextarea method');
      });
      
      it('should throw an error if you use without adding a name', () => {
        expect(() => message.addTextarea('title')).toThrowError('Text and name are requeired for addTextarea method');
      });
      
      it('should throw an error if you use with text more than 24 characters', () => {
        expect(() => message.addTextarea('some big title... more text', 'name'))
          .toThrowError('Text needs to be less or equal to 24 characters');
      });
      
      it('should throw an error if you use with name more than 300 characters', () => {
        expect(() => message.addTextarea('title', 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable.If you are going to use a passage of Lorem Ipsum, you need to be sure there isnt anything embarrassing hidden in the middle of text.'))
          .toThrowError('Name needs to be less or equal to 300 characters');
      });
      
      it('should throw an error if max lenght is not number', () => {
        expect(() => message.addTextarea('title', 'name', 'asd'))
          .toThrowError('Max length needs to be a valid number and less or equal to 3000');
      });
      
      it('should throw an error if max lenght is 0', () => {
        expect(() => message.addTextarea('title', 'name', 0))
          .toThrowError('Max length needs to be a valid number and less or equal to 3000');
      });
      
      it('should throw an error if max lenght more then 3000', () => {
        expect(() => message.addTextarea('title', 'name', 3010))
          .toThrowError('Max length needs to be a valid number and less or equal to 3000');
      });
      
      it('should throw an error if min lenght is not number', () => {
        expect(() => message.addTextarea('title', 'name', 3000, 'asd'))
          .toThrowError('Min length needs to be a valid number and less or equal to 3000');
      });
      
      it('should throw an error if min lenght is 0', () => {
        expect(() => message.addTextarea('title', 'name', 3000, 3050))
          .toThrowError('Min length needs to be a valid number and less or equal to 3000');
      });
      
      it('should throw an error if optional is string', () => {
        expect(() => message.addTextarea('title', 'name', 3000, 0, 'asd'))
          .toThrowError('Optional needs to be a boolean');
      });
      
      it('should add a optional', () => {
        message.addTextarea('title', 'name', 3000, 0, true);
        expect(message.template.dialog.elements[0].optional).toBeTruthy();
      });
      
      it('should disable a optional', () => {
        message.addTextarea('title', 'name', 3000, 0, false);
        expect(message.template.dialog.elements[0].optional).toBeFalsy();
      });
      
      it('should throw an error if hint is not string', () => {
        expect(() => message.addTextarea('title', 'name', 3000, 0, true, {}))
          .toThrowError('Hint needs to be a valid string and less or equal to 150 characters');
      });
      
      it('should throw an error if hint have more than of 150 characters', () => {
        expect(() => message.addTextarea('title', 'name', 3000, 0, true, 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable.'))
          .toThrowError('Hint needs to be a valid string and less or equal to 150 characters');
      });

      it('should throw an error if subtype is not text, email, number, tel or url', () => {
        expect(() => message.addTextarea('title', 'name', 3000, 0, true, 'hint', 'else'))
          .toThrowError('The value of the subtype can be email, number, tel, url or text');
      });
      
      it('should a valid subtype if provide text', () => {
        message.addTextarea('title', 'name', 3000, 0, false, 'hint', 'text');
        expect(message.template.dialog.elements[0].subtype).toBe('text');
      });
      
      it('should a valid subtype if provide email', () => {
        message.addTextarea('title', 'name', 3000, 0, false, 'hint', 'email');
        expect(message.template.dialog.elements[0].subtype).toBe('email');
      });
      
      it('should a valid subtype if provide number', () => {
        message.addTextarea('title', 'name', 3000, 0, false, 'hint', 'number');
        expect(message.template.dialog.elements[0].subtype).toBe('number');
      });
      
      it('should a valid subtype if provide tel', () => {
        message.addTextarea('title', 'name', 3000, 0, false, 'hint', 'tel');
        expect(message.template.dialog.elements[0].subtype).toBe('tel');
      });
      
      it('should a valid subtype if provide url', () => {
        message.addTextarea('title', 'name', 3000, 0, false, 'hint', 'url');
        expect(message.template.dialog.elements[0].subtype).toBe('url');
      });

      it('should throw an error if value is not string', () => {
        expect(() => message.addTextarea('title', 'name', 3000, 0, true, 'hint', 'url', {}))
          .toThrowError('Value needs to be a valid string and less or equal to 3000 characters');
      });

      it('should throw an error if placeholder is not string', () => {
        expect(() => message.addTextarea('title', 'name', 3000, 0, true, 'hint', 'url', 'value', {}))
          .toThrowError('Placeholder needs to be a valid string and less or equal to 150 characters');
      });
      
      it('should throw an error if placeholder have more than of 150 characters', () => {
        expect(() => message.addTextarea('title', 'name', 3000, 0, true, false, false, false, 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable.'))
          .toThrowError('Placeholder needs to be a valid string and less or equal to 150 characters');
      });

      it('should throw an error if you try to add more than 5 actions', () => {
        message.addTextarea('I1', 'foo')
          .addTextarea('I2', 'foo')
          .addTextarea('I3', 'foo')
          .addTextarea('I4', 'foo')
          .addTextarea('I5', 'foo');
        expect(() => message.addTextarea('Button', 'http://foo.bar')).toThrowError('You can not add more than 5 elements');
      });
    });
    
    describe('addSelect', () => {
      it('should throw an error if you use without adding a title', () => {
        expect(() => message.addSelect()).toThrowError('Text and name are requeired for addSelect method');
      });
      
      it('should throw an error if you use without adding a name', () => {
        expect(() => message.addSelect('title')).toThrowError('Text and name are requeired for addSelect method');
      });
      
      it('should throw an error if you use with text more than 24 characters', () => {
        expect(() => message.addSelect('some big title... more text', 'name'))
          .toThrowError('Text needs to be less or equal to 24 characters');
      });
      
      it('should throw an error if you use with name more than 300 characters', () => {
        expect(() => message.addSelect('title', 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable.If you are going to use a passage of Lorem Ipsum, you need to be sure there isnt anything embarrassing hidden in the middle of text.'))
          .toThrowError('Name needs to be less or equal to 300 characters');
      });

      it('should throw an error if dataSource is not static, users, channels, conversations or external', () => {
        expect(() => message.addSelect('title', 'name', 'else'))
          .toThrowError('The value of the dataSource can be users, channels, conversations, external or static');
        expect(() => message.addSelect('title', 'name', true))
          .toThrowError('The value of the dataSource can be users, channels, conversations, external or static');
        expect(() => message.addSelect('title', 'name', {}))
          .toThrowError('The value of the dataSource can be users, channels, conversations, external or static');
      });

      it('should a valid dataSource if provide static', () => {
        message.addSelect('title', 'name', 'static');
        expect(message.template.dialog.elements[0].data_source).toBe('static');
      });

      it('should a valid dataSource if provide users', () => {
        message.addSelect('title', 'name', 'users');
        expect(message.template.dialog.elements[0].data_source).toBe('users');
      });

      it('should a valid dataSource if provide channels', () => {
        message.addSelect('title', 'name', 'channels');
        expect(message.template.dialog.elements[0].data_source).toBe('channels');
      });

      it('should a valid dataSource if provide conversations', () => {
        message.addSelect('title', 'name', 'conversations');
        expect(message.template.dialog.elements[0].data_source).toBe('conversations');
      });

      it('should a valid dataSource if provide external', () => {
        message.addSelect('title', 'name', 'external');
        expect(message.template.dialog.elements[0].data_source).toBe('external');
      });
      
      it('should throw an error if minQueryLength is not number', () => {
        expect(() => message.addSelect('title', 'name', 'static', '123'))
          .toThrowError('minQueryLength needs to be a valid number');
        expect(() => message.addSelect('title', 'name', 'static', true))
          .toThrowError('minQueryLength needs to be a valid number');
        expect(() => message.addSelect('title', 'name', 'static', {}))
          .toThrowError('minQueryLength needs to be a valid number');
      });

      it('should throw an error if placeholder is not string', () => {
        expect(() => message.addSelect('title', 'name', 'static', 2, {}))
          .toThrowError('Placeholder needs to be a valid string and less or equal to 150 characters');
      });

      it('should throw an error if placeholder have more than of 150 characters', () => {
        expect(() => message.addSelect('title', 'name', 'static', 2, 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable.'))
          .toThrowError('Placeholder needs to be a valid string and less or equal to 150 characters');
      });

      it('should throw an error if optional is string', () => {
        expect(() => message.addSelect('title', 'name', 'static', 2, 'placeholder', 'asd'))
          .toThrowError('Optional needs to be a boolean');
      });
      
      it('should add a optional', () => {
        message.addSelect('title', 'name', 'static', 2, 'placeholder', true);
        expect(message.template.dialog.elements[0].optional).toBeTruthy();
      });
      
      it('should disable a optional', () => {
        message.addSelect('title', 'name', 'static', 2, 'placeholder', false);
        expect(message.template.dialog.elements[0].optional).toBeFalsy();
      });

      it('should throw an error if value is not string', () => {
        expect(() => message.addSelect('title', 'name', 'static', 2, 'placeholder', false, {}))
          .toThrowError('Value needs to be a valid string');
      });
      
      it('should throw an error if selectedOptions is not array', () => {
        expect(() => message.addSelect('title', 'name', 'static', 2, 'placeholder', false, 'value', 'asd'))
          .toThrowError('selectedOptions needs to be a valid array');
        expect(() => message.addSelect('title', 'name', 'static', 2, 'placeholder', false, 'value', true))
          .toThrowError('selectedOptions needs to be a valid array');
        expect(() => message.addSelect('title', 'name', 'static', 2, 'placeholder', false, 'value', false))
          .toThrowError('selectedOptions needs to be a valid array');
        expect(() => message.addSelect('title', 'name', 'static', 2, 'placeholder', false, 'value', {}))
          .toThrowError('selectedOptions needs to be a valid array');
      });
      
      it('should throw an error if options is not array', () => {
        expect(() => message.addSelect('title', 'name', 'static', 2, 'placeholder', false, 'value', [], 'asd'))
          .toThrowError('options needs to be a valid array');
        expect(() => message.addSelect('title', 'name', 'static', 2, 'placeholder', false, 'value', [], true))
          .toThrowError('options needs to be a valid array');
        expect(() => message.addSelect('title', 'name', 'static', 2, 'placeholder', false, 'value', [], false))
          .toThrowError('options needs to be a valid array');
        expect(() => message.addSelect('title', 'name', 'static', 2, 'placeholder', false, 'value', [], {}))
          .toThrowError('options needs to be a valid array');
      });


      it('should throw an error if you try to add more than 5 actions', () => {
        message.addSelect('I1', 'foo')
          .addSelect('I2', 'foo')
          .addSelect('I3', 'foo')
          .addSelect('I4', 'foo')
          .addSelect('I5', 'foo');
        expect(() => message.addSelect('Button', 'http://foo.bar')).toThrowError('You can not add more than 5 elements');
      });
    });
  });
});
