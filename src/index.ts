import TextInput from './inputs/formatted_input/text_input';
import Validated from './inputs/validated';

import SubmitButton from './inputs/submit_button';
import ValidatedSubmit from './inputs/validated_submit';

export const ValidatedTextInput = Validated(TextInput);
export const ValidatedSubmitButton = ValidatedSubmit(SubmitButton);

export { default as ValidatedForm } from './validated_form/container';
export { default as ValidationSet} from './validation_set';

export { default as IsRequiredValidator } from './validators/is_required_validator';
export { default as FieldMatchMetavalidator } from './validators/field_match_metavalidator';
