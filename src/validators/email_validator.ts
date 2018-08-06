class EmailValidator {

  validate(email) {
    if (email && (/.*@.*/.test(email) === false)) {
      return ['Not a valid email address'];
    }
    return [];
  }
}

export default EmailValidator;
