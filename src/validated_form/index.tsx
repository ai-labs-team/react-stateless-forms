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

import * as React from 'react';
import {
  pipe, all, has, isEmpty, isNil, flatten, map, uniq, values, merge, curry, defaultTo, is, any, keys, pickBy, path
} from 'ramda';
import ValidationSet from '../validation_set';
import ErrorBox from '../error_box';
import { withProps, cloneRecursive } from 'casium';
import IsRequiredValidator from '../validators/is_required_validator';

export const hasRequiredValidator = any(is(IsRequiredValidator));
export const requiredFields = pipe(pickBy(hasRequiredValidator), keys);
const noErrors = errors => isEmpty(flatten(values(errors)));
const isFullyValidated = ({ fieldErrors, requiredKeys }) =>
  fieldErrors && all(key => has(key as string, fieldErrors), requiredKeys);

const isSubmittable = ({ submitting, fieldErrors, validators }) =>
  !submitting &&
    noErrors(fieldErrors) &&
    isFullyValidated({ fieldErrors, requiredKeys: requiredFields(validators) });

const validatedChildren =
  (children, { submitting, fieldErrors, onUpdate, fieldValues, validators }) =>
    cloneRecursive(children, child => {
      if (!child || !child.type || !child.props) { return {}; }

      const { props } = child;
      const key = child.key || props.name;

      const { formRole } = child.type;
      const toDisable = props.disabled ||
        (formRole && formRole.submit && !isSubmittable({ submitting, fieldErrors, validators }));
      const value = props.name ? path(props.name.split('.'), fieldValues) : undefined;
      const base = !isNil(value) ? { value } : {};
      let label = '';

      if (props.hasOwnProperty('label')) {
        label = (validators[key] || []).some(is(IsRequiredValidator)) ? `${props.label}*` : props.label;
      }

      return !formRole ? {} : merge(base, {
        key,
        errors: fieldErrors,
        disabled: toDisable,
        onValidate: pipe(merge(fieldValues), onUpdate),
        label,
      });
    });

const objToErrorMsg = obj => obj && obj.error_description || obj;

const messageFromError = (error) => (
  <div key={error}>
    <ErrorBox children={<p>{`${error }`}</p>} />
  </div>
);

const renderErrors = pipe(defaultTo([]), uniq, map(objToErrorMsg), map(messageFromError));

const handleSubmit = curry(({ submitting, fieldErrors, validators, fieldValues, onSubmit }, event) => {
  (event as Event).preventDefault();

  if (isSubmittable({ submitting, fieldErrors, validators })) {
    onSubmit(fieldValues);
  }
});

type ValidatedFormProps = {
  fieldValues?: {};
  errors?: Array<{error: string; error_description: string} | string>;
  onSubmit?: (msg?: any) => void;
  onUpdate?: (msg?: any) => void;
  submitting?: boolean;
  validationSet: ValidationSet,
  children?: React.ReactNode,
};

const ValidatedForm = withProps<ValidatedFormProps, any>(
  {
    fieldErrors: ({ validationSet, fieldValues }) => validationSet.validate(fieldValues),
  },
  ({
    fieldErrors = {},
    fieldValues = {},
    submitting = false,
    onSubmit = () => {},
    onUpdate = () => {},
    children,
    errors,
    validationSet: { validators },
  }) => (
    <div>
      { renderErrors(errors) }
      <form onSubmit={handleSubmit({ submitting, fieldErrors, validators, fieldValues, onSubmit })}>
        { validatedChildren(children, { submitting, fieldErrors, onUpdate, fieldValues, validators }) }
      </form>
    </div>
));

export default ValidatedForm;
