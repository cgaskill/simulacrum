import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Redirect, Route, Switch} from 'react-router-dom';
import FourOhFourPage from 'components/error/FourOhFourPage';
import HomePage from 'components/home/HomePage';
import LoginPage from 'components/login/LoginPage';
import UserHomePage from 'components/home/UserHomePage';
import CampaignInfoPage from 'components/campaign/info/CampaignInfoPage';
import CampaignCreationPage from 'components/campaign/create/CampaignCreationPage';
import {connect} from 'react-redux';
import * as UserActions from 'actions/UserActions';
import {withRouter} from 'react-router-dom';

const AsyncCampaignPage = asyncComponent(() => import('components/campaign/CampaignPage'));

class PageRoutes extends Component {
  static propTypes = {
    isLoaded: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    gapiLoaded: PropTypes.bool.isRequired,
    initializeUser: PropTypes.func.isRequired,
  };

  componentDidMount() {
    if (!this.props.isLoaded) {
      this.props.initializeUser(this.props.gapiLoaded);
    }
  }

  render() {
    if (!this.props.isLoaded) {
      return null;
    }
    return (
      <Switch>
        <Route exact path={'/'} render={(props) => {
          return this.props.isLoggedIn ? <UserHomePage {...props} /> : <HomePage {...props} />;
        }}/>
        <Route path={'/login'} component={LoginPage} {...this.props} />
        <AuthenticatedRoute exact path={'/campaigns/new'} component={CampaignCreationPage} {...this.props}/>
        <AuthenticatedRoute exact path={'/campaigns/:campaignId'} component={AsyncCampaignPage} {...this.props}/>
        <AuthenticatedRoute exact path={'/campaigns/:campaignId/info'} component={CampaignInfoPage} {...this.props}/>
        <AuthenticatedRoute exact path={'/campaigns/:campaignId/info/:subPage'} component={CampaignInfoPage} {...this.props}/>
        <Route component={FourOhFourPage}/>
      </Switch>
    );
  }
}

const AuthenticatedRoute = ({component: Component, isLoggedIn, ...rest}) => (
    <Route {...rest}
        render={
          (props) => isLoggedIn
              ? <Component {...props} />
              : <Redirect to={{
                pathname: '/login',
                state: {from: props.location},
              }}/>
        }
    />
);

AuthenticatedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
};

function asyncComponent(importComponent) {
  class AsyncComponent extends Component {
    constructor(props) {
      super(props);

      this.state = {
        component: null,
      };
    }

    async componentDidMount() {
      const {default: component} = await importComponent();

      this.setState({
        component: component,
      });
    }

    render() {
      const C = this.state.component;

      return C ? <C {...this.props} /> : null;
    }
  }

  return AsyncComponent;
}

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
