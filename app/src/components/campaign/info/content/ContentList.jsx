import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import {withStyles} from '@material-ui/core/styles/index';
import ContentModal from 'components/campaign/info/content/ContentModal';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import EditIcon from '@material-ui/icons/Edit';
import _ from 'lodash';
import memoize from 'memoize-one';

const styles = (theme) => ({
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
    margin: theme.spacing.unit,
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

class ContentList extends Component {
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

  renderGridList(filteredContentItems) {
    const {classes} = this.props;
    return filteredContentItems.map((contentItem, index) => {
      return (
          <ListItem key={index}
                    classes={{root: classes.tile}}>
            <ListItemText
                primary={contentItem.name}
                secondary={contentItem.notes}
            />
            <ListItemSecondaryAction>
              <IconButton className={classes.icon} onClick={(e) => this.handleOpenContentItemModal(e, contentItem)}>
                <EditIcon/>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
      );
    });
  }

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
        <div className={classes.root}>
          <List component="ul" className={classes.list}>
            {
              this.renderGridList(filteredContentItems)
            }
          </List>
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

export default withStyles(styles, {withTheme: true})(ContentList);
