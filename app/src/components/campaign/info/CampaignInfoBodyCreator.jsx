import ContentGrid from 'components/campaign/info/content/ContentGrid';
import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import _ from 'lodash';
import {Redirect} from 'react-router-dom';
import Journal from 'components/campaign/info/content/Journal';
import memoize from 'memoize-one';
import ThreeSixtyIcon from '@material-ui/icons/ThreeSixty';
import BookIcon from '@material-ui/icons/Book';
import PersonIcon from '@material-ui/icons/Person';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import TerrainIcon from '@material-ui/icons/Terrain';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {withRouter} from 'react-router-dom';

const styles =
    ({
       palette,
       mixins,
     }) => ({
  root: {
    flexGrow: 1,
    backgroundColor: palette.background.paper,
  },
  content: {
    flexGrow: 1,
    display: 'flex',
  },
  toolbar: mixins.toolbar,
});

class CampaignInfoBodyCreator extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    campaignId: PropTypes.number.isRequired,
    campaign: PropTypes.object,
    contentItems: PropTypes.array,
    subPage: PropTypes.string.isRequired,
    history: PropTypes.object.isRequired,
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

  handleChange = (e, value) => {
    this.props.history.push(`/campaigns/${this.props.campaignId}/info/${value}/`);
  };

  render() {
    const {campaign, campaignId, subPage, classes, contentItems, ...otherProps} = this.props;

    if (_.isEmpty(campaign)) {
      return <Redirect to={'/'}/>;
    }

    return (
      <div className={classes.root}>
          <AppBar position="static">
            <Tabs variant={'fullWidth'} value={subPage} onChange={this.handleChange}>
              <Tab label="Overview" value={'overview'} icon={<ThreeSixtyIcon/>}/>
              <Tab label="Journal" value={'journal'} icon={<BookIcon/>} />
              <Tab label="Characters" value={'characters'} icon={<PersonIcon/>}/>
              <Tab label="Items" value={'items'} icon={<BusinessCenterIcon/>}/>
              <Tab label="Locations" value={'locations'} icon={<TerrainIcon/>}/>
            </Tabs>
          </AppBar>
          <div className={classes.content}>
            {subPage === 'overview' && <ContentGrid campaignId={campaignId} {...otherProps} contentItems={contentItems}/>}
            {subPage === 'journal' && <Journal campaignId={campaignId} {...otherProps} contentItems={this.filter(contentItems, 'journal')}/>}
            {subPage === 'characters' &&
            <ContentGrid {...otherProps} campaignId={campaignId} contentItems={this.filter(contentItems, 'character')}/>}
            {subPage === 'items' && <ContentGrid {...otherProps} campaignId={campaignId} contentItems={this.filter(contentItems, 'item')}/>}
            {subPage === 'locations' &&
            <ContentGrid {...otherProps} campaignId={campaignId} contentItems={this.filter(contentItems, 'location')}/>}
            {subPage === 'everything' && <ContentGrid {...otherProps} campaignId={campaignId} contentItems={contentItems}/>}
          </div>
        </div>
    );
  }
}

export default withRouter(withStyles(styles)(CampaignInfoBodyCreator));
