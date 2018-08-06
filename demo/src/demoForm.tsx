import * as React from 'react';

import {
  IsRequiredValidator,
  ValidatedForm,
  ValidatedSubmitButton,
  ValidatedTextInput,
  ValidationSet,
} from 'casium-forms';

const demoValidationSet = new ValidationSet({
  requiredInput: [new IsRequiredValidator()],
});

const DemoForm = () => (
  <ValidatedForm validationSet={demoValidationSet}>
    <ValidatedTextInput
      key='requiredInput'
      name='requiredInput'
      type='text'
      label='Required Text Input'
    />
    <div className='controls'>
      <ValidatedSubmitButton
        key='submitBtn'
        value='Submit'
      />
    </div>
  </ValidatedForm>
);

export default DemoForm;
