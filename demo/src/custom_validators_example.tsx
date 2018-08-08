import * as React from 'react';

import {
  FieldMatchMetavalidator,
  ValidatedForm,
  ValidatedSubmitButton,
  ValidatedTextInput,
  ValidationSet,
} from 'casium-forms';

import EmailValidator from './validators/email_validator';
import StringLengthValidator from './validators/string_length_validator';

const customValidatorsExample = () => {
  const validationSet = new ValidationSet({
    email: [new EmailValidator()],
    name: [new StringLengthValidator({ minLength: 3, maxLength: 8 })],
    nameConfirm: [new FieldMatchMetavalidator('name', 'Must match')],
  });

  return (
    <ValidatedForm validationSet={validationSet}>
      <ValidatedTextInput key='email' label='Email address'/>
      <ValidatedTextInput key='name' label='Enter your name'/>
      <ValidatedTextInput key='nameConfirm' label='Enter your name again'/>
      <ValidatedSubmitButton key='submitBtn' value='Submit'/>
    </ValidatedForm>
  );
};

export default customValidatorsExample as React.SFC;
