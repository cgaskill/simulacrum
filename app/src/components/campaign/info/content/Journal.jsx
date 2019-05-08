import {withStyles} from '@material-ui/core/styles/index';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ContentModal from './ContentModal';
import Drawer from '@material-ui/core/Drawer';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
// import Dante from 'Dante2';
import TextField from '@material-ui/core/TextField';
import {EditorState} from 'draft-js';

import Editor from 'draft-js-plugins-editor';
import createToolbarPlugin from 'draft-js-static-toolbar-plugin';
import 'draft-js-static-toolbar-plugin/lib/plugin.css';

const drawerWidth = 240;

const styles = (theme) => ({
    fab: {
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },
    root: {
        display: 'flex',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        left: drawerWidth,
        zIndex: 9,
    },
    content: {
        flexGrow: 1,
        paddingLeft: theme.spacing.unit * 2,
    },
    toolbar: theme.mixins.toolbar,
});

const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;

class Journal extends Component {
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
            selectedStoryEntry: -1,
            editorState: EditorState.createEmpty()
        };
        this.onChange = (editorState) => this.setState({editorState});
    }

    render() {
        const {classes, contentItems} = this.props;
        if (contentItems == null) {
            return null;
        }

        return (
            <React.Fragment>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}>
                    <div className={classes.toolbar}/>
                    <List subheader={<ListSubheader>Journal</ListSubheader>}>
                        {
                            contentItems.map((contentItem, index) => {
                                return (
                                    <ListItem key={index}
                                              selected={this.state.selectedStoryEntry === contentItem.id}
                                              onClick={(e) => this.toggleSelectedStoryEntry(e, contentItem.id)}
                                              classes={{root: classes.tile}}>
                                        <ListItemText
                                            primary={contentItem.name}
                                        />
                                    </ListItem>
                                );
                            })
                        }
                        {/* TODO create an add button for new entries*/}
                    </List>
                </Drawer>
                {/* TODO configure persistence of story*/}
                <div className={classes.content}>
                    {
                        this.state.selectedStoryEntry > -1 &&
                        <React.Fragment>
                            <TextField placeholder={'Header'}/>
                            <Editor editorState={this.state.editorState}
                                    placeholder={'You\'re in a tavern...'}
                                    plugins={[toolbarPlugin]}
                                    onChange={this.onChange}/>
                            {/*<Dante body_placeholder={'Two Dwarfs walked into a bar...'}/>*/}
                        </React.Fragment>
                    }
                    {
                        this.state.selectedStoryEntry < 0 &&
                        <React.Fragment>
                            <TextField placeholder={'Header'}/>
                            <Toolbar/>
                            <Editor editorState={this.state.editorState}
                                    plugins={[toolbarPlugin]}
                                    onChange={this.onChange}/>
                            {/*<Dante body_placeholder={'Two Dwarfs walked into a bar...'}/>*/}
                        </React.Fragment>
                    }
                </div>
                <ContentModal initialValues={null}
                              handleClose={(e) => this.handleCloseContentItemModal(e)}
                              isOpen={this.state.isContentItemModalOpen}
                              campaignId={this.props.campaignId}
                              putContentItem={this.props.putContentItem}/>
            </React.Fragment>);
    }

    toggleSelectedStoryEntry(e, id) {
        if (this.state.selectedStoryEntry === id) {
            this.setState({selectedStoryEntry: -1});
        } else {
            this.setState({selectedStoryEntry: id});
        }
    }
}

export default withStyles(styles, {withTheme: true})(Journal);
