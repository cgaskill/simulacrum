import {connect} from "react-redux";
import LoginBody from "components/login/LoginBody";
import * as UserActions from "actions/user-actions";

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    isLoading: state.user.isLoading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginSuccess: (googleUser) => {
      dispatch(UserActions.login(googleUser));
    },
    loginFailure: (error) => {
      console.log("User decided not to login")
      console.log(error)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginBody);