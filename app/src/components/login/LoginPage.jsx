import React, {Component} from 'react';
import Header from 'components/layout/Header';
import LoginBody from 'components/login/LoginBody';
import Main from 'components/layout/Main';

export default class LoginPage extends Component {
  render() {
    return (
        <React.Fragment>
          <Header/>
          <Main>
            <LoginBody {...this.props}/>
          </Main>
        </React.Fragment>
    );
  }
}
