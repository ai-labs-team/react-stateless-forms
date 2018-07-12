// Warning!
//
// ValidatedForm attempts to recursively traverse the React node it is
// wrapping around, looking for children and children of children and
// so forth. That means that if you stuff an <Input> or a <Checkbox>
// in a subcomponent **as a non-child** it will be invisible to
// ValidatedForm and it will not hook into the fieldValues/error
// system. A simple example of something that you should avoid:
//
// const Section = () => <section><Checkbox ...></section>
// const MyForm = () => <ValidatedForm ...><Section /></ValidatedForm>
//
// In the above example the Checkbox will not be wrapped and you will
// end up mystified by the hidden machinations of the universe.

import React from 'react';
import PropTypes from 'prop-types';
import {
  pipe, all, has, isEmpty, isNil, flatten, map, uniq, values, merge, curry, defaultTo, is, any, keys, pickBy, path
} from 'ramda';
import ValidationSet from '../../utils/validation_set';
import { ValidatedFormErrorsPropType } from '../../utils/prop_types';
import ErrorBox from '../error_box';
import { withProps, cloneRecursive } from 'casium';
import IsRequiredValidator from '../../validators/is_required_validator';

export const hasRequiredValidator = any(is(IsRequiredValidator));
export const requiredFields = pipe(pickBy(hasRequiredValidator), keys);
const noErrors = errors => isEmpty(flatten(values(errors)));
const isFullyValidated = ({ fieldErrors, requiredKeys }) =>
  fieldErrors && all(key => has(key, fieldErrors), requiredKeys);

const isSubmittable = ({ submitting, fieldErrors, validators }) =>
  !submitting &&
  noErrors(fieldErrors) &&
  isFullyValidated({ fieldErrors, requiredKeys: requiredFields(validators) });

const validatedChildren =
  (children, { submitting, fieldErrors, onUpdate, fieldValues, validationSet: { validators } }) =>
    cloneRecursive(children, child => {
      if (!child || !child.type || !child.props) {
        return {};
      }
      const { props } = child;
      const key = child.key || props.name;

      const { formRole } = child.type;
      const toDisable = props.disabled ||
        (formRole && formRole.submit && !isSubmittable({ submitting, fieldErrors, validators }));
      const value = props.name ? path(props.name.split('.'), fieldValues) : undefined;
      const base = !isNil(value) ? { value } : {};
      let label = '';

      if (props.hasOwnProperty('label')) {
        label = (validators[key] || []).some(is(IsRequiredValidator)) ?
          `${props.label}${t('util.requiredFieldSuffix')}` :
          props.label;
      }

      return !formRole ? {} : merge(base, {
        key,
        errors: fieldErrors,
        disabled: toDisable,
        onValidate: pipe(merge(fieldValues), onUpdate),
        label,
      });
    });

const objToErrorMsg = obj => obj && obj.message || obj.error_description || obj;

const messageFromError = error => (
  <div key={error}>
    <ErrorBox>
      <p>{error}</p>
    </ErrorBox>
  </div>
);

const renderErrors = pipe(defaultTo([]), uniq, map(objToErrorMsg), map(messageFromError));

const handleSubmit = curry(({ submitting, fieldErrors, validKeys, fieldValues, onSubmit }, event) => {
  event.preventDefault();

  if (isSubmittable({ submitting, fieldErrors, validKeys })) {
    onSubmit(fieldValues);
  }
});

const newProps = {
  validKeys: ({ validationSet }) => validationSet.validatorKeys,
  fieldErrors: ({ validationSet, fieldValues }) => validationSet.validate(fieldValues),
};

const ValidatedForm = withProps(
  newProps,
  ({ validKeys, fieldErrors, fieldValues, submitting, onSubmit, onUpdate, children, errors, validationSet }) => (
    <div>
      { renderErrors(errors) }
      <form onSubmit={handleSubmit({ submitting, fieldErrors, validKeys, fieldValues, onSubmit })}>
        { validatedChildren(children, { submitting, fieldErrors, validKeys, onUpdate, fieldValues, validationSet }) }
      </form>
    </div>
));

ValidatedForm.propTypes = {
  fieldValues: PropTypes.object,
  errors: ValidatedFormErrorsPropType,
  onSubmit: PropTypes.func,
  onUpdate: PropTypes.func,
  submitting: PropTypes.bool,
  validationSet: PropTypes.instanceOf(ValidationSet),
  children: PropTypes.node,
};

ValidatedForm.defaultProps = {
  errors: [],
  fieldValues: {},
  onSubmit: () => {},
  onUpdate: () => {},
  submitting: false,
  validationSet: new ValidationSet(),
};

export default ValidatedForm;
