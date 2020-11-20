import configureAxios from 'config/axiosConfig';
import configureStore from 'config/storeConfig';
import configureHistory from 'config/historyConfig';
import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from 'registerServiceWorker';
import App from 'App';
import * as UserActions from "actions/UserActions";
import {Provider} from "react-redux";
import {ConnectedRouter} from "connected-react-router";
import createRootReducer from 'actions/reducer';

export const history = configureHistory();
export const store = configureStore(history);
configureAxios(history, store);

store.dispatch((dispatch) => {
  dispatch(UserActions.initializeUser())
});

const root = document.getElementById('root');

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App history={history}/>
      </ConnectedRouter>
    </Provider>,
    root);
}

render();

if (module.hot) {
  module.hot.accept('App', () => {
    render()
  })
  module.hot.accept('actions/reducer', () => {
    store.replaceReducer(createRootReducer(history))
  })
}

registerServiceWorker();
