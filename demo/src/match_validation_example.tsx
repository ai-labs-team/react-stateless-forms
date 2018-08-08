import * as React from 'react';

import {
  FieldMatchMetavalidator,
  IsRequiredValidator,
  ValidatedSubmitButton,
  ValidatedTextInput,
  ValidationSet,
} from 'casium-forms';

import ValidatedFormContainer from './validated_form_container';

const requiredInputsExample = () => {
  const validationSet = new ValidationSet({
    matchingField: [
      new IsRequiredValidator(),
      new FieldMatchMetavalidator('field', 'Must match')
    ],
  });

  return (
    <ValidatedFormContainer validationSet={validationSet}>
      <ValidatedTextInput name='field' label='A Field'/>
      <ValidatedTextInput name='matchingField' label='This Field Must Match'/>
      <ValidatedSubmitButton key='submitBtn' value='Submit'/>
    </ValidatedFormContainer>
  );
};

export default requiredInputsExample as React.SFC;
