import Drawer from '@material-ui/core/Drawer';
import ContentList from 'components/campaign/info/content/ContentList';
import Game from 'components/game/Game';
import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import _ from 'lodash';
import {Redirect} from 'react-router-dom';
import * as ContentActions from 'actions/ContentActions';
import {getCurrentContentItems} from 'actions/ContentReducer';
import {getCurrentCampaign} from 'actions/CampaignReducer';
import {connect} from 'react-redux';
import * as CampaignActions from 'actions/CampaignActions';

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: 0,
  },
});

class CampaignBody extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    campaignId: PropTypes.number.isRequired,
    loadCampaign: PropTypes.func.isRequired,
    loadContentItems: PropTypes.func.isRequired,
    campaign: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      gameWidth: window.innerWidth - drawerWidth,
      gameHeight: window.innerHeight,
    };

    window.addEventListener('resize', this.updateDimensions);
  }

  componentDidMount() {
    if (_.isEmpty(this.props.campaign)) {
      const campaignId = _.toNumber(this.props.campaignId);
      this.props.loadCampaign(campaignId);
      this.props.loadContentItems(campaignId);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({gameWidth: window.innerWidth - drawerWidth, gameHeight: window.innerHeight});
  };

  render() {
    const {classes, campaign, isLoaded, ...other} = this.props;

    if (!isLoaded) {
      return null;
    }

    if (_.isEmpty(campaign)) {
      return <Redirect to={'/login'} />;
    }

    return (
        <div className={classes.root}>
          <div className={classes.content}>
            <Game {...this.props} width={this.state.gameWidth} height={this.state.gameHeight} />
          </div>
          <Drawer
              className={classes.drawer}
              variant="permanent"
              classes={{
                paper: classes.drawerPaper,
              }}
              anchor="right"
          >
            <ContentList {...other} />
          </Drawer>
        </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    campaign: getCurrentCampaign(state, ownProps.campaignId),
    contentItems: getCurrentContentItems(state, ownProps.campaignId),
    token: state.user.token,
    userId: state.user.info.id,
    isLoaded: state.campaigns.isLoaded,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadCampaign: (campaignId) => {
      dispatch(CampaignActions.loadCampaign(campaignId));
    },
    loadContentItems: (campaignId) => {
      return dispatch(ContentActions.loadContentItems(campaignId));
    },
    putContentItem: (contentItem) => {
      return dispatch(ContentActions.putContentItem(contentItem));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CampaignBody));
