import * as React from 'react';

import { withProps } from 'casium';

import Validated from './components/inputs/validated';
import ValidatedForm from './components/validated_form/container';
import ValidationSet from './utils/validation_set';

import IsRequiredValidator from './validators/is_required_validator';

import TextInput from './components/inputs/formatted_input/text_input';

const ValidatedTextInput = Validated(TextInput);

export type Props = {
  fieldValues: object,
  errors: [any],
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
    </ValidatedForm>
  )
);

export default DemoForm;
