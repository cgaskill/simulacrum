import Chip from '@material-ui/core/Chip';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import ListSubheader from '@material-ui/core/ListSubheader';
import {withStyles} from '@material-ui/core/styles/index';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import ContentModal from 'components/campaign/info/content/ContentModal';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Fab from '@material-ui/core/Fab';
import _ from 'lodash';
import memoize from 'memoize-one';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  contentItems: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'start',
    overflow: 'hidden',
  },
  gridList: {
    marginBottom: 0,
    backgroundColor: theme.palette.background.paper,
  },
  subheader: {
    width: '100%',
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
    width: '100%',
  },
  button: {
    margin: theme.spacing.unit * 1,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  tile: {
    cursor: 'pointer',
  },
  column: {
    flexBasis: '33.33%',
  },
});

class ContentGrid extends Component {
  static propTypes = {
    campaignId: PropTypes.number.isRequired,
    contentItems: PropTypes.array,
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    putContentItem: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      contentItemModalIsOpen: false,
      cols: 4,
      excludedTypes: [],
      openContentModals: [],
      expandedContentItemId: null,
      groupByType: true,
    };
    this.rootRef = React.createRef();
  }

  handleOpenContentItemModal = (event, editContentItem) => {
    event.preventDefault();
    event.stopPropagation();

    const nextId = !editContentItem || !editContentItem.id ? -1 : editContentItem.id;
    this.setState({openContentModals: _.concat(this.state.openContentModals, nextId)});
  };

  handleCloseContentItemModal = (event, editContentItem) => {
    const nextId = !editContentItem || !editContentItem.id ? -1 : editContentItem.id;
    const newOpenContentModals = _.without(this.state.openContentModals, nextId);
    this.setState({openContentModals: newOpenContentModals});
  };

  updateCols() {
    if (this.rootRef.current) {
      const cols = Math.min(Math.max(Math.floor(this.rootRef.current.offsetWidth / 250), 1), 6);
      this.setState({cols});
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateCols.bind(this));
    this.updateCols();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateCols.bind(this));
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

  renderGridList(filteredContentItems) {
    const {classes} = this.props;
    return filteredContentItems.map((contentItem, index) => {
      return (
          <GridListTile key={index}
                        onClick={(e) => this.handleOpenContentItemModal(e, contentItem)}
                        classes={{root: classes.tile}}>
            <img src={contentItem.image}
                 alt={contentItem.title}/>
            <GridListTileBar
                title={contentItem.name}
                subtitle={<span>{contentItem.notes}</span>}
                actionIcon={
                  <IconButton className={classes.icon}>
                    <EditIcon/>
                  </IconButton>
                }
            />
          </GridListTile>
      );
    });
  }

  renderGroupContentItems(filteredContentItems) {
    const groupedContentItems = _.groupBy(filteredContentItems, 'type');
    const sortedKeys = _.sortedUniq(_.keys(groupedContentItems));
    return _.map(sortedKeys, (key) => {
      return [
        <GridListTile key={'Subheader-' + key} cols={this.state.cols} style={{height: 'auto'}}>
          <ListSubheader component="div">{key}</ListSubheader>
        </GridListTile>,
        this.renderGridList(groupedContentItems[key]),
      ];
    });
  }

  render() {
    const {classes, contentItems} = this.props;
    if (contentItems == null) {
      return null;
    }

    const filteredContentItems = this.filter(contentItems, this.state.excludedTypes);

    return (
        <div className={classes.root} ref={this.rootRef}>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <div className={classes.column}>
                <Typography className={classes.heading}>Filters & Search</Typography>
              </div>
              <div className={classes.column}>
                <Typography className={classes.heading}>Type</Typography>
              </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
              <div className={classes.column}>
                <FormGroup row>
                  <FormControlLabel
                      control={
                        <Switch
                            checked={this.state.groupByType}
                            onChange={() => this.setState({'groupByType': !this.state.groupByType})}
                            value="groupByType"
                        />
                      }
                      label="Group By Type"
                  />
                </FormGroup>
              </div>
              <div className={classes.column}>
                {
                  _.uniqBy(contentItems, 'type').map((contentItem, index) => {
                    const excluded = _.includes(this.state.excludedTypes, contentItem.type);
                    return (<Chip label={contentItem.type} key={index} className={classes.chip}
                                  color={excluded ? 'default' : 'primary'}
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
            {
              !this.state.groupByType && this.renderGridList(filteredContentItems)
            }
            {
              this.state.groupByType && this.renderGroupContentItems(filteredContentItems)
            }
          </GridList>
          <Fab color="primary" aria-label="Add" className={classes.fab} onClick={this.handleOpenContentItemModal} >
            <AddIcon />
          </Fab>
          {
            filteredContentItems.map((contentItem, index) => {
              return <ContentModal key={index}
                                   initialValues={contentItem}
                                   form={'contentModal' + contentItem.id}
                                   handleClose={(e) => this.handleCloseContentItemModal(e, contentItem)}
                                   isOpen={_.includes(this.state.openContentModals, contentItem.id)}
                                   campaignId={this.props.campaignId}
                                   putContentItem={this.props.putContentItem}/>;
            })
          }

          <ContentModal initialValues={null}
                        form={'newContentModal'}
                        handleClose={(e) => this.handleCloseContentItemModal(e)}
                        isOpen={_.includes(this.state.openContentModals, -1)}
                        campaignId={this.props.campaignId}
                        putContentItem={this.props.putContentItem}/>
        </div>
    );
  }
}

export default withStyles(styles, {withTheme: true})(ContentGrid);
