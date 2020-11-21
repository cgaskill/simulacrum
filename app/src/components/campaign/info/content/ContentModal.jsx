import Modal from '@material-ui/core/Modal';
import {withStyles} from '@material-ui/core/styles/index';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import DynamicForm from 'components/dynamicform/DynamicForm';

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
    width: theme.spacing(50),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: 'none',
  },
  modalContent: {
    padding: theme.spacing(4),
  },
});

class ContentModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    reset: PropTypes.func,
    putContentItem: PropTypes.func.isRequired,
    campaignId: PropTypes.number.isRequired,
    classes: PropTypes.object.isRequired,
    initialValues: PropTypes.object,
    template: PropTypes.object.isRequired,
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
    const {classes, template} = this.props;

    const contentItemId = !this.props.initialValues || !this.props.initialValues.contentItem ? -1 : this.props.initialValues.contentItem.id;

    if (!template) {
      return null;
    }

    console.log(template.fields);
    return (
        <Draggable handle={'.content-modal-' + contentItemId}>
          <Modal
              open={this.props.isOpen}
              onClose={this.handleClose}
              hideBackdrop={true}
              aria-labelledby="form-dialog-title"
              classes={{root: classes.modal}}>
            <div className={classes.paper}>
              <DynamicForm
                onSubmit={this.handleSaveContentItem}
                fields={template.fields}
              />
            </div>
          </Modal>
        </Draggable>
    );
  }
}

export default withStyles(styles)(ContentModal);
