import { curry, flatten, keys, map, mapObjIndexed, path, pick } from 'ramda';

import { dottedPaths } from '../utilities';

/*
  Multi-validation aggregator for forms.
  Initialize with a hash matching keys with arrays of validations to apply to each key:

    new ValidationSet({
      username: [new StringLengthValidator(...)],
      email: [new EmailValidator(), ...]
      password_confirmation: [new FieldMatchMetavalidator('password')]
    });

  Then you can validate a hash of items en masse:

    validationSet.validate({ username: 'a', email: 'blahblah' })

  This will return a hash of validation errors associated with each key, as defined
  by each validator that was originally supplied to the set:

    { username: ['Too short'],
      email: ['Not a valid email'],
      password_confirmation: ['Does not match'] }
*/
class ValidationSet {
  validators: {};
  validatorKeys: never[];

  constructor(validators = {}) {
    this.validators = validators;
    this.validatorKeys = keys(validators);
  }

  validate(fields) {
    return mapObjIndexed(curry(this.validateField)(fields), this.toValidate(fields));
  }

  toValidate(fields) {
    return pick(dottedPaths(fields), this.validators);
  }

  validateField(fields, validatorsForField, fieldName) {
    const value = path(fieldName.split('.'), fields);

    return flatten(map(
      validator => validator.validate(value, fields),
      validatorsForField
    ));
  }
}

export default ValidationSet;
