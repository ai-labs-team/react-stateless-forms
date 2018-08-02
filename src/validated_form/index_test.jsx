/* eslint-env node, mocha */

import React from 'react';
import SubmitButton from 'components/inputs/submit_button';
import ValidatedSubmit from 'components/inputs/validated_submit';
import Validated from 'components/inputs/validated';
import ValidationSet from 'utils/validation_set';
import IsRequiredValidator from 'utils/validators/is_required_validator';

import ValidatedForm, { hasRequiredValidator, requiredFields } from './';

const ValidatedSubmitButton = ValidatedSubmit(SubmitButton);
const ValidatedTextInput = Validated('input');

describe('ValidatedForm', () => {

  describe('#onSubmit', () => {

    it('calls onSubmit with the fields in the form', () => {
      const onSubmitSpy = sinon.spy();
      const wrapper = shallow(<ValidatedForm
        validationSet={new ValidationSet()}
        onSubmit={onSubmitSpy}
        fieldValues={{ someField: 'some value' }} />);
      const form = wrapper.find('form').first();
      form.simulate('submit', { preventDefault: () => { } });

      expect(onSubmitSpy).to.have.been.calledWith({ someField: 'some value' });
    });
  });

  describe('disabling or enabling submit on validation status', () => {
    let validationSetMock, subject, wrapper;

    beforeEach(() => {
      subject = (<ValidatedForm validationSet={validationSetMock}>
        <ValidatedTextInput id='input1' type='text' />
        <ValidatedTextInput id='input2' type='text' />
        <ValidatedSubmitButton value='Submit' />
      </ValidatedForm>);
      wrapper = mount(subject);
    });

    describe('initial state with no validation errors', () => {
      before(() => {
        validationSetMock = {
          validate: () => { },
          validatorKeys: () => ([]),
        };
      });

      it('disables submit inputs', () => {
        expect(wrapper.find('input[type="submit"]')).to.have.attr('disabled');
      });
    });

    describe('one validation error and one unvalidated input', () => {
      before(() => {
        validationSetMock = {
          validate: () => ({ input1: ['error'] }),
          validatorKeys: () => (['input1']),
        };

      });

      it('disables submit inputs', () => {
        expect(wrapper.find('input[type="submit"]')).to.have.attr('disabled');
      });
    });

    describe('no validation errors and no unvalidated inputs', () => {
      before(() => {
        validationSetMock = {
          validate: () => ({ input1: [], input2: [] }),
          validatorKeys: () => (['input1', 'input2']),
        };
      });

      it('enables submit inputs', () => {
        expect(wrapper.find('input[type="submit"]')).to.not.have.attr('disabled');
      });
    });
  });

  describe('disabling submit when in "submitting" state', () => {
    const onSubmitSpy = sinon.spy();
    const subject = (<ValidatedForm submitting onSubmit={onSubmitSpy}>
      <ValidatedTextInput type='text' />
      <ValidatedSubmitButton value='Submit' />
    </ValidatedForm>);
    const wrapper = mount(subject);

    describe('preventing submit events', () => {
      before(() => {
        const form = wrapper.find('form').first();
        form.simulate('submit', { preventDefault: () => { } });
      });

      it('does not call the method provided via the onSubmit prop', () => {
        expect(onSubmitSpy).not.to.have.been.called;
      });
    });

    describe('disabling input elements', () => {
      it('presents submit input in disabled state', () => {
        expect(wrapper.find('input[type="submit"]')).to.have.attr('disabled');
      });

      it('does not present non-submit input in disabled state', () => {
        expect(wrapper.find('input[type="text"]')).to.not.have.attr('disabled');
      });
    });
  });

  describe('displaying backend errors', () => {
    let errors, subject, wrapper;

    beforeEach(() => {
      subject = <ValidatedForm errors={errors} />;
      wrapper = mount(subject);
    });

    describe('when only a single error is provided', () => {
      before(() => {
        errors = ['so sorry, you blew it'];
      });

      it('displays the error', () => {
        expect(wrapper).to.contain.text(errors.error);
        expect(wrapper).to.contain.text(errors.error_description);
      });
    });

    describe('when multiple errors are provided', () => {
      before(() => {
        errors = [
          { error: 'so sorry', error_description: 'you blew it' },
          { error: 'I knew it', error_description: 'too good to be true' },
        ];
      });

      it('displays the errors', () => {
        expect(wrapper).to.contain.text(errors[0].error_description);
        expect(wrapper).to.contain.text(errors[1].error_description);
      });
    });
  });

  describe('handles nested validated inputs and nested validated submit button', () => {
    let validationSetMock, subject, wrapper;

    beforeEach(() => {
      subject = (<ValidatedForm validationSet={validationSetMock}>
        <div>
          <section>
            <ValidatedTextInput id='input1' type='text' />
            <ValidatedTextInput id='input2' type='text' />
          </section>
        </div>
        <div>
          <section>
            <ValidatedSubmitButton value='Submit' />
          </section>
        </div>
      </ValidatedForm>);
      wrapper = mount(subject);
    });

    describe('one validation error and one unvalidated input', () => {
      before(() => {
        validationSetMock = {
          validate: () => ({ input1: ['error'] }),
          validatorKeys: () => (['input1']),
        };
      });

      it('disables submit inputs', () => {
        expect(wrapper.find('input[type="submit"]')).to.have.attr('disabled');
      });
    });

    describe('initial state with no validation errors', () => {
      before(() => {
        validationSetMock = {
          validate: () => { },
          validatorKeys: () => ([]),
        };
      });

      it('disables submit inputs', () => {
        expect(wrapper.find('input[type="submit"]')).to.have.attr('disabled');
      });
    });
  });

  describe('allowing submit when non-required fields have not been validated', () => {

    describe('#hasRequiredValidator', () => {
      const required = new IsRequiredValidator();
      const optional = { validate: () => [] };
      describe('when no validators are provided', () => {
        it('indicates none are required', () => {
          expect(hasRequiredValidator([])).to.equal(false);
        });
      });

      describe('when a single required validator is provided', () => {
        it('indicates a required validator is present', () => {
          expect(hasRequiredValidator([required])).to.equal(true);
        });
      });

      describe('when a single optional validator is provided', () => {
        it('indicates required validators are not present', () => {
          expect(hasRequiredValidator([optional])).to.equal(false);
        });
      });

      describe('when optional and required validators are provided', () => {
        it('indicates a required validator is present', () => {
          expect(hasRequiredValidator([optional, required])).to.equal(true);
        });
      });
    });

    describe('requiredFields', () => {
      const optional = [{ validate: () => [] }];
      const required = [new IsRequiredValidator()];
      describe('when no fields are provided', () => {
        it('returns an empty array', () => {
          expect(requiredFields({})).to.deep.equal([]);
        });
      });

      describe('when one optional and one required are provided', () => {
        it('returns only the required field wrapped in an array', () => {
          expect(requiredFields({ optional, required })).to.deep.equal(['required']);
        });
      });
    });
  });
});
