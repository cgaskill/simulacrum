import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CampaignBody from 'components/campaign/CampaignBody';
import _ from 'lodash';

export default class CampaignPage extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  };

  render() {
    const campaignId = _.toNumber(this.props.match.params.campaignId);

    return (
        <CampaignBody campaignId={campaignId} {...this.props} />
    );
  }
}
