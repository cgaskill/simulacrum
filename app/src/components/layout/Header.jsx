import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { Link as RouterLink } from 'react-router-dom'
import Link from '@material-ui/core/Link';
import UserNavMenu from 'components/layout/UserNavMenu';
import UserNotificationMenu from 'components/layout/UserNotificationMenu';
import SubMenu from 'components/layout/SubMenu';
import {connect} from 'react-redux';
import * as UserActions from 'actions/UserActions';
import * as NotificationActions from 'actions/NotificationActions';

const styles = (theme) => ({
  appbar: {
    zIndex: theme.zIndex.drawer + 1,
    flexGrow: 1,
    backgroundColor: '#090809',
    color: '#ffffff',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
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

class Header extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    handleLogoutClick: PropTypes.func.isRequired,
    hideHeaderBanner: PropTypes.bool,
  };

  render() {
    const {classes, hideHeaderBanner} = this.props;

    return (
        <React.Fragment>
          <AppBar className={classes.appbar} position="fixed" color="default">
            <Toolbar>
              <Link component={RouterLink} to={'/'}>
                <img src={'/logo.png'} className={classes.appLogo} alt="logo"/>
              </Link>
              <Typography variant="title" color="inherit" className={classes.appTitle}>
                <Link component={RouterLink} to={'/'} className={classes.appTitleLink}>Simulacrum</Link>
              </Typography>
              {this.props.isLoggedIn && <UserNotificationMenu {...this.props} />}
              {
                !this.props.isLoggedIn && this.props.isLoaded &&
                <Button color={'inherit'} component={Link} to="/login" className={classes.loginLink}>Login</Button>
              }
              {
                this.props.isLoggedIn && <UserNavMenu handleLogoutClick={this.props.handleLogoutClick} />
              }
            </Toolbar>
          </AppBar>
          {
            !hideHeaderBanner && <SubMenu />
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Header));
