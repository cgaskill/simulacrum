import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';

const styles = (theme) => ({
  main: {
    // paddingLeft: 32,
    // paddingRight: 32,
    // paddingTop: 32,
    // minHeight: 100,
    display: 'flex',
    padding: theme.spacing.unit * 3,
  },
  toolbar: theme.mixins.toolbar,
});

class Main extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.node,
    hideHeaderBanner: PropTypes.bool,
  };

  render() {
    const {classes, hideHeaderBanner} = this.props;

    return (
        <React.Fragment>
          {
            hideHeaderBanner && <div className={classes.toolbar}/>
          }
          <main className={classes.main}>
            {this.props.children}
          </main>
        </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Main));
