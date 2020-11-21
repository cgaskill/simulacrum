import {Field} from "redux-form";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import PropTypes from "prop-types";
import React from "react";

const MuiRadioGroup =
  ({
     handleChange,
     name,
     placeholder,
     required,
     val,
   }) => (
    <Field name="sex" component={
      ({
         input,
         ...rest
       }) => (
        <RadioGroup
          {...input}
          {...rest}
          valueSelected={input.value}
          onChange={(event, value) => input.onChange(value)}
        />)}
    >
      <Radio value="male" label="male" />
      <Radio value="female" label="female" />
    </Field>
  );

MuiRadioGroup.propTypes = {
  name: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  val: PropTypes.object,
  handleChange: PropTypes.func.isRequired,
};

MuiRadioGroup.defaultProps = {
  required: false,
};

export default MuiRadioGroup
