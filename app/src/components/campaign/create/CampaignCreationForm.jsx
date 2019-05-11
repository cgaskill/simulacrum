import React from 'react';
import {Field, reduxForm} from 'redux-form';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {FormTextField} from 'components/util/ReduxFields';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import * as CampaignActions from 'actions/CampaignActions';

const styles = (theme) => ({
  campaignFormContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  campaignForm: {

  },
  campaignFormTitle: {

  },
});

const validate = (values) => {
  const errors = {};
  const requiredFields = ['name'];
  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = 'Required';
    }
  });
  return errors;
};

class CampaignCreationForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
  };

  render() {
    const {handleSubmit, pristine, submitting, classes} = this.props;
    return (
      <div className={classes.campaignFormContainer}>
        <form onSubmit={handleSubmit}>
          <Card className={classes.campaignForm}>
            <CardContent>
              <Typography variant="h5" color={'inherit'} gutterBottom className={classes.campaignFormTitle}>
                Start your next Adventure
              </Typography>
              <div>
                <Field name="name" component={FormTextField} label="Name"/>
              </div>
            </CardContent>
            <CardActions>
              <Button type="submit" disabled={pristine || submitting} color={'inherit'}>Create Campaign</Button>
            </CardActions>
          </Card>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmit: (form) => {
      dispatch(CampaignActions.createCampaign(form));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(reduxForm({
  form: 'CampaignCreationForm',
  validate,
})(CampaignCreationForm)));
