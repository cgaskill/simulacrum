import ContentGrid from 'components/campaign/info/content/ContentGrid';
import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import _ from 'lodash';
import {Redirect} from 'react-router-dom';
import Journal from './content/Journal';
import memoize from 'memoize-one';
const drawerWidth = 240;

const styles =
    ({
      breakpoints,
      palette,
      mixins,
      spacing,
    }) => ({
  root: {
    padding: spacing.unit * 3,
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
  toolbar: mixins.toolbar,
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
        </React.Fragment>
    );
  }
}

export default withStyles(styles)(CampaignInfoBodyCreator);
