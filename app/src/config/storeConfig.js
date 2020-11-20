import {routerMiddleware} from 'connected-react-router';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import createRootReducer from 'actions/reducer';

const configureStore = (history) => {
  const preloadedState = {

  };

  return createStore(
    createRootReducer(history),
    preloadedState,
    applyMiddleware(
      routerMiddleware(history),
      thunk
    )
  );
};

export default configureStore;
