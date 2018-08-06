/* eslint-env node, mocha */
import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';

import StringLengthValidator from './string_length_validator';

describe('StringLengthValidator', () => {
  let result;

  describe('validating minimum length', () => {
    const subject = new StringLengthValidator({ minLength: 5 });

    describe('when the provided string is invalid', () => {
      beforeEach(() => {
        result = subject.validate('a');
      });

      it('returns a non-empty errors array', () => {
        expect(result.length).not.to.eql(0);
      });

      it('returns a descriptive error string', () => {
        expect(result[0]).to.eql('Must be at least 5 characters');
      });
    });

    describe('when the provided string is valid', () => {
      beforeEach(() => {
        result = subject.validate('a string longer than 5 chars');
      });

      it('returns an empty errors array indicating it is valid', () => {
        expect(result.length).to.eql(0);
      });
    });
  });

  describe('validating maximum length', () => {
    const subject = new StringLengthValidator({ maxLength: 6 });

    describe('when the provided string is invalid', () => {
      beforeEach(function() {
        result = subject.validate('a string that is too long');
      });

      it('returns a non-empty errors array', () => {
        expect(result.length).not.to.eql(0);
      });

      it('returns a descriptive error string', () => {
        expect(result[0]).to.eql('Cannot be more than 6 characters');
      });
    });

    describe('when the provided string is valid', () => {
      beforeEach(() => {
        result = subject.validate('short');
      });

      it('returns an empty errors array indicating it is valid', () => {
        expect(result.length).to.eql(0);
      });
    });
  });

  describe('combining validation errors', () => {
    const subject = new StringLengthValidator({ minLength: 4, maxLength: 2 });

    beforeEach(() => {
      result = subject.validate('abc');
    });

    it('returns an array with multiple errors', () => {
      expect(result.length).to.eql(2);
    });
  });

  describe('when a property does not exist', () => {
    describe('validating a null string', () => {
      const subject = new StringLengthValidator({ minLength: 4, maxLength: 4 });

      beforeEach(() => {
        result = subject.validate(null);
      });

      it('returns an empty errors array indicating it is valid', () => {
        expect(result.length).to.eql(0);
      });
    });

    describe('validating an undefined string', () => {
      const subject = new StringLengthValidator({ minLength: 4, maxLength: 4 });

      beforeEach(() => {
        result = subject.validate(undefined);
      });

      it('returns an empty errors array indicating it is valid', () => {
        expect(result.length).to.eql(0);
      });
    });
  });
});
