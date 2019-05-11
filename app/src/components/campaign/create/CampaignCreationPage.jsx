import React, {Component} from 'react';
import CampaignCreationBody from 'components/campaign/create/CampaignCreationBody';
import TemplatePage from 'components/layout/TemplatePage';

export default class CampaignCreationPage extends Component {
  render() {
    return (
      <TemplatePage>
        <CampaignCreationBody/>
      </TemplatePage>
    );
  }
}
