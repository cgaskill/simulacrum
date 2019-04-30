import IconButton from '@material-ui/core/IconButton';
import {withStyles} from '@material-ui/core/styles/index';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import _ from "lodash";
import ContentModal from "./ContentModal";

const styles = (theme) => ({
    fab: {
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },
});

class StoryList extends Component {
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
            isContentItemModalOpen: false,
            hoverContentItemId: -1,
        };
    }

    handleEditStory = (e, contentItems) => {
        // TODO make story entry editable
    };

    handleOpenContentItemModal = (event) => {
        event.preventDefault();
        event.stopPropagation();

        this.setState({isContentItemModalOpen: true});
    };

    handleCloseContentItemModal = () => {
        this.setState({isContentItemModalOpen: false});
    };

    handleHoverStoryEntry = (e, hoverContentItemId) => {
        console.log(hoverContentItemId);
        this.setState({hoverContentItemId});
    };

    render() {
        const {classes, contentItems} = this.props;
        if (contentItems == null) {
            return null;
        }

        return (
            <React.Fragment>
                <Grid container spacing={32}>
                    {
                        contentItems.map((contentItem, index) => {
                            console.log(contentItem);
                            return (
                                <ListItem key={index}
                                          classes={{root: classes.tile}}>
                                    <ListItemText
                                        primary={contentItem.notes}
                                        onMouseEnter={(e) => this.handleHoverStoryEntry(e, contentItem.id)}
                                        onMouseLeave={(e) => this.handleHoverStoryEntry(e, -1)}
                                    />
                                    {this.state.hoverContentItemId === contentItem.id &&
                                    <ListItemSecondaryAction>
                                        <IconButton className={classes.icon}
                                                    onClick={(e) => this.handleEditStory(e, contentItem)}>
                                            <EditIcon/>
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                    }
                                </ListItem>
                            );
                        })
                    }
                </Grid>
                <Fab color="primary" aria-label="Add" className={classes.fab} onClick={this.handleOpenContentItemModal}>
                    <AddIcon/>
                </Fab>

                <ContentModal initialValues={null}
                              handleClose={(e) => this.handleCloseContentItemModal(e)}
                              isOpen={this.state.isContentItemModalOpen}
                              campaignId={this.props.campaignId}
                              putContentItem={this.props.putContentItem}/>
            </React.Fragment>);
    }
}

export default withStyles(styles, {withTheme: true})(StoryList);
