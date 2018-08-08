export default class EmailValidator {

  public validate(email: string): string[] {
    return email && (/.*@.*/.test(email) === false) ? ['Not a valid email address (needs an @ symbol)'] : [];
  }
}
