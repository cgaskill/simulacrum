import {reduxForm} from 'redux-form';
import React from 'react';
import PropTypes from 'prop-types';
import MuiTextField from 'components/dynamicform/MuiTextField';
import MuiRadioGroup from 'components/dynamicform/MuiRadioGroup';
import {withStyles} from '@material-ui/core';
import _ from 'lodash';
import DialogTitle from '@material-ui/core/DialogTitle';
import MuiDropdownSelect from "components/dynamicform/MuiDropdownSelect";

const styles = (theme) => ({
  dense: {
    marginTop: 16,
  },
  modal: {
  },
  modalTitle: {

  },
  modalContent: {
    padding: theme.spacing.unit * 4,
  },
});

const renderFields = (fields) => {
  return _.map(fields, (field) => {
    if (field.component === 'text') {
      return <MuiTextField type={field.type} key={field.name} name={field.name} label={field.label} multiline={field.multiLine}/>;
    } else if (field.component === 'dropdown') {
      return <MuiDropdownSelect key={field.name} />;
    } else if (field.component === 'radio') {
      return <MuiRadioGroup key={field.name} options={field.options} name={field.name} />;
    }
    // else if (field.component === 'checkbox') {
    //   return <MuiCheckbox />;
    // }
  });
};

const DynamicMuiForm = ({classes, fields, title, handleSubmit, pristine, reset, submitting}) => (
  <form onSubmit={handleSubmit}>
      {
        title &&
        <div className={classes.modalTitle}>
          <DialogTitle id="form-dialog-title">{{title}}</DialogTitle>
        </div>
      }
      <div className={classes.modalContent}>
        {renderFields(fields)}
        <div>
          <button type="submit" disabled={pristine || submitting}>
            Submit
          </button>
          <button type="button" disabled={pristine || submitting} onClick={reset}>
            Clear Values
          </button>
        </div>
      </div>
  </form>
);

DynamicMuiForm.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  fields: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
};

export default withStyles(styles, {withTheme: true})(reduxForm({})(DynamicMuiForm));
