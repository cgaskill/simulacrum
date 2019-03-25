import * as ContentActions from "actions/ContentActions";
import {connect} from "react-redux";
import * as CampaignActions from "actions/CampaignActions";
import CampaignInfoBody from "components/campaign/info/CampaignInfoBody";

const mapStateToProps = (state, ownProps) => {
  const currentCampaign = state.campaigns.current !== null &&
    state.campaigns.current.id === ownProps.campaignId ? state.campaigns.current : null;
  const currentContentItems = state.content.campaignId !== null &&
    state.content.campaignId === ownProps.campaignId ? state.content.instances : null;
  return {
    campaign: currentCampaign,
    contentItems: currentContentItems,
    isLoading: state.campaigns.isLoading || currentCampaign === null,
    isCreator: currentCampaign != null && currentCampaign.creator === state.user.info.id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createContentItem: (contentItem) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(CampaignInfoBody);
