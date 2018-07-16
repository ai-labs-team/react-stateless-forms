class IsRequiredValidator {

  validate(value) {
    // eslint-disable-next-line no-undefined
    const invalidValues = ['', null, undefined, NaN, 'on'];
    if (invalidValues.includes(value)) {
      return ['This value is required.'];
    }
    return [];
  }
}

export default IsRequiredValidator;
