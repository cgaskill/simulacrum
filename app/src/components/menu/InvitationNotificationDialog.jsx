import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DialogTitle from '@material-ui/core/DialogTitle/index';
import Dialog from '@material-ui/core/Dialog/index';
import {withStyles} from '@material-ui/core/styles/index';
import Button from '@material-ui/core/Button/index';
import DialogActions from '@material-ui/core/DialogActions/index';
import DialogContent from '@material-ui/core/DialogContent/index';
import DialogContentText from '@material-ui/core/DialogContentText/index';
import {connect} from 'react-redux';
import * as CampaignActions from 'actions/CampaignActions';

const styles = {

};

class InvitationNotificationDialog extends Component {
  static propTypes = {
    notification: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    handleDeclineInvitation: PropTypes.func.isRequired,
    handleAcceptInvitation: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  handleClose = () => {
    this.props.onClose(this.props.notification);
  };

  handleAcceptInvitation = (notification) => (event) => {
    this.props.handleAcceptInvitation(notification);
    this.handleClose();
  };

  handleDeclineInvitation = (notification) => (event) => {
    this.props.handleDeclineInvitation(notification);
    this.handleClose();
  };

  render() {
    const {notification, open} = this.props;

    return (
        <Dialog
            open={open}
            onClose={this.handleClose}
            aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{notification.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {notification.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleAcceptInvitation(notification)} color="primary">
              Join
            </Button>
            <Button onClick={this.handleDeclineInvitation(notification)} color="primary">
              Decline
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleDeclineInvitation: (token, notificationId) => {
      dispatch(CampaignActions.declineInvite(token, notificationId));
    },
    handleAcceptInvitation: (token, notificationId) => {
      dispatch(CampaignActions.acceptInvite(token));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(InvitationNotificationDialog));
