import { any, isNil } from 'ramda';

/*
* Given the key for a field, will validate that the value provided against the value of
* that field to see if they match.
*
* Any errors will show on the field that the validator is associated with in the validation
* set object - that is, the field whose value is passed to `validate`.
*/
class FieldMatchMetavalidator {
  matchKey: string;

  constructor(matchKey) {
    this.matchKey = matchKey;
  }

  validate(value, fields) {
    const showError = this.valuesPresent(value, fields) && value !== fields[this.matchKey];
    return showError ? ['Does not match'] : [];
  }

  valuesPresent(value, fields) {
    return !any(isNil, [this.matchKey, value, fields[this.matchKey]]);
  }
}

export default FieldMatchMetavalidator;
