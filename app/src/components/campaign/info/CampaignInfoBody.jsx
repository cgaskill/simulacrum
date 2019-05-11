import CampaignInfoBodyCreator from 'components/campaign/info/CampaignInfoBodyCreator';
import ContentGrid from 'components/campaign/info/content/ContentGrid';
import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import * as ContentActions from 'actions/ContentActions';
import {connect} from 'react-redux';
import * as CampaignActions from 'actions/CampaignActions';
import * as ContentReducer from 'actions/ContentReducer';
import * as CampaignReducer from 'actions/CampaignReducer';

const styles = (themes) => ({
});

class CampaignInfoBody extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    campaignId: PropTypes.number.isRequired,
    campaign: PropTypes.object,
    isCreator: PropTypes.bool.isRequired,
  };

  renderPlayerView() {
    return <React.Fragment>
      <ContentGrid {...this.props}/>
    </React.Fragment>;
  }

  render() {
    const {isCreator} = this.props;

    return (
        <React.Fragment>
          {
            isCreator &&
            <CampaignInfoBodyCreator {...this.props} />
          }
          {
            !isCreator &&
            this.renderPlayerView()
          }
        </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const currentCampaign = CampaignReducer.getCurrentCampaign(state, ownProps.campaignId);
  const currentContentItems = ContentReducer.getCurrentContentItems(state, ownProps.campaignId);

  return {
    campaign: currentCampaign,
    contentItems: currentContentItems,
    isLoaded: state.campaigns.isLoaded && currentCampaign !== null,
    isCreator: currentCampaign != null && currentCampaign.creator === state.user.info.id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    putContentItem: (contentItem) => {
      return dispatch(ContentActions.putContentItem(contentItem));
    },
    loadCampaign: (campaignId) => {
      return dispatch(CampaignActions.loadCampaign(campaignId));
    },
    loadContentItems: (campaignId) => {
      return dispatch(ContentActions.loadContentItems(campaignId));
    },
    invitePlayer: (form) => {
      const {email, campaignId} = form;
      return dispatch(CampaignActions.invitePlayer(campaignId, email));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CampaignInfoBody));
