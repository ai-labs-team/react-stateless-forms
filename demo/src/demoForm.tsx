import * as React from 'react';

import { withProps } from 'casium';

import {
  IsRequiredValidator,
  ValidatedForm,
  ValidatedSubmitButton,
  ValidatedTextInput,
  ValidationSet,
} from 'casium-forms';

export type Props = {
  fieldValues: object;
  errors: [any];
  onSubmit: (d?: any) => void;
  onUpdate: (d?: any) => void;
};

type ComputedProps = {
  validationSet: ValidationSet;
};

const DemoForm: any = withProps<Props, ComputedProps>(
  {
    validationSet: () => new ValidationSet({
      requiredInput: [new IsRequiredValidator()],
    })
  },
  ({ validationSet, errors, onSubmit, onUpdate, fieldValues }) => (
    <ValidatedForm
      errors={errors}
      validationSet={validationSet}
      onSubmit={onSubmit}
      onUpdate={onUpdate}
      fieldValues={fieldValues}
    >
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
  )
);

export default DemoForm;
