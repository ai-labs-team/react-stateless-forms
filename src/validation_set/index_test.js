/* eslint-env node, mocha */

import ValidationSet from './validation_set';
import StringLengthValidator from './validators/string_length_validator';
import EmailValidator from './validators/email_validator';
import FieldMatchMetavalidator from './validators/field_match_metavalidator';

describe('ValidationSet', () => {
  let result;

  describe('when no validations are provided', () => {
    const subject = new ValidationSet();

    it('returns an empty errors hash', () => {
      expect(subject.validate({})).to.eql({});
    });
  });

  describe('when a single validation is specified on a single key', () => {
    const subject = new ValidationSet({ input1: [new StringLengthValidator({ minLength: 10 })] });

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
        new StringLengthValidator({ maxLength: 2 }),
        new EmailValidator(),
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
      email: [new EmailValidator()],
      password: [new StringLengthValidator({ minLength: 8 })],
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
      key1: [new EmailValidator()],
      key2: [new EmailValidator()],
    });

    it('returns an empty errors hash', () => {
      expect(subject.validate({ differentKey: 'some value' })).to.eql({});
    });
  });

  describe('metavalidation', () => {
    describe('when done in isolation', () => {
      const subject = new ValidationSet({
        password_confirmation: [new FieldMatchMetavalidator('password')],
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
        password: [new StringLengthValidator({ minLength: 100 })],
        password_confirmation: [
          new StringLengthValidator({ maxLength: 1 }),
          new FieldMatchMetavalidator('password'),
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
        expect(result.password).to.eql(['Must be at least 100 characters']);
      });

      it('provides two errors for password_confirmation', () => {
        expect(result.password_confirmation).to.eql([
          'Cannot be more than 1 characters',
          'Does not match',
        ]);
      });
    });

    describe('when there are no errors', () => {
      const subject = new ValidationSet({
        password_confirmation: [new FieldMatchMetavalidator('password')],
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
      new StringLengthValidator({ maxLength: 1 }),
      new FieldMatchMetavalidator('key2'),
    ];
    const key2Validator = [new StringLengthValidator({ maxLength: 1 })];
    const subject = new ValidationSet({
      key1: key1Validators,
      key2: key2Validator,
      key3: [new FieldMatchMetavalidator('key1')],
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
        new StringLengthValidator({ minLength: 1 }),
        new FieldMatchMetavalidator('key2'),
      ],
      key2: [new StringLengthValidator({ minLength: 1 })],
      key3: [new FieldMatchMetavalidator('key1')],
    });

    it('returns no errors for a valid field', () => {
      expect(subject.validateField({ key2: 'hi' }, subject.validators.key2, 'key2')).to.eql([]);
    });

    it('returns an error in an array for an invalid field', () => {
      expect(subject.validateField({ key2: '' }, subject.validators.key2, 'key2').length).to.eql(1);
    });

    it('returns an array of errors for a field with multiple problems', () => {
      expect(subject.validateField(
        { key1: '', key2: 'h' },
        subject.validators.key1,
        'key1'
      ).length).to.eql(2);
    });
  });
});
