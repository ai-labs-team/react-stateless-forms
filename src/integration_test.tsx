import * as React from 'react';

import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it, before } from 'mocha';

import TextInput from './inputs/formatted_input/text_input';
import SubmitButton from './inputs/submit_button';
import ValidatedSubmit from './inputs/validated_submit';
import Validated from './inputs/validated';
import ValidatedForm from './validated_form';
import ValidationSet from './validation_set';

import IsRequiredValidator from './validators/is_required_validator';
import FieldMatchMetavalidator from './validators/field_match_metavalidator';

const ValidatedSubmitButton = ValidatedSubmit(SubmitButton);
const ValidatedTextInput = Validated(TextInput);

const testForm = (props) => (
  <ValidatedForm {...props}>
    <ValidatedTextInput name='fieldA' />
    <ValidatedTextInput name='fieldB' />
    <ValidatedSubmitButton type='submit' />
  </ValidatedForm>
);

describe('Full integration test', () => {
  let wrapper;

  const validationSet = new ValidationSet({
    fieldA: [new IsRequiredValidator()],
    fieldB: [
      new FieldMatchMetavalidator('fieldA'),
      new IsRequiredValidator(),
    ],
  });

  describe('entering invalid inputs', () => {
    before(() => {
      wrapper = mount(
        testForm({
          validationSet,
          fieldValues: {
            fieldA: '',
            fieldB: 'some other input value',
          }
        })
      );
    });

    it('indicates invalid fields', () => {
      expect(wrapper).to.contain.text('This value is required');
      expect(wrapper).to.contain.text('Does not match');
    });

    it('presents submit button as disabled', () => {
      expect(wrapper.find('input[type="submit"]')).to.have.attr('disabled');
    });
  });

  describe('entering valid inputs', () => {
    before(() => {
      wrapper = mount(
        testForm({
          validationSet,
          fieldValues: {
            fieldA: 'an input value',
            fieldB: 'an input value',
          }
        })
      );
    });

    it('does not indicate invalid fields', () => {
      expect(wrapper).not.to.contain.text('This value is required');
      expect(wrapper).not.to.contain.text('Does not match');
    });

    it('presents submit button as enabled', () => {
      expect(wrapper.find('input[type="submit"]')).to.not.have.attr('disabled');
    });
  });
});
