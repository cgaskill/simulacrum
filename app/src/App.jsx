import React, {Component} from 'react';
import PropTypes from 'prop-types';
import 'typeface-roboto';
import {create} from 'jss';
import JssProvider from 'react-jss/lib/JssProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import {MuiThemeProvider, createMuiTheme, createGenerateClassName, jssPreset} from '@material-ui/core/styles';
import {red} from '@material-ui/core/colors';
import PageRoutes from 'components/PageRoutes';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'connected-react-router';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#15445e',
    },
    secondary: {
      main: '#d7d8db',
    },
    accent: red,
    type: 'light'
    ,
  },
  typography: {
    useNextVariants: true,
  },
});

const jss = create(jssPreset());

const generateClassName = createGenerateClassName();

class App extends Component {
  static propTypes = {
    store: PropTypes.object,
    history: PropTypes.object,
  };

  render() {
    return (
        <Provider store={this.props.store}>
          <JssProvider jss={jss} generateClassName={generateClassName}>
            <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
              <CssBaseline/>
              <ConnectedRouter history={this.props.history}>
                <PageRoutes/>
              </ConnectedRouter>
            </MuiThemeProvider>
          </JssProvider>
        </Provider>
    );
  }
}

export default App;
