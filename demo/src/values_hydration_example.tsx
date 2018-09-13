import * as React from 'react';

import {
  IsRequiredValidator,
  ValidatedForm,
  ValidatedSubmitButton,
  ValidatedTextInput,
  ValidationSet,
} from 'react-stateless-forms';

const valuesHydrationExample = () => {
  const validationSet = new ValidationSet({
    requiredField: [new IsRequiredValidator()],
  });

  return (
    <ValidatedForm
      validationSet={validationSet}
      fieldValues={{ field1: 'prepopulated value 1', field2: 'prepopulated value 2' }}
    >
      <ValidatedTextInput name='field1' label='Form Field 1'/>
      <ValidatedTextInput name='field2' label='Form Field 2'/>
      <ValidatedTextInput name='requiredField' label='A Required Value'/>
      <ValidatedSubmitButton key='submitBtn' value='Submit'/>
    </ValidatedForm>
  );
};

export default valuesHydrationExample as React.SFC;
