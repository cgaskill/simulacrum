import _ from 'lodash';
import {TYPES} from 'actions/NotificationActions';

const INITIAL_STATE = {
  isLoggedIn: false,
  isLoaded: false,
  info: null,
  isLoadedNotifications: false,
  instances: [],
};

export function notificationReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.LOAD_NOTIFICATIONS_START:
      return {...state, isLoadedNotifications: false};
    case TYPES.LOAD_NOTIFICATIONS_SUCCESS:
      return {...state, instances: action.notifications, isLoadedNotifications: true};
    case TYPES.LOAD_NOTIFICATIONS_FAILURE:
      return {...state, instances: [], isLoadedNotifications: true};
    // case TYPES.MARK_NOTIFICATION_READ_START:
      // return { ...state, instances: [], isLoadedNotifications: false};
    case TYPES.MARK_NOTIFICATION_READ_SUCCESS:
      return {...state, instances: replace(state.instances, action.notification)};
    // case TYPES.MARK_NOTIFICATION_READ_FAILURE:
    //   return { ...state, instances: [], isLoadedNotifications: true};
    default:
      return state;
  }
}

const replace = (notifications, notification) => {
  const newNotifications = _.filter(notifications, (n) => {
    return notification.id !== n.id;
  });
  newNotifications.push(notification);
  return newNotifications;
};
