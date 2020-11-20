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

export function login(authResponse) {
  return (dispatch) => {
    const accessToken = authResponse.access_token;
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

export function initializeUser() {
  return (dispatch) => {
    initializeGoogleAPI(dispatch);

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

function initializeGoogleAPI(dispatch) {
  if (!window.gapi) {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/client.js";
    script.onload = () => {
      const initClient = () => {
        const config = {
          client_id: process.env.REACT_APP_GOOGLE_OAUTH2_CLIENTID,
          scope: 'profile',
        }
        window.gapi.client.init(config).then(() => {
          const auth2 = window.gapi.auth2.getAuthInstance();
          auth2.isSignedIn.listen((isSignedIn) => handleSigninStatusChange(dispatch, isSignedIn));

          const currentUser = auth2.currentUser.get();
          const authResponse = currentUser.getAuthResponse(true);
          if (authResponse && currentUser) {
            dispatch(login(authResponse));
          }
        });
      };
      window.gapi.load("client:auth2", initClient);
    };

    document.body.appendChild(script);
  }
}

function handleSigninStatusChange(dispatch, isSignedIn) {
  const auth2 = window.gapi.auth2.getAuthInstance();
  if (isSignedIn) {
    const currentUser = auth2.currentUser.get();
    const authResponse = currentUser.getAuthResponse(true);
    if (authResponse) {
      dispatch(login(authResponse));
    }
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
