/* eslint-env node, mocha */
import IsRequiredValidator from './is_required_validator';

describe('IsRequiredValidator', () => {
  let result;

  describe('validation fails when the provided field is in an empty state', () => {
    const subject = new IsRequiredValidator();
    let testValue;

    beforeEach(() => {
      result = subject.validate(testValue);
    });

    const itProvidesValidErrors = () => {
      it('returns a non-empty errors array and a descriptive error string', () => {
        expect(result.length).not.to.eql(0);
        expect(result[0]).to.eql('Required field');
      });
    };

    describe('when the provided string is null', () => {
      before(() => { testValue = null; });
      itProvidesValidErrors();
    });

    describe('when the provided string is the empty string', () => {
      before(() => { testValue = ''; });
      itProvidesValidErrors();
    });

    describe('when the provided string is undefined', () => {
      // eslint-disable-next-line no-undefined
      before(() => { testValue = undefined; });
      itProvidesValidErrors();
    });

    describe('when the provided string is NaN', () => {
      before(() => { testValue = Number.NaN; });
      itProvidesValidErrors();
    });
  });

  describe('validation passes when the provided field is in a non-empty state', () => {
    const subject = new IsRequiredValidator();
    let testValue;

    beforeEach(() => {
      result = subject.validate(testValue);
    });

    const itHasNoErrors = () => {
      it('returns an empty errors array indicating it is valid', () => {
        expect(result.length).to.eql(0);
      });
    };

    describe('when the provided string would fail a basic falsiness test', () => {
      describe('when the provided string is the value zero', () => {
        before(() => { testValue = 0; });
        itHasNoErrors();
      });

      describe('when the provided string is the value false', () => {
        before(() => { testValue = false; });
        itHasNoErrors();
      });

      describe('when the provided string is the string literal "undefined"', () => {
        before(() => { testValue = 'undefined'; });
        itHasNoErrors();
      });

      describe('when the provided string is the string literal "NaN"', () => {
        before(() => { testValue = 'NaN'; });
        itHasNoErrors();
      });
    });
  });
});
