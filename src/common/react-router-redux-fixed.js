import syncHistoryWithStore from 'react-router-redux/lib/sync'
import { LOCATION_CHANGE, routerReducer } from 'react-router-redux/lib/reducer'
import {
    CALL_HISTORY_METHOD,
    push, replace, go, goBack, goForward,
    routerActions
  } from 'react-router-redux/lib/actions'
import routerMiddleware from 'react-router-redux/lib/middleware'

export {
   syncHistoryWithStore,
   LOCATION_CHANGE, routerReducer,
   CALL_HISTORY_METHOD, push, replace, go, goBack, goForward, routerActions,
   routerMiddleware
 }
