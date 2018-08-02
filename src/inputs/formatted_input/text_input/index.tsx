import { identity } from 'ramda';
import * as  React from 'react';

import FormattedInput, { FormattedInputPropsWithoutFormat } from '../';

const TextInput: React.SFC<FormattedInputPropsWithoutFormat> = props => (
  <FormattedInput {...props} format={identity} unformat={identity} />
);

TextInput.displayName = 'TextInput';

export default TextInput;
