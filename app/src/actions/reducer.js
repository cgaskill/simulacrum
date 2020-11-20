import {contentReducer} from 'actions/ContentReducer';
import {combineReducers} from 'redux';
import {userReducer} from 'actions/UserReducer';
import {campaignReducer} from 'actions/CampaignReducer';
import {reducer as formReducer} from 'redux-form';
import {notificationReducer} from 'actions/NotificationsReducer';
import {gameReducer} from 'actions/GameReducer';
import { connectRouter } from 'connected-react-router'

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  user: userReducer,
  notifications: notificationReducer,
  campaigns: campaignReducer,
  content: contentReducer,
  form: formReducer,
  game: gameReducer,
})
export default createRootReducer