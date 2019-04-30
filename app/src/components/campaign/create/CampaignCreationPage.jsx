import React, {Component} from 'react';
import CampaignCreationForm from 'components/campaign/create/CampaignCreationForm';
import TemplatePage from 'components/layout/TemplatePage';

export default class CampaignCreationPage extends Component {
  render() {
    return (
        <TemplatePage>
          <CampaignCreationForm/>
        </TemplatePage>
    );
  }
}
