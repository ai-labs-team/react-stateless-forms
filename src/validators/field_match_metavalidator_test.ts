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

    beforeEach(() => {
      result = subject.validate('a different string', {
        password: 'one string',
        password_confirmation: 'a different string',
      });
    });

    it('returns an error on the first field provided in the constructor ' +
      'saying it does not match', () => {
      expect(result).to.eql(['Does not match']);
    });
  });

  describe('error conditions', () => {
    describe('when invalid keys are provided', () => {
      const subject = new FieldMatchMetavalidator('anything');

      beforeEach(() => {
        result = subject.validate('a value', {
          randomKey: 'something',
        });
      });

      it('validates with no errors', () => {
        expect(result).to.eql([]);
      });
    });

    describe('when invalid fields are provided', () => {
      const subject = new FieldMatchMetavalidator('matchKey');

      beforeEach(() => {
        result = subject.validate('a value', {});
      });

      it('validates with no errors', () => {
        expect(result).to.eql([]);
      });
    });
  });
});
