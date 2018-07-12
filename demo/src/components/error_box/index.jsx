import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

const ErrorBox = ({ children }) => (
  <div styleName='error-message-box'>
    { children }
  </div>
);

ErrorBox.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBox;
