import * as React from 'react';

import { withProps } from 'casium';

import Validated from './components/inputs/validated';
import ValidatedSubmit from './components/inputs/validated_submit';
import ValidatedForm from './components/validated_form/container';
import ValidationSet from './utils/validation_set';

import IsRequiredValidator from './validators/is_required_validator';

import TextInput from './components/inputs/formatted_input/text_input';
import SubmitButton from './components/inputs/submit_button';

const ValidatedTextInput = Validated(TextInput);
const ValidatedSubmitButton = ValidatedSubmit(SubmitButton);

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
