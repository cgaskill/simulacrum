import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core';
import {Component} from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import * as UserActions from 'actions/UserActions';
import * as NotificationActions from 'actions/NotificationActions';

const styles = (theme) => ({
});

class DefaultHeader extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool,
    isLoaded: PropTypes.bool.isRequired,
    handleLogoutClick: PropTypes.func.isRequired,
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
    handleLogoutClick: () => {
      dispatch(UserActions.logoutUser());
    },
    loadNotifications: () => {
      dispatch(NotificationActions.loadNotifications());
    },
    markNotificationRead: (notificationId) => {
      dispatch(NotificationActions.markNotificationRead(notificationId));
    },
  };
};

export default withStyles(styles, {withTheme: true, name: 'MuiHeader'})(connect(mapStateToProps, mapDispatchToProps)(DefaultHeader));
