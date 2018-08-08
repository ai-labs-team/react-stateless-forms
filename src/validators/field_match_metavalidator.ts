/*
* Given the key for a field to match against, checks if the provided value matches the current value of
* the match field.
*/
export default class FieldMatchMetavalidator {
  matchKey: string;
  errorMessage: string;

  constructor(matchKey, errorMessage) {
    this.matchKey = matchKey;
    this.errorMessage = errorMessage;
  }

  validate(value, fields) {
    const showError = !fields[this.matchKey] || value !== fields[this.matchKey];
    return showError ? [this.errorMessage] : [];
  }
}
