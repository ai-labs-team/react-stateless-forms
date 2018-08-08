import * as React from 'react';

import {
  FieldMatchMetavalidator,
  IsRequiredValidator,
  ValidatedForm,
  ValidatedSubmitButton,
  ValidatedTextInput,
  ValidationSet,
} from 'casium-forms';

const requiredInputsExample = () => {
  const validationSet = new ValidationSet({
    matchingField: [
      new IsRequiredValidator(),
      new FieldMatchMetavalidator('field', 'Must match')
    ],
  });

  return (
    <ValidatedForm validationSet={validationSet}>
      <ValidatedTextInput name='field' label='A Field'/>
      <ValidatedTextInput name='matchingField' label='This Field Must Match'/>
      <ValidatedSubmitButton key='submitBtn' value='Submit'/>
    </ValidatedForm>
  );
};

export default requiredInputsExample as React.SFC;
