import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';

import ValidationSet from './';
import FieldMatchMetavalidator from '../validators/field_match_metavalidator';

class MinLengthValidator {
  public length?: number;

  constructor(length) { this.length = length; }

  public validate(string: any): any {
    return string.length < this.length ? ['string is too short'] : [];
  }
}

class MaxLengthValidator {
  public length?: number;

  constructor(length) { this.length = length; }

  public validate(string: any): any {
    return string.length > this.length ? ['string is too long'] : [];
  }
}

const EmailValidator = {
  validate: (email) => email && (/.*@.*/.test(email) === false) ? ['Not a valid email address'] : [],
}

export default EmailValidator;


describe('ValidationSet', () => {
  let result;

  describe('when no validations are provided', () => {
    const subject = new ValidationSet();

    it('returns an empty errors hash', () => {
      expect(subject.validate({})).to.eql({});
    });
  });

  describe('when a single validation is specified on a single key', () => {
    const subject = new ValidationSet({ input1: [new MinLengthValidator(10)] });

    describe('when the input in invalid', () => {
      beforeEach(() => {
        result = subject.validate({ input1: 'too short' });
      });

      it('returns a non-empty error hash', () => {
        expect(result).to.not.eql({});
      });

      it('provides a key for value1 in the error hash', () => {
        expect(result.input1).to.not.be.undefined;
      });

      it('provdes an error message in the error hash at the key for value1', () => {
        expect(result.input1.length).to.eql(1);
      });
    });

    describe('when the input is valid', () => {
      it('returns an errors hash with no errors on input1', () => {
        result = subject.validate({ input1: 'plenty long enough!' });
        return expect(result).to.eql({ input1: [] });
      });
    });
  });

  describe('when multiple validations are specified on a single key', () => {
    const subject = new ValidationSet({
      input1: [
        new MaxLengthValidator(2),
        EmailValidator,
      ],
    });

    describe('when the input in invalid', () => {
      beforeEach(() => {
        result = subject.validate({ input1: 'long and not an email address' });
      });

      it('returns a non-empty error hash', () => {
        expect(result).to.not.eql({});
      });

      it('provides a key for value1 in the error hash', () => {
        expect(result.input1).to.not.be.undefined;
      });

      it('provdes two error messages in the error hash at the key for value1', () => {
        expect(result.input1.length).to.eql(2);
      });
    });
  });

  describe('when single validations are specified on multiple keys', () => {
    const subject = new ValidationSet({
      email: [EmailValidator],
      password: [new MinLengthValidator(8)],
    });

    describe('when the input in invalid', () => {
      beforeEach(() => {
        result = subject.validate({ email: 'bad', password: 'short' });
      });

      it('provides keys for email and password in the error hash', () => {
        expect(result.email).to.not.be.undefined;
        expect(result.password).to.not.be.undefined;
      });

      it('provides error messages in hash for email and password', () => {
        expect(result.email.length).to.eql(1);
        expect(result.password.length).to.eql(1);
      });
    });

    describe('when the input is valid', () => {
      it('returns all keys with no errors', () => {
        result = subject.validate({ email: 'good@good.com', password: 'a nice long password' });
        expect(result).to.eql({ email: [], password: [] });
      });
    });
  });

  describe('when validation is performed on keys that have no configured validators', () => {
    const subject = new ValidationSet({
      key1: [EmailValidator],
      key2: [EmailValidator],
    });

    it('returns an empty errors hash', () => {
      expect(subject.validate({ differentKey: 'some value' })).to.eql({});
    });
  });

  describe('metavalidation', () => {
    describe('when done in isolation', () => {
      const subject = new ValidationSet({
        password_confirmation: [new FieldMatchMetavalidator('password', 'an error message')],
      });

      it('provides a key for password_confirmation in the error hash', () => {
        result = subject.validate({
          password: 'some value',
          password_confirmation: 'some other value',
        });
        expect(result.password_confirmation).to.not.be.undefined;
        expect(result.password_confirmation.length).to.eql(1);
      });
    });

    describe('when done with standard validations', () => {
      const validations = {
        password: [new MinLengthValidator(100)],
        password_confirmation: [
          new MaxLengthValidator(1),
          new FieldMatchMetavalidator('password', 'an error message'),
        ],
      };
      const subject = new ValidationSet(validations);

      beforeEach(() => {
        result = subject.validate({
          password: 'tooshort',
          password_confirmation: 'too long and different',
        });
      });

      it('provides an error for password', () => {
        expect(result.password).to.eql(['string is too short']);
      });

      it('provides two errors for password_confirmation', () => {
        expect(result.password_confirmation).to.eql([
          'string is too long',
          'an error message',
        ]);
      });
    });

    describe('when there are no errors', () => {
      const subject = new ValidationSet({
        password_confirmation: [new FieldMatchMetavalidator('password', 'an error message')],
      });

      beforeEach(() => {
        result = subject.validate({ password: 'too short', password_confirmation: 'too short' });
      });

      it('returns a key for the validated field with an empty error array', () => {
        expect(result.password_confirmation).to.eql([]);
      });
    });
  });

  describe('#toValidate', () => {
    const key1Validators = [
      new MaxLengthValidator(1),
      new FieldMatchMetavalidator('key2', 'an error message'),
    ];
    const key2Validator = [new MaxLengthValidator(1)];
    const subject = new ValidationSet({
      key1: key1Validators,
      key2: key2Validator,
      key3: [new FieldMatchMetavalidator('key1', 'an error message')],
    });

    it('ignores fields that are in validators but not passed in', () => {
      expect(subject.toValidate({})).to.eql({});
    });

    it('ignores fields that are in passed in but not in validators', () => {
      expect(subject.toValidate({ key4: 'hi' })).to.eql({});
    });

    it('returns the set of fields that are validated by a validator in the provided list', () => {
      expect(subject.toValidate({ key1: 'hi', key2: 'hello' })).to.eql({
        key1: key1Validators,
        key2: key2Validator,
      });
    });
  });

  describe('#validateField', () => {
    const subject = new ValidationSet({
      key1: [
        new MinLengthValidator(1),
        new FieldMatchMetavalidator('key2', 'an error message'),
      ],
      key2: [new MinLengthValidator(1)],
      key3: [new FieldMatchMetavalidator('key1', 'an error message')],
    });

    it('returns no errors for a valid field', () => {
      expect(subject.validateField({ key2: 'hi' }, subject.validators['key2'], 'key2')).to.eql([]);
    });

    it('returns an error in an array for an invalid field', () => {
      expect(subject.validateField({ key2: '' }, subject.validators['key2'], 'key2').length).to.eql(1);
    });

    it('returns an array of errors for a field with multiple problems', () => {
      expect(subject.validateField(
        { key1: '', key2: 'h' },
        subject.validators['key1'],
        'key1'
      ).length).to.eql(2);
    });
  });
});
