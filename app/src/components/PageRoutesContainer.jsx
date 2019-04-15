import {connect} from 'react-redux';
import PageRoutes from 'components/PageRoutes';
import * as UserActions from 'actions/UserActions';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    isLoaded: state.user.isLoaded,
    gapiLoaded: state.user.gapiLoaded,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initializeUser: (gapiLoaded) => {
      dispatch(UserActions.initializeUser(gapiLoaded));
    },
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PageRoutes));
