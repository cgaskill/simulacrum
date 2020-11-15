import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu/index';
import MenuItem from '@material-ui/core/MenuItem/index';
import IconButton from '@material-ui/core/IconButton/index';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ListItemText from '@material-ui/core/ListItemText/index';
import {withStyles} from '@material-ui/core/styles/index';
import {Link as RouterLink} from 'react-router-dom';
import Link from "@material-ui/core/Link";

const styles = (theme) => ({
  root: {

  },
  userNavMenu: {

  }
});

class UserNavMenu extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    handleLogoutClick: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
  }

  handleClick = (event) => {
    this.setState({anchorEl: event.currentTarget});
  };

  handleClose = (event) => {
    this.setState({anchorEl: null});
  };

  render() {
    const {anchorEl} = this.state;
    const {handleLogoutClick, classes} = this.props;

    return (
        <div className={classes.userNavMenu}>
          <IconButton
              aria-owns={anchorEl ? 'simple-menu' : null}
              aria-haspopup="true"
              onClick={this.handleClick}
              color={'inherit'}>
            <AccountCircleIcon />
          </IconButton>
          <Menu id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleClose}
          >
            <MenuItem><Link component={RouterLink} to={'/account'}>My account</Link></MenuItem>
            <MenuItem onClick={handleLogoutClick}>
              <ListItemText primary={'Logout'} />
            </MenuItem>
          </Menu>
        </div>
    );
  }
}

export default withStyles(styles)(UserNavMenu);
