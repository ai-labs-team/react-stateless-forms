import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';

import EmailValidator from './email_validator';

describe('EmailValidator', () => {
  let result;
  const subject = new EmailValidator();

  describe('when the string does not contain an @ symbol', () => {
    beforeEach(() => { result = subject.validate('somebademail'); });

    it('validates with an error', () => {
      expect(result).to.eql(['Not a valid email address']);
    });
  });

  describe('when the string contains an @ symbol', () => {
    beforeEach(() => { result = subject.validate('someone@somewhere'); });

    it('validates without errors', () => {
      expect(result).to.eql([]);
    });
  });

  describe('when the string is empty', () => {
    beforeEach(() => { result = subject.validate(''); });

    it('validates without errors', () => {
      expect(result).to.eql([]);
    });
  });
});
