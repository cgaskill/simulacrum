import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = (theme) => ({
  footer: {
    minHeight: '100px',
  },
});

class Footer extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const {classes} = this.props;

    return (
        <footer className={classes.footer}>
        </footer>
    );
  }
}

export default withStyles(styles)(Footer);
