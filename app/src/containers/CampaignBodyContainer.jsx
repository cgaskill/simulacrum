import {connect} from "react-redux";
import CampaignBody from "../components/CampaignBody";
import * as CampaignActions from "../actions/campaign-actions";

const mapStateToProps = (state, ownProps) => {
  return {
    campaign : state.campaigns.current
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadCampaign: (campaignId) => {
      dispatch(CampaignActions.loadCampaign(campaignId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CampaignBody);