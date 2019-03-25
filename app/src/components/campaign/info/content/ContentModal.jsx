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
    putContentItem: PropTypes.func.isRequired,
    campaignId: PropTypes.number.isRequired,
    classes: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleSaveContentItem = this.handleSaveContentItem.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleSaveContentItem = (contentItem) => {
    this.props.putContentItem({...contentItem, campaignId: this.props.campaignId})
    .then(this.handleClose);
  };

  handleClose = () => {
    this.props.reset();
    this.props.handleClose();
  };

  render() {
    const {handleSubmit, pristine, submitting} = this.props;

    return (
        <Dialog
            open={this.props.isOpen}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title">
          <form onSubmit={handleSubmit(this.handleSaveContentItem)}>
            <DialogTitle id="form-dialog-title">New Content</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Create new content!
              </DialogContentText>
              <div>
                <Field name="name" type="text"
                       component={FormTextField} label="Name"/>
                <Field name="type" type="text"
                       component={FormTextField} label="Type"/>
                <Field name="notes" type="text"
                       component={FormTextField} label="Notes"/>
                <Field name="gmNotes" type="text"
                       component={FormTextField} label="GM Only Notes"/>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
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