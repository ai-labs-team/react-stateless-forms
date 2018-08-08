import * as React from 'react';

import {
  ValidatedForm,
  ValidatedSubmitButton,
  ValidatedTextInput,
  ValidationSet,
} from 'casium-forms';

const errors = [{ error: 'Technical details here.', error_description: 'There was an error with your submission.' }];

const serverErrorsExample = () => (
  <ValidatedForm
    validationSet={new ValidationSet()}
    errors={errors}
  >
    <ValidatedTextInput name='field1' label='Form Field 1'/>
    <ValidatedSubmitButton key='submitBtn' value='Submit'/>
  </ValidatedForm>
);

export default serverErrorsExample as React.SFC;
