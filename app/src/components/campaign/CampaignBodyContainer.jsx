import * as ContentActions from 'actions/ContentActions';
import {connect} from 'react-redux';
import CampaignBody from 'components/campaign/CampaignBody';
import * as CampaignActions from 'actions/CampaignActions';

const mapStateToProps = (state, ownProps) => {
  const currentCampaign = state.campaigns.current !== null &&
    state.campaigns.current.id === ownProps.campaignId ? state.campaigns.current : null;
  const currentContentItems = state.content.campaignId !== null &&
    state.content.campaignId === ownProps.campaignId ? state.content.instances : null;
  return {
    campaign: currentCampaign,
    contentItems: currentContentItems,
    token: state.user.token,
    userId: state.user.info.id,
    isLoading: state.campaigns.isLoading ||
      state.campaigns.current === null ||
      state.campaigns.current.id !== ownProps.campaignId,
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
