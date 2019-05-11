import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {Redirect} from 'react-router-dom';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import {connect} from 'react-redux';
import * as UserActions from 'actions/UserActions';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.unit * 3,
  },
  row: {
  },
  card: {
    display: 'flex',
    minWidth: '25%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appLogo: {
    height: 75,
    display: 'block',
  },
});

const GOOGLE_BUTTON_ID = 'google-sign-in-button';

class LoginBody extends Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    loginSuccess: PropTypes.func.isRequired,
    loginFailure: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  state = {};

  static getDerivedStateFromProps(props, currentState) {
    if (!currentState || !currentState.location || currentState.location.state !== props.location.state) {
      return {
        location: {
          state: props.location.state,
        },
      };
    }
    return null;
  }

  componentDidMount() {
    if (!this.props.isLoggedIn && window.gapi) {
      window.gapi.signin2.render(
          GOOGLE_BUTTON_ID,
          {
            width: 200,
            height: 50,
            onsuccess: this.props.loginSuccess,
            onFailure: this.props.loginFailure,
          },
      );
    }
  }

  render() {
    const {classes, isLoggedIn, isLoaded} = this.props;

    if (!isLoaded) {
      return null;
    }
    if (isLoggedIn) {
      const {from} = this.state.location.state || {from: {pathname: '/'}};
      return <Redirect to={from} />;
    }

    return (
        <div className={classes.root}>
          <div className={classes.row}>
            <Card className={classes.card}>
              <CardContent className={classes.content}>
                <div className={classes.row}>
                  <Typography variant="h5" gutterBottom>Login</Typography>
                </div>
                <div id={GOOGLE_BUTTON_ID}/>
              </CardContent>
            </Card>
          </div>
        </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    isLoaded: state.user.isLoaded,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loginSuccess: (googleUser) => {
      dispatch(UserActions.login(googleUser));
    },
    loginFailure: (error) => {

    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LoginBody));
