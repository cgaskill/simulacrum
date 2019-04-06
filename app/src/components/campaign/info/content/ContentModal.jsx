import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Modal from '@material-ui/core/Modal';
import {withStyles} from '@material-ui/core/styles/index';
import {FormTextField} from 'components/util/ReduxFields';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Field, reduxForm} from 'redux-form';
import Draggable from 'react-draggable';

const styles = (theme) => ({
  dense: {
    marginTop: 16,
  },
  modal: {
  },
  paper: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: 'none',
  },
  modalContent: {
    padding: theme.spacing.unit * 4,
  },
});

const validate = (values) => {
  const errors = {};
  const requiredFields = ['name', 'type'];
  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = 'Required';
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
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      draggable: false,
    };

    this.handleSaveContentItem = this.handleSaveContentItem.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleSaveContentItem = (contentItem) => {
    this.props.putContentItem({...contentItem, campaignId: this.props.campaignId})
    .then(this.handleClose);
  };

  handleClose = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.props.reset();
    this.props.handleClose(event);
  };

  render() {
    const {handleSubmit, pristine, submitting, classes} = this.props;

    const contentItemId = !this.props.initialValues || !this.props.initialValues.contentItem ? -1 : this.props.initialValues.contentItem.id;

    return (
        <Draggable handle={'.content-modal-' + contentItemId}>
          <Modal
              open={this.props.isOpen}
              onClose={this.handleClose}
              hideBackdrop={true}
              aria-labelledby="form-dialog-title"
              classes={{root: classes.modal}}>
            <form onSubmit={handleSubmit(this.handleSaveContentItem)}>
              <div className={classes.paper}>
                <div className={'content-modal-' + contentItemId}>
                  <DialogTitle id="form-dialog-title">New Content</DialogTitle>
                </div>
                <div className={classes.modalContent}>
                  <Field name="name" type="text"
                         component={FormTextField} label="Name"/>
                  <Field name="type" type="text"
                         component={FormTextField} label="Type"/>
                  <Field name="image" type="text"
                         component={FormTextField} label="Image"/>
                  <Field name="notes" type="text"
                         component={FormTextField} label="Notes"/>
                  <Field name="gmNotes" type="text"
                         component={FormTextField} label="GM Only Notes"/>
                  <Button onClick={this.handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={pristine || submitting} color={'inherit'}>
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </Modal>
        </Draggable>
    );
  }
}

export default withStyles(styles)(reduxForm({
  form: 'ContentModal',
  validate,
})(ContentModal));
