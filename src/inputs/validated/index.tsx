import { withProps } from '../../utilities';
import { assocPath, isEmpty, omit } from 'ramda';
import * as React from 'react';

type ValidatedProps = {
  name: string;
  errors?: object;
  errorMessages?: string;
  onValidate?: (d?: any) => void;
  onChange?: (d?: any) => void;
};

type ValidatedComputedProps = {
  error: boolean;
  onChange: React.ChangeEventHandler<any>;
  errorMessages: React.ReactElement<any>;
};

const toValue = (el: any) => (el.type.toLowerCase() === 'checkbox') ? el.checked : el.value;

const eventToObject = (e: any) => {
  const [name, value] = e.target ?
    [e.target.name, toValue(e.target)] :
    [e.name, e.value];

  const path = name.split('.');

  return assocPath(path, value, {});
};

const hasErrorMessages = ({ errors, name }: { errors?: object; name: string }) =>
  errors && errors[name] && !isEmpty(errors[name]);
const toError = (error: string) => <p className='error-message' key={error.trim()}>{error}</p>;

export default <P extends {} = React.SFC<any>>(Child: React.ComponentType<P>): any =>
  Object.assign(
    withProps(
      {
        error: hasErrorMessages,
        onChange: ({ onValidate, onChange }: any) => (event: Event) => {
          onChange && onChange(event);
          onValidate(eventToObject(event));
        },
        errorMessages: ({ errors, name }: any) =>
          hasErrorMessages({ errors, name }) && toError(errors[name][0]) || null,
      },
      ({ errorMessages, ...props }: ValidatedProps & ValidatedComputedProps) => (
        <div className='error-container'>
          <Child {...omit(['onValidate', 'errors'], props) as any} />
          {errorMessages}
        </div>
      )),
    { formRole: { input: true }, displayName: `Validated(${Child.displayName || 'Unknown'})` }
  );
