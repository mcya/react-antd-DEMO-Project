import React, { PropTypes } from 'react';
import { Route } from 'react-router';

export const generateRoutes = () => {
  console.log('genRouterTime: 2018-03-27 17:16:42');

  const result = [];
  
  result.push(
    <Route key="login" path="login" getComponent={(location, cb) => {
      require.ensure([], require => {
          cb(null, require('../apps/login'))
        }, 'login')
      }}
    />
  );
  
  
  return result;
}
