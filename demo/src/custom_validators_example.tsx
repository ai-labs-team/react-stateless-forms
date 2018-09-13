import * as React from 'react';

import {
  FieldMatchMetavalidator,
  IsRequiredValidator,
  ValidatedSubmitButton,
  ValidatedTextInput,
  ValidationSet,
} from 'react-stateless-forms';

import EmailValidator from './validators/email_validator';
import StringLengthValidator from './validators/string_length_validator';

import ValidatedFormContainer from './validated_form_container';

const customValidatorsExample = () => {
  const validationSet = new ValidationSet({
    email: [new EmailValidator(), new IsRequiredValidator()],
    name: [new StringLengthValidator({ minLength: 3, maxLength: 8 }), new IsRequiredValidator()],
    nameConfirm: [new FieldMatchMetavalidator('name', 'Must match'), new IsRequiredValidator()],
  });

  return (
    <ValidatedFormContainer validationSet={validationSet}>
      <ValidatedTextInput name='email' label='Email address'/>
      <ValidatedTextInput name='name' label='Enter your name'/>
      <ValidatedTextInput name='nameConfirm' label='Enter your name again'/>
      <ValidatedSubmitButton name='submitBtn' value='Submit'/>
    </ValidatedFormContainer>
  );
};

export default customValidatorsExample as React.SFC;
