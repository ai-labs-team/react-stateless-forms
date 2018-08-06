import { isNil, reject } from 'ramda';

export type ValidatorConfig =
  { minLength: number; } |
    { maxLength: number; } |
    { minLength: number; maxLength: number };

export default class StringLengthValidator {

  public maxLength?: number;
  public minLength?: number;

  constructor(props: ValidatorConfig) {
    Object.assign(this, props);
  }

  public validate(string: any): any {
    return (string !== null && string !== undefined) ? reject(isNil, [
      this.validateMinLength(string.length),
      this.validateMaxLength(string.length),
    ]) : [];
  }

  public validateMinLength(value: number): any {
    if (this.minLength && value < this.minLength) {
      return `Must be at least ${ this.minLength } characters`;
    }
  }

  public validateMaxLength(value: number):any {
    if (this.maxLength && value > this.maxLength) {
      return `Cannot be more than ${ this.maxLength } characters`;
    }
  }
}
