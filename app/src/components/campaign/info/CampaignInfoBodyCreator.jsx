import ContentGrid from 'components/campaign/info/content/ContentGrid';
import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import BookIcon from '@material-ui/icons/Book';
import PersonIcon from '@material-ui/icons/Person';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import TerrainIcon from '@material-ui/icons/Terrain';
import ThreeSixtyIcon from '@material-ui/icons/ThreeSixty';
import _ from 'lodash';
import {Link as RouterLink, Redirect} from 'react-router-dom';
import Journal from './content/Journal';
import memoize from 'memoize-one';
import Drawer from '@material-ui/core/Drawer';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    display: 'flex',
  },
  toolbar: theme.mixins.toolbar,
});

class CampaignInfoBodyCreator extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    campaignId: PropTypes.number.isRequired,
    campaign: PropTypes.object,
    contentItems: PropTypes.array,
    subPage: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
    };
  }

  filter = memoize(
        (contentItems, includeType) => contentItems.filter((item) => _.includes(includeType, item.type))
  );

  render() {
    const {campaign, campaignId, subPage, classes, contentItems, ...otherProps} = this.props;

    if (_.isEmpty(campaign)) {
      return <Redirect to={'/'}/>;
    }

    return (
        <React.Fragment>
          <Drawer
              className={classes.drawer}
              variant="permanent"
              classes={{
                paper: classes.drawerPaper,
              }}>
            <div className={classes.toolbar}/>

            <List subheader={<ListSubheader>Campaign</ListSubheader>}>
              <ListItem component={RouterLink} to={`/campaigns/${campaignId}/info`} selected={subPage === 'overview'} button>
                <ListItemIcon><ThreeSixtyIcon/></ListItemIcon>
                <ListItemText primary={'Overview'}/>
              </ListItem>
              <ListItem component={RouterLink} to={`/campaigns/${campaignId}/info/journal`} selected={subPage === 'journal'} button>
                <ListItemIcon><BookIcon/></ListItemIcon>
                <ListItemText primary={'Journal'}/>
              </ListItem>
              <ListItem component={RouterLink} to={`/campaigns/${campaignId}/info/characters`} selected={subPage === 'characters'} button>
                <ListItemIcon><PersonIcon/></ListItemIcon>
                <ListItemText primary={'Characters'}/>
              </ListItem>
              <ListItem component={RouterLink} to={`/campaigns/${campaignId}/info/items`} selected={subPage === 'items'} button>
                <ListItemIcon><BusinessCenterIcon/></ListItemIcon>
                <ListItemText primary={'Items'}/>
              </ListItem>
              <ListItem component={RouterLink} to={`/campaigns/${campaignId}/info/locations`} selected={subPage === 'locations'} button>
                <ListItemIcon><TerrainIcon/></ListItemIcon>
                <ListItemText primary={'Locations'}/>
              </ListItem>
            </List>
          </Drawer>

          <div className={classes.content}>
            {subPage === 'overview' && <ContentGrid {...otherProps} contentItems={contentItems}/>}
            {subPage === 'journal' && <Journal {...otherProps} contentItems={this.filter(contentItems, 'journal')}/>}
            {subPage === 'characters' &&
            <ContentGrid {...otherProps} contentItems={this.filter(contentItems, 'character')}/>}
            {subPage === 'items' && <ContentGrid {...otherProps} contentItems={this.filter(contentItems, 'item')}/>}
            {subPage === 'locations' &&
            <ContentGrid {...otherProps} contentItems={this.filter(contentItems, 'location')}/>}
            {subPage === 'everything' && <ContentGrid {...otherProps} contentItems={contentItems}/>}
          </div>
        </React.Fragment>
    );
  }
}

export default withStyles(styles)(CampaignInfoBodyCreator);
