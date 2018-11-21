import { createStore, applyMiddleware, compose } from 'redux'
import { Map } from 'immutable';
import { combineReducers } from 'redux-immutable';
import routing from '../reducers/routeReducer';
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux-fixed';
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import promiseMiddleware from './middlewares/promiseMiddleware';
import rootReducer from '../reducers'
import { DataUtil } from 'util';


export default function configureStore(initialState = Map()) {
  const middleware = [
    thunkMiddleware,
    routerMiddleware(hashHistory),
    promiseMiddleware({ promiseTypeSuffixes: ['PENDING', 'SUCCESS', 'ERROR'] }),
    process.env.NODE_ENV === 'development' && createLogger()
  ].filter(Boolean);
  const enhancer = compose(
    applyMiddleware(...middleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  );
  const store = createStore(combineReducers({
    ...rootReducer, routing
  }), initialState, enhancer);

  DataUtil.setStore(store);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const reducers = require('../reducers');
      console.log('重载主Reducers:', reducers);
      //unmountComponentAtNode(rootElement); 貌似可以解决reducer和action热替换的问题
      const nextReducers = combineReducers({ ...reducers, routing });
      store.replaceReducer(nextReducers);
    });
    /*const context = require.context('../apps/', true, /^\.\/.+(reducer)\.js$/);
    module.hot.accept(context.id,() => {
      console.log('重载所有模块的reducers');
      const reducers = require('../reducers');
      const nextReducers = combineReducers({...reducers, routing});
      store.replaceReducer(nextReducers);
    });*/
  }

  return store
}
