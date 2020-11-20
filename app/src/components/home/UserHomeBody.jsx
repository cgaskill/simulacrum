import Divider from '@material-ui/core/Divider';
import CampaignCard from 'components/campaign/card/CampaignCard';
import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import {connect} from 'react-redux';
import * as CampaignActions from 'actions/CampaignActions';
import Button from "@material-ui/core/Button";
import {Link as RouterLink} from 'react-router-dom';
import Container from "@material-ui/core/Container";

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'start',
    overflow: 'hidden',
    padding: theme.spacing(3),
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
  header: {
    display: 'flex'
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
    width: '100%',
  },
  newButton: {
    marginLeft: 'auto',
    padding: theme.spacing(1, 0),
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  fab: {
    display: 'none',
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      display: 'inherit'
    },
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
        <Container maxWidth={"lg"}>
          <div className={classes.header}>
            <div><Typography variant="h4" component="h2" display={"inline"}>Campaigns</Typography></div>
            <div className={classes.newButton}>
              <Button color="primary" variant="outlined" size={"medium"} to={'/campaigns/new'} component={RouterLink}>New Campaign</Button>
            </div>
          </div>
          <Divider />
          <Fab color={'primary'} aria-label="Add" component={RouterLink} to={'/campaigns/new'} className={classes.fab} >
            <AddIcon/>
          </Fab>

          <Grid container style={{height: '70vh'}}>
            <Grid item sm={false} md={2}/>
            <Grid item sm={12} md={8}>
              <Grid container spacing={4} className={classes.campaignGrid}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={'title'}>

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
            </Grid>
          </Grid>
        </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    campaigns: state.campaigns,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadCampaigns: () => {
      dispatch(CampaignActions.loadCampaigns());
    },
    createCampaign: (campaign) => {
      dispatch(CampaignActions.createCampaign(campaign));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UserHomeBody));
