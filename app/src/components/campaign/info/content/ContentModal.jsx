import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {withStyles} from "@material-ui/core/styles/index";
import {FormTextField} from "components/util/ReduxFields";
import React, {Component} from "react";
import PropTypes from "prop-types";
import {Field, reduxForm} from "redux-form";

const styles = (theme) => ({
  createEntityModal: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    position: "absolute",
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: "none",
  },
  dense: {
    marginTop: 16,
  },
});

const validate = (values) => {
  const errors = {};
  const requiredFields = ["name", "type"];
  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });
  return errors;
};

class ContentModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleCreateContent: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      createEntityIsOpen: false,
    };
  }

  render() {
    const {handleSubmit, pristine, submitting, handleCreateContent} = this.props;

    return (
        <Dialog
            open={this.props.isOpen}
            onClose={this.props.handleClose}
            aria-labelledby="form-dialog-title">
          <form onSubmit={handleSubmit(handleCreateContent)}>
            <DialogTitle id="form-dialog-title">New Content</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Create new content!
              </DialogContentText>
              <div>
                {/* <TextField*/}
                {/* id="filled-dense"*/}
                {/* label="Name"*/}
                {/* className={classNames(classes.textField, classes.dense)}*/}
                {/* margin="dense"*/}
                {/* variant="filled"*/}
                {/* />*/}

                <Field name="name" type="text"
                       component={FormTextField} label="Name"
                />
                <Field name="type" type="text"
                       component={FormTextField} label="Type"
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.props.handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" disabled={pristine || submitting} color={"inherit"}>
                Submit
              </Button>
            </DialogActions>
          </form>
        </Dialog>
    );
  }
}

export default withStyles(styles)(reduxForm({
  form: "ContentModal",
  validate,
})(ContentModal));
