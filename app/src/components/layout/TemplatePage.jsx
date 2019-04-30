import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Header from 'components/layout/Header';
import Main from 'components/layout/Main';
import Footer from 'components/layout/Footer';

export default class TemplatePage extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return (
        <React.Fragment>
          <Header { ...this.props } />
          <Main { ...this.props }>
            { this.props.children }
          </Main>
          <Footer { ...this.props } />
        </React.Fragment>
    );
  }
}
