import * as React from 'react';

import {
  IsRequiredValidator,
  ValidatedForm,
  ValidatedSubmitButton,
  ValidatedTextInput,
  ValidationSet,
} from 'casium-forms';

const requiredInputsExample = () => {
  const validationSet = new ValidationSet({
    requiredInput: [new IsRequiredValidator()],
  });

  return (
    <ValidatedForm validationSet={validationSet}>
      <ValidatedTextInput name='optionalInput' label='Optional Field'/>
      <ValidatedTextInput name='requiredInput' label='Required Field'/>
      <ValidatedSubmitButton key='submitBtn' value='Submit'/>
    </ValidatedForm>
  );
};

export default requiredInputsExample as React.SFC;
