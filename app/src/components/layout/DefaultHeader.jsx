import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core';
import {Component} from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import UserNotificationMenu from 'components/menu/UserNotificationMenu';
import PropTypes from 'prop-types';
import UserNavMenu from 'components/menu/UserNavMenu';
import Button from '@material-ui/core/Button';
import * as UserActions from 'actions/UserActions';
import * as NotificationActions from 'actions/NotificationActions';

const styles = (theme) => ({
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  appTitle: {
    flex: 1,
  },
  appTitleLink: {
    color: '#ffffff',
    textDecoration: 'none',
  },
  loginLink: {
    color: '#ffffff',
    textDecoration: 'none',
  },
  appLogo: {
    height: 30,
  },
});

class DefaultHeader extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool,
    isLoaded: PropTypes.bool.isRequired,
    handleLogoutClick: PropTypes.func.isRequired,
  };

  render() {
    const {classes} = this.props;

    return (
        <React.Fragment>
          <Link component={RouterLink} to={'/'}>
            <img src={'/logo.png'} className={classes.appLogo} alt="logo"/>
          </Link>
          <Typography variant="h6" color="inherit" className={classes.appTitle}>
            <Link component={RouterLink} to={'/'} className={classes.appTitleLink}>Simulacrum</Link>
          </Typography>
          {this.props.isLoggedIn && <UserNotificationMenu {...this.props} />}
          {
            !this.props.isLoggedIn && this.props.isLoaded &&
            <Button color={'inherit'} component={RouterLink} to="/login" className={classes.loginLink}>Login</Button>
          }
          {
            this.props.isLoggedIn && <UserNavMenu handleLogoutClick={this.props.handleLogoutClick} />
          }
        </React.Fragment>
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
