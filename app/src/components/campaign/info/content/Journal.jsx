import {withStyles} from '@material-ui/core/styles/index';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';
import {EditorState, convertToRaw, convertFromRaw} from 'draft-js';

import Editor from 'draft-js-plugins-editor';
import createToolbarPlugin from 'draft-js-static-toolbar-plugin';
import 'draft-js-static-toolbar-plugin/lib/plugin.css';
import {Promise} from 'q';
import _ from 'lodash';
import ContentModal from "components/campaign/info/content/ContentModal";

const drawerWidth = 200;

const styles = (theme) => ({
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
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
        left: 'auto',
        top: 'auto',
        zIndex: 9,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(2),
    },
    toolbar: theme.mixins.toolbar,
});

const toolbarPlugin = createToolbarPlugin();
const {Toolbar} = toolbarPlugin;

function fetchContent() {
    return new Promise((resolve, reject) => {
         const rawContent = window.localStorage.getItem('content');
         return resolve(JSON.parse(rawContent));
    });
}

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
        };
        this.onChange = (editorState) => {
            this.saveContent(editorState.getCurrentContent());
            this.setState({editorState});
        };
    }

    componentDidMount() {
        fetchContent()
            .then((content) => {
                console.log('fetched content:', content);
                this.setState({editorState: content ? EditorState.createWithContent(convertFromRaw(content)) : EditorState.createEmpty()});
            })
            .catch((err) => console.log('Error getting content:', err));
    }

    saveContent = _.throttle((content) => {
        console.log('persisting content to server', content);
        window.localStorage.setItem('content', JSON.stringify(convertToRaw(content)));
    }, 3000);

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
                    <List subheader={<ListSubheader>Journal</ListSubheader>}>
                        {
                            contentItems.map((contentItem, index) => {
                                return (
                                    <ListItem key={index}
                                              selected={this.state.selectedStoryEntry === contentItem.id}
                                              onClick={(e) => this.toggleSelectedStoryEntry(e, contentItem.id)}
                                              classes={{root: classes.tile}}>
                                        <ListItemText
                                          primaryTypographyProps={{noWrap: true}}
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
                        </React.Fragment>
                    }
                    {
                        this.state.selectedStoryEntry < 0 &&
                        <React.Fragment>
                            <TextField placeholder={'Header'}/>
                            <Toolbar/>
                            { this.state.editorState ? <Editor editorState={this.state.editorState}
                                    plugins={[toolbarPlugin]}
                                    onChange={this.onChange}/> : <span>Loading...</span> }
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
