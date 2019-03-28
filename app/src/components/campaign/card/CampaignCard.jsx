import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';
import CardMedia from '@material-ui/core/CardMedia';

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

class CampaignCard extends Component {
  static propTypes = {
    campaign: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  };

  render() {
    const {campaign, classes} = this.props;

    return (
        <Card className={classes.campaignCard}>
          <CardMedia
              image="http://via.placeholder.com/250x150"
              title="Placeholder"
              className={classes.media}
          />
          <CardContent>
            <Typography className={classes.campaignTitle} color="primary">
              {campaign.name}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" component={Link} to={`/campaigns/${campaign.id}`}>Start Playing</Button>
            <Button size="small" component={Link} to={`/campaigns/${campaign.id}/info`}>Campaign Info</Button>
          </CardActions>
        </Card>
    );
  }
}

export default withStyles(styles)(CampaignCard);
