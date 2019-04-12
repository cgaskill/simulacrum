import {connectRouter, routerMiddleware} from 'connected-react-router';
import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from 'actions';
import * as UserActions from 'actions/UserActions';

const configureStore = (history) => {
  const initialState = {
    user: {
      token: UserActions.getToken(),
    },
  };

  const enhancers = [];
  const middleware = [
    thunk,
    routerMiddleware(history),
  ];

  if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension());
    }

    if (module.hot) {
      module.hot.accept('../actions', () => {
        store.replaceReducer(rootReducer);
      });
    }
  }

  const composedEnhancers = compose(
      applyMiddleware(...middleware),
      ...enhancers
  );

  const store = createStore(
      connectRouter(history)(rootReducer),
      initialState,
      composedEnhancers
  );

  return store;
};

export default configureStore;
