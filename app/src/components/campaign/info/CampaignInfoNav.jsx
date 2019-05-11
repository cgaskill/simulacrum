import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import BookIcon from '@material-ui/icons/Book';
import PersonIcon from '@material-ui/icons/Person';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import TerrainIcon from '@material-ui/icons/Terrain';
import ThreeSixtyIcon from '@material-ui/icons/ThreeSixty';
import {Link as RouterLink} from 'react-router-dom';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';

const styles =
    () => ({

    });

const CampaignInfoNav = ({classes, campaignId, subPage, collapsed}) => {
  return (
    <List subheader={!collapsed && <ListSubheader>Campaign</ListSubheader>}>
      <ListItem component={RouterLink} to={`/campaigns/${campaignId}/info`} selected={subPage === 'overview'} button>
        <ListItemIcon><ThreeSixtyIcon/></ListItemIcon>
        {!collapsed && <ListItemText primary={'Overview'}/>}
      </ListItem>
      <ListItem component={RouterLink} to={`/campaigns/${campaignId}/info/journal`} selected={subPage === 'journal'} button>
        <ListItemIcon><BookIcon/></ListItemIcon>
        {!collapsed && <ListItemText primary={'Journal'}/>}
      </ListItem>
      <ListItem component={RouterLink} to={`/campaigns/${campaignId}/info/characters`} selected={subPage === 'characters'} button>
        <ListItemIcon><PersonIcon/></ListItemIcon>
        {!collapsed && <ListItemText primary={'Characters'}/>}
      </ListItem>
      <ListItem component={RouterLink} to={`/campaigns/${campaignId}/info/items`} selected={subPage === 'items'} button>
        <ListItemIcon><BusinessCenterIcon/></ListItemIcon>
        {!collapsed && <ListItemText primary={'Items'}/>}
      </ListItem>
      <ListItem component={RouterLink} to={`/campaigns/${campaignId}/info/locations`} selected={subPage === 'locations'} button>
        <ListItemIcon><TerrainIcon/></ListItemIcon>
        {!collapsed && <ListItemText primary={'Locations'}/>}
      </ListItem>
    </List>);
};

CampaignInfoNav.propTypes = {
  classes: PropTypes.object.isRequired,
  campaignId: PropTypes.number.isRequired,
  subPage: PropTypes.string.isRequired,
  collapsed: PropTypes.bool.isRequired,
};

export default withStyles(styles, {name: 'MuiContent'})(CampaignInfoNav);
