import React, {Component} from 'react';
import PropTypes from 'prop-types';
import 'typeface-roboto';
import {connect} from 'react-redux';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import FourOhFourPage from 'components/error/FourOhFourPage';
import LoginPage from 'components/login/LoginPage';
import CampaignInfoPage from 'components/campaign/info/CampaignInfoPage';
import CampaignCreationPage from 'components/campaign/create/CampaignCreationPage';
import CssBaseline from "@material-ui/core/CssBaseline";
import {ThemeProvider} from "@material-ui/core/styles";
import createTheme from 'theme';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import HomePage from "components/home/HomePage";
import UserHomePage from "components/home/UserHomePage";

function App(props) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme(prefersDarkMode),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <Switch>
        {
          props.isLoggedIn ?
            <AuthenticatedRoute exact path={'/'} component={UserHomePage} isLoggedIn={props.isLoggedIn}/> :
            <Route exact path={'/'} render={() => <HomePage/>}/>
        }

        <Route exact path={'/login'} component={LoginPage}/>

        <AuthenticatedRoute exact path={'/campaigns/new'} component={CampaignCreationPage} isLoggedIn={props.isLoggedIn}/>
        <AuthenticatedRoute exact path={'/campaigns/:campaignId'} component={AsyncCampaignPage} isLoggedIn={props.isLoggedIn}/>
        <AuthenticatedRoute exact path={'/campaigns/:campaignId/info'} component={CampaignInfoPage} isLoggedIn={props.isLoggedIn}/>
        <AuthenticatedRoute exact path={'/campaigns/:campaignId/info/:subPage'} component={CampaignInfoPage} isLoggedIn={props.isLoggedIn}/>

        <Route component={FourOhFourPage}/>
      </Switch>
    </ThemeProvider>
  );
}

App.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired
};

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const AuthenticatedRoute = withRouter(({ isLoggedIn, location, component: Component, ...rest }) => {
  console.log("Rending AuthenticatedRoute [isLoggedIn: ",
    isLoggedIn,
    ", location: ",
    location,
    "]");
  return <Route {...rest} render={(props) => (
    isLoggedIn === true
      ? <Component {...props} />
      : <Redirect to={{pathname: "/login", state: {from: location || '/'}}} />
  )} />
});

const AsyncCampaignPage = asyncComponent(() => import('components/campaign/CampaignPage'));

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

export default connect(mapStateToProps)(App);
