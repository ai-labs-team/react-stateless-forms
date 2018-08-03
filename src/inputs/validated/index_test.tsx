/* eslint-env node, mocha */
import * as React from 'react';
import { expect } from 'chai';
import { before } from 'mocha';
import { shallow } from 'enzyme';


import Validated from './';
import TextInput from '../formatted_input/text_input';

const ValidatedInput = Validated(TextInput);

describe('Validated', () => {
  let wrapper, errors;

  beforeEach(() => {
    wrapper = shallow(<ValidatedInput type='text' name='testInput' errors={errors} />);
  });

  describe('when errors are present', () => {
    before(() => {
      errors = { testInput: ['has errors', 'has more errors'] };
    });

    it('displays the first error in the DOM', () => {
      expect(wrapper).to.contain.text('has errors');
      expect(wrapper.find('p').length).to.equal(1);
    });
  });

  describe('when errors are not present', () => {

    const itDoesNotDisplayErrors = () => {
      it('does not display the errors in the DOM', () => {
        expect(wrapper).not.to.contain.text('has errors');
        expect(wrapper.find('span')).to.be.empty;
      });
    };

    describe('and errors are present on other inputs', () => {
      before(() => {
        errors = { anotherInput: ['has errors'] };
      });

      itDoesNotDisplayErrors();
    });

    describe('on this input', () => {
      before(() => {
        errors = { testInput: [] };
      });

      itDoesNotDisplayErrors();
    });
  });
});
