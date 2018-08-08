import * as React from 'react';

const ErrorBox = (props) => (
  <div className='error-message-box'>
    { props.children }
  </div>
);

export default ErrorBox;
