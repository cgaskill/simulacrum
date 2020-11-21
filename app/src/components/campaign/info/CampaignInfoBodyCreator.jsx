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
import DynamicContentGrid from 'components/campaign/info/content/DynamicContentGrid';

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
    templates: PropTypes.object.isRequired,
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
    const {campaign, campaignId, subPage, classes, contentItems, templates, ...otherProps} = this.props;

    if (_.isEmpty(campaign)) {
      return <Redirect to={'/'}/>;
    }

    if (!templates) {
      return null;
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
            {
              subPage === 'overview' &&
              <DynamicContentGrid campaignId={campaignId} {...otherProps} contentItems={contentItems} templates={templates}/>
            }
            {subPage === 'journal' && <Journal campaignId={campaignId} {...otherProps} contentItems={this.filter(contentItems, 'journal')}/>}
            {
              subPage === 'characters' &&
              <DynamicContentGrid {...otherProps} campaignId={campaignId} contentItems={this.filter(contentItems, 'character')}
                                  template={templates['character']} templates={templates}/>
            }
            {
              subPage === 'items' &&
              <DynamicContentGrid {...otherProps} campaignId={campaignId} contentItems={this.filter(contentItems, 'item')}
                                  template={templates['item']} templates={templates}/>
            }
            {
              subPage === 'locations' &&
              <DynamicContentGrid {...otherProps} campaignId={campaignId} contentItems={this.filter(contentItems, 'location')}
                                  template={templates['locations']} templates={templates}/>
            }
            {
              subPage === 'everything' && <DynamicContentGrid {...otherProps} campaignId={campaignId} contentItems={contentItems} templates={templates}/>
            }
          </div>
        </div>
    );
  }
}

export default withRouter(withStyles(styles)(CampaignInfoBodyCreator));
