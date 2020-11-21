import PropTypes from 'prop-types';
import React from 'react';

export const MuiTextAreaField =
  ({
     handleChange,
     name,
     placeholder,
     required,
   }) => (
    <div>
    <textarea
      type="text"
      name={name}
      required={required}
      style={{height: '80px'}}
      autoComplete={'off'}
      placeholder={placeholder}
      onChange={handleChange}
    />
    </div>
  );

MuiTextAreaField.propTypes = {
  name: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
};
