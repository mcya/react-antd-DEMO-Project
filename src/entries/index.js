import './index.html';
import './index.less';
import promise from 'es6-promise'
import ReactDOM from 'react-dom';
import React from 'react';
import RedBox from 'redbox-react';
import { hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux-fixed';
import '../common/echarts-themes/clear';
// import '../common/echarts-themes/infographic';
import '../common/echarts-themes/macarons';
// import '../common/echarts-themes/westeros';

promise.polyfill();
const Provider = require('react-redux').Provider;
const configureStore = require('../store/configureStore');
const store = configureStore();

//连接redux和router
const history = syncHistoryWithStore(hashHistory, store, {
  selectLocationState(state) {
    return state.get('routing').toObject();
  }
});

////////////////////
////render//
let render = () => {
  const Routes = require('../routes');
  ReactDOM.render(
    <Provider store={store}>
      <Routes history={history} store={store} />
    </Provider>,
    document.getElementById('root')
  );
};

if (module.hot) {
  const renderNormally = render;
  const renderException = (error) => {
    ReactDOM.render(<RedBox error={error} />, document.getElementById('root'));
  };
  render = () => {
    try {
      renderNormally();
    } catch (error) {
      renderException(error);
      console.error('error', error);
    }
  };
  module.hot.accept('../routes', () => {
    render()
  });
}

render();
