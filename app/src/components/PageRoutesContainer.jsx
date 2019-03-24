import {connect} from "react-redux";
import PageRoutes from "components/PageRoutes";
import * as UserActions from "actions/UserActions";
import {withRouter} from "react-router-dom";

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    isLoading: state.user.isLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initializeUser: () => {
      dispatch(UserActions.initializeUser());
    },
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PageRoutes));
