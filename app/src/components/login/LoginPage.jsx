import React, {Component} from 'react';
import LoginBody from 'components/login/LoginBody';
import TemplatePage from 'components/layout/TemplatePage';

export default class LoginPage extends Component {
  render() {
    return (
      <TemplatePage>
        <LoginBody {...this.props}/>
      </TemplatePage>
    );
  }
}
