import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CampaignInfoBody from 'components/campaign/info/CampaignInfoBody';
import _ from 'lodash';
import TemplatePage from 'components/layout/TemplatePage';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import * as CampaignReducer from 'actions/CampaignReducer';
import * as ContentReducer from 'actions/ContentReducer';
import * as ContentActions from 'actions/ContentActions';
import * as CampaignActions from 'actions/CampaignActions';
import CampaignInfoNavHeader from 'components/campaign/info/CampaignInfoNavHeader';

class CampaignInfoPage extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    isLoaded: PropTypes.bool,
    campaign: PropTypes.object,
    loadCampaign: PropTypes.func.isRequired,
    loadContentItems: PropTypes.func.isRequired,
  };

  componentDidMount() {
    if (_.isEmpty(this.props.campaign)) {
      const campaignId = _.toNumber(this.props.match.params.campaignId);
      this.props.loadCampaign(campaignId);
      this.props.loadContentItems(campaignId);
    }
  }

  render() {
    const campaignId = _.toNumber(this.props.match.params.campaignId);
    let subPage = 'overview';
    if (this.props.match.params.subPage) {
      subPage = this.props.match.params.subPage;
    }

    const {isLoaded, campaign} = this.props;

    if (!isLoaded) {
      return null;
    }

    if (_.isEmpty(campaign)) {
      return <Redirect to={{from: {pathname: '/'}}}/>;
    }

    return (
      <TemplatePage LeftNavHeader={CampaignInfoNavHeader}
                    subPage={subPage}
                    campaignId={campaignId}>
        <CampaignInfoBody campaignId={campaignId} subPage={subPage} {...this.props}/>
      </TemplatePage>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const campaignId = _.toNumber(ownProps.match.params.campaignId);
  const currentCampaign = CampaignReducer.getCurrentCampaign(state, campaignId);
  const currentContentItems = ContentReducer.getCurrentContentItems(state, campaignId);

  return {
    campaignId,
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

export default connect(mapStateToProps, mapDispatchToProps)(CampaignInfoPage);
