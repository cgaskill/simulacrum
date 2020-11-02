import axios from 'axios';
import _ from 'lodash';

export const TYPES = {
  UPDATE_USER: 'UPDATE_USER',
  LOAD_USER_FROM_TOKEN: 'LOAD_USER_FROM_TOKEN',
  LOAD_USER_FROM_TOKEN_SUCCESS: 'LOAD_USER_FROM_TOKEN_SUCCESS',
  LOAD_USER_FROM_TOKEN_FAILURE: 'LOAD_USER_FROM_TOKEN_FAILURE',
  RESET_TOKEN: 'RESET_TOKEN',
  LOGIN_USER_SUCCESS: 'LOGIN_USER_SUCCESS',
  LOGIN_USER_FAILURE: 'LOGIN_USER_FAILURE',
  LOGOUT_USER: 'LOGOUT_USER',
  USER_FROM_TOKEN: 'USER_FROM_TOKEN',
  GAPI_LOADED: 'GAPI_LOADED',
};

function setUserToken(token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  localStorage.setItem('accessToken', token);
}

export function getToken() {
  const token = localStorage.getItem('accessToken');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return token;
}

function clearToken() {
  axios.defaults.headers.common['Authorization'] = null;
  localStorage.removeItem('accessToken');
}

export function login(googleUser) {
  return (dispatch) => {
    const accessToken = googleUser.wc.access_token;
    setUserToken(accessToken);

    return axios.post('/api/users/login')
    .then((response) => {
      if (response.data.username) {
        dispatch(loginUserSuccess(response.data, accessToken));
      } else {
        dispatch(loginUserFailure(response.data));
      }
    })
    .catch((error) => {
      dispatch(loginUserFailure(error));
    });
  };
}

export function initializeUser(gapiLoaded) {
  return (dispatch) => {
    initializeGoogleAPI(dispatch, gapiLoaded);

    let token = getToken();
    if (_.isEmpty(token)) {
      dispatch(loadUserFromTokenFailure('No Token'));
      return;
    }

    // TODO check for an expired token
    return axios.get('/api/users/currentUser')
    .then((response) => {
      if (response.data.username) {
        dispatch(loadUserFromTokenSuccess(response.data, token));
      } else {
        dispatch(loadUserFromTokenFailure(response.data));
      }
    }).catch((error) => {
      dispatch(loadUserFromTokenFailure(error));
    });
  };
}

function initializeGoogleAPI(dispatch, gapiLoaded) {
  if (!gapiLoaded && window.gapi) {
    window.gapi.load('auth2', () => initSigninV2(dispatch));
    dispatch(setgapiLoaded());
  }
}

function initSigninV2(dispatch) {
  const auth2 = window.gapi.auth2.init({
    client_id: process.env.REACT_APP_GOOGLE_OAUTH2_CLIENTID,
    scope: 'profile',
  });

  auth2.currentUser.listen((user) => userChanged(dispatch, user));

  const user = auth2.isSignedIn.get();
  if (user) {
    auth2.signIn();
  }

  refreshValues(dispatch, auth2);
}

function userChanged(dispatch, user) {
  updateGoogleUser(dispatch, user);
}

function updateGoogleUser(dispatch, googleUser) {
  if (googleUser && googleUser.Zi) {
    dispatch(login(googleUser));
  }
}

function refreshValues(dispatch, auth2) {
  if (auth2) {
    const googleUser = auth2.currentUser.get();
    updateGoogleUser(googleUser);
  }
}

export function loadUserFromTokenSuccess(user, token) {
  setUserToken(token);
  return {
    type: TYPES.LOAD_USER_FROM_TOKEN_SUCCESS,
    user,
    token,
  };
}

export function setgapiLoaded() {
  return {
    type: TYPES.GAPI_LOADED,
  };
}

export function loadUserFromTokenFailure(error) {
  clearToken();
  return {
    type: TYPES.LOAD_USER_FROM_TOKEN_FAILURE,
    error,
  };
}

export function loginUserSuccess(user, token) {
  return {
    type: TYPES.LOGIN_USER_SUCCESS,
    user,
    token,
  };
}

export function loginUserFailure(error) {
  return {
    type: TYPES.LOGIN_USER_FAILURE,
    error,
  };
}

export function logoutUser() {
  clearToken();
  let auth2 = window.gapi.auth2.getAuthInstance();
  auth2.signOut();

  return {
    type: TYPES.LOGOUT_USER,
  };
}
