import Divider from '@material-ui/core/Divider';
import CampaignCard from 'components/campaign/card/CampaignCard';
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'start',
    overflow: 'hidden',
  },
  campaignGrid: {
    marginBottom: 0,
  },
  campaignCard: {
    width: '250px',
    maxWidth: '100%',
    margin: 'auto',
    marginBottom: 16,
  },
  subheader: {
    width: '100%',
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
    width: '100%',
  },
});

class UserHomeBody extends Component {
  static propTypes = {
    campaigns: PropTypes.object.isRequired,
    loadCampaigns: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.loadCampaigns();
  }

  render() {
    const {campaigns, classes} = this.props;

    return (
        <React.Fragment>
          <Grid container>
            <Grid item sm={12} md={8}>
              {
                <div className={classes.root} elevation={4}>
                  <Grid container spacing={32} className={classes.campaignGrid}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={'title'}>
                      <Typography variant="headline" component="h2">
                        Campaigns
                        <Button component={Link} to={'/campaigns/new'}><AddCircleOutlineIcon/></Button>
                      </Typography>
                      <Divider />
                    </Grid>
                    {
                      campaigns.instances.map(function(campaign, index) {
                        return (
                            <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={index}>
                              <CampaignCard campaign={campaign} />
                            </Grid>
                        );
                      })
                    }
                  </Grid>
                </div>
              }
            </Grid>
          </Grid>
        </React.Fragment>
    );
  }
}

export default withStyles(styles)(UserHomeBody);
