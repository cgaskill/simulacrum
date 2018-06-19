import React, {Component} from 'react';
import HeaderContainer from "../containers/HeaderContainer";
import MainContainer from "../containers/MainContainer";

export default class HomePage extends Component {
  render() {
    return (
        <div>
          <HeaderContainer />
          <MainContainer>

          </MainContainer>
        </div>
    )
  }
}