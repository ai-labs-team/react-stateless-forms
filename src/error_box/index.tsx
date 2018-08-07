import * as React from 'react';

const ErrorBox = ({ children }: { children: React.ReactNode }) => (
  <div className='error-message-box'>
    { children }
  </div>
);

export default ErrorBox;
