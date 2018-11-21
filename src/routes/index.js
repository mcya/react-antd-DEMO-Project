import React, { PropTypes } from 'react';
import { Router, Route, IndexRoute, Link, IndexRedirect } from 'react-router';
import loader from '../common/loader.jsx';
import App from '../apps/index';
//import Login from '../apps/login';
//import OrderInfo from '../apps/saleMgr/orderInfo';
import GhostContainer from '../components/GhostContainer';
import FrameContainer from '../components/FrameContainer';
import UserInfo from '../apps/userCenter/userInfo';
import NotFound from '../components/NotFound';
import { getUserAuth, cleanLoginInfo } from 'util'
import { generateRoutes } from './myrouters.js'



function validate(store, [nextState, replace]) {
  // 在路由群载入时做 filter 处理
  const userInfo = getUserAuth();
  if (!userInfo) {
    cleanLoginInfo();
    replace('/login');
  }
}


const Routes = ({ history, store }) =>
  <Router history={history}>
    {/* <Route path="/login"
      component={Login}
    /> */}

    <Route path="login" getComponent={(location, cb) => {
        require.ensure([], require => {
            cb(null, require('../apps/login'))
          }, 'login')
        }} />

    <Route path="/"
      component={App}
      onEnter={(...args) => {validate(store, args);}}
      onChange={(prevState, nextState) => {
        //路由切换新界面时，重置滚动条位置
        if (nextState.location.action !== 'POP') {
          window.scrollTo(0, 0);
        }
      }}
    >
    
      {/* 指定一个路由地址作为跳转地址 ~ 首页 */}
      {/* <IndexRedirect to="workBench" /> */}
      
      
      { generateRoutes() }
    </Route>
    <Route path="*" component={NotFound} />
  </Router>;

Routes.propTypes = {
  history: PropTypes.any,
  store: PropTypes.object
};
export default Routes;
