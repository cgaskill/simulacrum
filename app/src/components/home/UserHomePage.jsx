import React, {Component} from 'react';
import UserHomeBody from 'components/home/UserHomeBody';
import TemplatePage from 'components/layout/TemplatePage';

export default class UserHomePage extends Component {
  render() {
    return (
      <TemplatePage>
        <UserHomeBody/>
      </TemplatePage>
    );
  }
}
