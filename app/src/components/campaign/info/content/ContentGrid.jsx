import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles/index";
import ContentModal from "components/campaign/info/content/ContentModal";
import React, {Component} from "react";
import PropTypes from "prop-types";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/Add";

const styles = (theme) => ({
  contentItems: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "start",
    overflow: "hidden",
  },
  entityGrid: {
    marginBottom: 0,
  },
  entityCard: {
    // width: "250px",
    // maxWidth: "100%",
    // margin: "auto",
    // marginBottom: 16,
  },
  subheader: {
    width: "100%",
  },
  media: {
    height: 0,
    paddingTop: "56.25%",
    width: "100%",
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class ContentGrid extends Component {
  static propTypes = {
    campaignId: PropTypes.number.isRequired,
    contentItems: PropTypes.array,
    classes: PropTypes.object.isRequired,
    createContentItem: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      createContentItemModalIsOpen: false,
    };
  }

  handleOpenCreateContentItemModal = (event) => {
    this.setState({createContentItemModalIsOpen: true});
  };

  handleCloseCreateContentItemModal = (event) => {
    this.setState({createContentItemModalIsOpen: false});
  };

  handleCreateContentItem = (contentItem) => {
    this.setState({createContentItemModalIsOpen: false});
    this.props.createContentItem({...contentItem, campaignId: this.props.campaignId});
  };

  render() {
    const {classes, contentItems} = this.props;
    if (contentItems == null) {
      return null;
    }

    const filteredContentItems = contentItems;

    return (
        <React.Fragment>
          <div className={"contentItems"}>
            <Grid container spacing={32} className={classes.entityGrid}>
              <Grid item xs={12} key={"filterMenu"}>
                <Button variant="contained" color="primary" className={classes.button} onClick={this.handleOpenCreateContentItemModal}>
                  <AddIcon /> New
                  <ContentModal handleCreateContent={this.handleCreateContentItem}
                                handleClose={this.handleCloseCreateContentItemModal}
                                isOpen={this.state.createContentItemModalIsOpen}/>
                </Button>
              </Grid>
              {
                filteredContentItems.map(function(entity, index) {
                  return (
                      <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={index}>
                        <Card className={classes.entityCard}>
                          <CardMedia
                              image="http://via.placeholder.com/250x150"
                              title="Placeholder"
                              className={classes.media}
                          />
                          <CardContent>
                            <Typography className={classes.entityTitle} color="primary">
                              {entity.name}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                  );
                })
              }
            </Grid>
          </div>
        </React.Fragment>
    );
  }
}

export default withStyles(styles)(ContentGrid);
