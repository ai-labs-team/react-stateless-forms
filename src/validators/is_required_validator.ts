export default class IsRequiredValidator {

  validate(value) {
    const invalidValues = ['', null, undefined, NaN, 'on'];
    return invalidValues.includes(value) ? ['This value is required.'] : [];
  }
}
