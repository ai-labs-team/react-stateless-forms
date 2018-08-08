import * as React from 'react';

import {
  IsRequiredValidator,
  ValidatedSubmitButton,
  ValidatedTextInput,
  ValidationSet,
} from 'casium-forms';

import ValidatedFormContainer from './validated_form_container';

const requiredInputsExample = () => {
  const validationSet = new ValidationSet({
    requiredInput: [new IsRequiredValidator()],
  });

  return (
    <ValidatedFormContainer validationSet={validationSet}>
      <ValidatedTextInput name='optionalInput' label='Optional Field'/>
      <ValidatedTextInput name='requiredInput' label='Required Field'/>
      <ValidatedSubmitButton key='submitBtn' value='Submit'/>
    </ValidatedFormContainer>
  );
};

export default requiredInputsExample as React.SFC;
