import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CampaignInfoBody from 'components/campaign/info/CampaignInfoBody';
import _ from 'lodash';
import TemplatePage from 'components/layout/TemplatePage';

export default class CampaignInfoPage extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  };

  render() {
    const campaignId = _.toNumber(this.props.match.params.campaignId);
    let subPage = 'overview';
    if (this.props.match.params.subPage) {
        subPage = this.props.match.params.subPage;
    }

    return (
        <TemplatePage hideHeaderBanner={true}>
          <CampaignInfoBody campaignId={campaignId} subPage={subPage} {...this.props}/>
        </TemplatePage>
    );
  }
}
