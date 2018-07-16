import * as React from 'react';

type SubmitButtonProps = {
  value: string;
  disabled?: boolean;
};

export default ({ value, disabled = false, ...props }: SubmitButtonProps) => (
  <div className='SubmitButton'>
    <input type='submit' disabled={disabled} value={value} {...props} />
  </div>
);
