import * as UserActions from 'actions/UserActions';
import {TYPES} from 'actions/UserActions';

export const INITIAL_STATE = {
  isLoggedIn: false,
  isLoaded: false,
  info: null,
  gapiLoaded: false,
  token: UserActions.getToken(),
};

export function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.LOAD_USER_FROM_TOKEN:
      return {...state, info: null, isLoggedIn: false, isLoaded: false};
    case TYPES.LOAD_USER_FROM_TOKEN_SUCCESS:
      return {...state, info: action.user, token: action.token,
        isLoggedIn: true, isLoaded: true};
    case TYPES.LOAD_USER_FROM_TOKEN_FAILURE:
      return {...state, info: null, isLoggedIn: false, isLoaded: true};
    case TYPES.LOGIN_USER_SUCCESS:
      return {...state, info: action.user, token: action.token,
        isLoggedIn: true, isLoaded: true};
    case TYPES.LOGOUT_USER:
      return {...state, info: null, isLoggedIn: false, isLoaded: true};
    case 'TIMEOUT':
      return {...state, info: null, isLoggedIn: false, isLoaded: true};
    default:
      return state;
  }
}

