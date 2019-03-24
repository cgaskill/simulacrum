import CampaignInfoBodyCreator from "components/campaign/info/CampaignInfoBodyCreator";
import ContentGrid from "components/campaign/info/content/ContentGrid";
import React from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import _ from "lodash";
import {Redirect} from "react-router-dom";

const styles = (themes) => ({
});

class CampaignInfoBody extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    campaignId: PropTypes.number.isRequired,
    loadCampaign: PropTypes.func.isRequired,
    loadContentItems: PropTypes.func.isRequired,
    campaign: PropTypes.object,
    isCreator: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    if (_.isEmpty(this.props.campaign)) {
      const campaignId = _.toNumber(this.props.campaignId);
      this.props.loadCampaign(campaignId);
      this.props.loadContentItems(campaignId);
    }
  }

  renderPlayerView() {
    return <React.Fragment>
      <ContentGrid {...this.props}/>
    </React.Fragment>;
  }

  render() {
    const {isCreator, isLoading, campaign} = this.props;

    if (isLoading) {
      return null;
    }

    if (_.isEmpty(campaign)) {
      return <Redirect to={"/"}/>;
    }

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

export default withStyles(styles)(CampaignInfoBody);
