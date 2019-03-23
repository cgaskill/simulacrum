import Grid from "@material-ui/core/Grid";
import ContentGrid from "components/campaign/info/content/ContentGrid";
import React from "react";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import _ from "lodash";
import {Redirect} from "react-router-dom";
import InvitePlayerForm from "components/campaign/info/InvitePlayerForm";

const styles = (themes) => ({
});

class CampaignInfoBodyCreator extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    campaignId: PropTypes.number.isRequired,
    campaign: PropTypes.object,
  };

  render() {
    const {campaign} = this.props;

    if (_.isEmpty(campaign)) {
      return <Redirect to={"/"}/>;
    }

    return (
        <Grid container spacing={32}>
          <Grid item xs={12} sm={6} md={6} lg={8} xl={10} key={"content"}>
            <ContentGrid {...this.props} />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4} xl={2} key={"sidePanel"}>
            <InvitePlayerForm {...this.props} />
          </Grid>
        </Grid>
    );
  }
}

export default withStyles(styles)(CampaignInfoBodyCreator);
