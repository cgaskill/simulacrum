import {contentReducer} from 'actions/ContentReducer';
import {combineReducers} from 'redux';
import {userReducer} from './UserReducer';
import {campaignReducer} from 'actions/CampaignReducer';
import {reducer as formReducer} from 'redux-form';
import {notificationReducer} from 'actions/NotificationsReducer';
import {gameReducer} from 'actions/GameReducer';

export default combineReducers({
  user: userReducer,
  notifications: notificationReducer,
  campaigns: campaignReducer,
  content: contentReducer,
  form: formReducer,
  game: gameReducer,
});
