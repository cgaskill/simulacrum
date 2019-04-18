import * as ContentActions from 'actions/ContentActions';
import {getCurrentContentItems} from 'actions/ContentReducer';
import {getCurrentCampaign} from 'actions/CampaignReducer';
import {connect} from 'react-redux';
import CampaignBody from 'components/campaign/CampaignBody';
import * as CampaignActions from 'actions/CampaignActions';

const mapStateToProps = (state, ownProps) => {
  return {
    campaign: getCurrentCampaign(state, ownProps.campaignId),
    contentItems: getCurrentContentItems(state, ownProps.campaignId),
    token: state.user.token,
    userId: state.user.info.id,
    isLoaded: state.campaigns.isLoaded &&
      state.campaigns.current !== null &&
      state.campaigns.current.id === ownProps.campaignId,
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

export default connect(mapStateToProps, mapDispatchToProps)(CampaignBody);
