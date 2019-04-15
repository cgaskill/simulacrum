import {connect} from 'react-redux';
import LoginBody from 'components/login/LoginBody';
import * as UserActions from 'actions/UserActions';

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

export default connect(mapStateToProps, mapDispatchToProps)(LoginBody);
