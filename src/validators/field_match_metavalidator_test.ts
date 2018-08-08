import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';

import FieldMatchMetavalidator from './field_match_metavalidator';

describe('FieldMatchMetavalidator', () => {
  let result;

  describe('when the fields match', () => {
    const subject = new FieldMatchMetavalidator('password');

    beforeEach(() => {
      result = subject.validate('my password', {
        password: 'my password',
        password_confirmation: 'my password',
      });
    });

    it('validates with no errors', () => {
      expect(result).to.eql([]);
    });
  });

  describe('when the fields do not match', () => {
    const subject = new FieldMatchMetavalidator('password');

    describe('and the test field is included in the provided fields', () => {
      beforeEach(() => {
        result = subject.validate('a different string', {
          password: 'one string',
          password_confirmation: 'a different string',
        });
      });

      it('returns an error on the first field provided in the constructor saying it does not match', () => {
        expect(result).to.eql(['Does not match']);
      });
    });

    describe('and the test field is not included', () => {
      beforeEach(() => {
        result = subject.validate('test value is missing!', {
          password_confirmation: 'I do not validate no matter what value I take',
        });
      });

      it('also returns a validation error', () => {
        expect(result).to.eql(['Does not match']);
      });
    });
  });
});
