import {Divider} from "@material-ui/core";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import ListSubheader from "@material-ui/core/ListSubheader";
import {withStyles} from "@material-ui/core/styles/index";
import ContentModal from "components/campaign/info/content/ContentModal";
import React, {Component} from "react";
import PropTypes from "prop-types";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";

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
});

class ContentGrid extends Component {
  static propTypes = {
    campaignId: PropTypes.number.isRequired,
    contentItems: PropTypes.array,
    classes: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      contentItemModalIsOpen: false,
      cols: 4,
      editContentItem: null,
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

  render() {
    const {classes, contentItems} = this.props;
    if (contentItems == null) {
      return null;
    }

    const filteredContentItems = contentItems;

    return (
        <div ref={this.rootRef} className={"contentItems"}>
          <GridList cellHeight={180} cols={this.state.cols} className={classes.gridList}>
            <GridListTile key="Subheader" cols={this.state.cols} style={{height: "auto"}}>
              <ListSubheader component="h1">Content</ListSubheader>
              <Divider/>
            </GridListTile>
            {
              filteredContentItems.map((contentItem, index) => {
                return (
                    <GridListTile key={index}>
                      {/* <img src={contentItem.img}*/}
                      <img src={"http://via.placeholder.com/260x180"}
                           alt={contentItem.title}/>
                      <GridListTileBar
                          title={contentItem.name}
                          subtitle={<span>{contentItem.notes}</span>}
                          actionIcon={
                            <IconButton className={classes.icon}>
                              <EditIcon onClick={(e) => this.handleOpenContentItemModal(e, contentItem)}/>
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
                        enableReinitialize={true}/>
        </div>
    );
  }
}

export default withStyles(styles)(ContentGrid);
