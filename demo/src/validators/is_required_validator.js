class IsRequiredValidator {

  validate(value) {
    // eslint-disable-next-line no-undefined
    const invalidValues = ['', null, undefined, NaN, 'on'];
    if (invalidValues.includes(value)) {
      return [t('util.validation.isRequired')];
    }
    return [];
  }
}

export default IsRequiredValidator;
