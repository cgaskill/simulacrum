import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';

const drawerWidth = 240;

const styles =
    ({
         breakpoints,
         palette,
         mixins,
     }) => ({
        root: {
            display: 'flex',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        content: {
            flexGrow: 1,
            display: 'flex',
            padding: 0,
            backgroundColor: palette.background.default,
        },
        toolbar: mixins.toolbar,
        collapseButton: {
            backgroundColor: palette.grey[50],
            textAlign: 'center',
            borderRadius: 0,
            borderTop: '1px solid',
            borderColor: 'rgba(0,0,0,0.12)',
            [breakpoints.up('sm')]: {
                minHeight: 40,
            },
        },
    });

const CampaignInfoNavHeader = ({classes, collapsed, campaignId, subPage}) => {
  if (collapsed) {
    return null;
  }
  return <div/>;
};

CampaignInfoNavHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  campaignId: PropTypes.number.isRequired,
  subPage: PropTypes.string.isRequired,
  collapsed: PropTypes.bool,
};

export default withStyles(styles, {name: 'MuiContent'})(CampaignInfoNavHeader);
