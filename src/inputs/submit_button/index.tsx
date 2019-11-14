import * as classNames from 'classnames';
import * as React from 'react';

type SubmitButtonProps = {
  value: string;
  disabled?: boolean;
  link?: boolean;
  size?: 'large' | 'small';
  dataTestId: string;
};

export default ({ value, size = 'small', disabled = false, link = false, dataTestId, ...props }: SubmitButtonProps) => (
  <div className={classNames(['react-stateless-forms-submit-button', { [size]: size, disabled, link }])}>
    <input type='submit' disabled={disabled} data-test-id={dataTestId} value={value} {...props} />
  </div>
);
