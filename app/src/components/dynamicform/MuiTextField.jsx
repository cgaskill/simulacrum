import {Field} from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';
import TextField from '@material-ui/core/TextField';

const MuiTextField =
  ({
     autoComplete,
     label,
     multiline,
     name,
     placeholder,
     required,
    type,
   }) => (
    <div>
      <Field
        autoComplete={autoComplete}
        component={({
                      label,
                      meta: {touched, error},
                    }) => (
          <TextField
            type={type}
            helperText={label}
            label={label}
            errorText={touched && error}
          />
        )}
        name={name}
        required={required}
        label={label}
        placeholder={placeholder}
        multiline={multiline}
      />
    </div>
);

MuiTextField.propTypes = {
  autoComplete: PropTypes.string,
  label: PropTypes.string,
  multiline: PropTypes.bool,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string,
};

MuiTextField.defaultProps = {
  autocomplete: 'off',
  multiline: false,
  required: false,
  type: 'text',
};

export default MuiTextField
