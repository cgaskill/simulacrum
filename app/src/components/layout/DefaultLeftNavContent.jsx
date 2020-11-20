import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core';
import {Component} from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import * as NotificationActions from 'actions/NotificationActions';

const styles = (theme) => ({
});

class DefaultHeader extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool,
    isLoaded: PropTypes.bool.isRequired,
  };

  render() {
    return (
        <div>
        </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    isLoaded: state.user.isLoaded,
    notifications: state.notifications.instances,
    isLoadedNotifications: state.notifications.isLoadedNotifications,
    reloadNotificationsInterval: 60000,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadNotifications: () => {
      dispatch(NotificationActions.loadNotifications());
    },
    markNotificationRead: (notificationId) => {
      dispatch(NotificationActions.markNotificationRead(notificationId));
    },
  };
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(DefaultHeader));
