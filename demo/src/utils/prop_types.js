import PropTypes from 'prop-types';

export const ValidatedFormErrorsPropType =
  PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({ error: PropTypes.string, error_description: PropTypes.string }),
      PropTypes.string,
    ])
  );

export const FormStatusEnum =
  PropTypes.oneOf([
    'enabled',
    'disabled',
  ]);
