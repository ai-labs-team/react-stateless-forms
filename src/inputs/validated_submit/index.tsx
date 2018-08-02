import { omit } from 'ramda';
import * as React from 'react';

type ValidatedSubmitProps = {
  dataTestId: string;
  value: string;
  size: 'large' | 'small';
};

type formRoleProps = {
  submit: boolean;
};

export default function validatedSubmit(ComposedComponent: any): any {
  class _ValidatedSubmit extends React.Component<ValidatedSubmitProps> { // tslint:disable-line:class-name

    public static formRole: formRoleProps = { submit: true };

    public render(): JSX.Element {
      return (
        <ComposedComponent {...omit(['errors', 'onValidate'], this.props)} />
      );
    }
  }

  return _ValidatedSubmit;
}
