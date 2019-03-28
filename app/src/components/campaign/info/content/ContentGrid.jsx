import Chip from "@material-ui/core/Chip";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import {withStyles} from "@material-ui/core/styles/index";
import Typography from "@material-ui/core/Typography";
import ContentModal from "components/campaign/info/content/ContentModal";
import React, {Component} from "react";
import PropTypes from "prop-types";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Fab from "@material-ui/core/Fab";
import _ from "lodash";
import memoize from "memoize-one";

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
  fab: {
    position: "absolute",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  tile: {
    cursor: "pointer",
  },
  column: {
    flexBasis: "33.33%",
  },
});

class ContentGrid extends Component {
  static propTypes = {
    campaignId: PropTypes.number.isRequired,
    contentItems: PropTypes.array,
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      contentItemModalIsOpen: false,
      cols: 4,
      editContentItem: null,
      excludedTypes: [],
    };
    this.rootRef = React.createRef();
  }

  handleOpenContentItemModal = (event, editContentItem) => {
    editContentItem = editContentItem || {};
    this.setState({contentItemModalIsOpen: true, editContentItem});
  };

  handleCloseContentItemModal = () => {
    this.setState({contentItemModalIsOpen: false, editContentItem: null});
  };

  updateCols() {
    if (this.rootRef.current) {
      const cols = Math.min(Math.max(Math.floor(this.rootRef.current.offsetWidth / 250), 1), 6);
      this.setState({cols});
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateCols.bind(this));
    this.updateCols();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateCols.bind(this));
  }

  toggleFilter = (type) => {
    if (_.includes(this.state.excludedTypes, type)) {
      this.setState({excludedTypes: _.without(this.state.excludedTypes, type)});
    } else {
      this.setState({excludedTypes: [...this.state.excludedTypes, type]});
    }
  };

  filter = memoize(
      (contentItems, excludedTypes) => contentItems.filter((item) => !_.includes(excludedTypes, item.type))
  );

  render() {
    const {classes, contentItems} = this.props;
    if (contentItems == null) {
      return null;
    }

    const filteredContentItems = this.filter(contentItems, this.state.excludedTypes);

    return (
        <div ref={this.rootRef} className={"contentItems"}>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <div className={classes.column}>
                <Typography className={classes.heading}>Location</Typography>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
              <div className={classes.column}/>
              <div className={classes.column}>
                {
                  _.uniqBy(contentItems, "type").map((contentItem, index) => {
                    const excluded = _.includes(this.state.excludedTypes, contentItem.type);
                    return (<Chip label={contentItem.type} key={index} className={classes.chip}
                                  color={excluded ? "default" : "primary"}
                                  deleteIcon={excluded ? <CloseIcon/> : <DoneIcon/>}
                                  onDelete={() => {
                                    this.toggleFilter(contentItem.type);
                                  }}
                                  onClick={() => {
                                    this.toggleFilter(contentItem.type);
                                  }}
                                  clickable={true}/>);
                  })
                }
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <GridList cellHeight={180} cols={this.state.cols} className={classes.gridList}>
            {/* <GridListTile key="Subheader" cols={this.state.cols} style={{height: "auto"}}>*/}
              {/* <ListSubheader component="h1">Content</ListSubheader>*/}
              {/* <Divider/>*/}
            {/* </GridListTile>*/}
            {
              filteredContentItems.map((contentItem, index) => {
                return (
                    <GridListTile key={index} onClick={(e) => this.handleOpenContentItemModal(e, contentItem)} classes={{root: classes.tile}}>
                      {/* <img src={contentItem.img}*/}
                      <img src={"http://via.placeholder.com/260x180"}
                           alt={contentItem.title}/>
                      <GridListTileBar
                          title={contentItem.name}
                          subtitle={<span>{contentItem.notes}</span>}
                          actionIcon={
                            <IconButton className={classes.icon}>
                              <EditIcon />
                            </IconButton>
                          }
                      />
                    </GridListTile>
                );
              })
            }
          </GridList>
          <Fab color="primary" aria-label="Add" className={classes.fab} onClick={this.handleOpenContentItemModal} >
            <AddIcon />
          </Fab>
          <ContentModal initialValues={this.state.editContentItem}
                        handleClose={this.handleCloseContentItemModal}
                        isOpen={this.state.contentItemModalIsOpen}
                        enableReinitialize={true}
                        {...this.props}/>
        </div>
    );
  }
}

export default withStyles(styles)(ContentGrid);
