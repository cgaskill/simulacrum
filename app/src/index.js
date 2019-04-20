import configureAxios from 'config/axiosConfig';
import configureStore from 'config/storeConfig';
import configureHistory from 'config/historyConfig';
import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import App from './App';

export const history = configureHistory();
export const store = configureStore(history);
configureAxios(history, store);

const root = document.getElementById('root');
ReactDOM.render(<App store={store} history={history}/>, root);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render(<NextApp store={store} history={history}/>, root);
  });
}

registerServiceWorker();
