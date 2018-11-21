import { push } from 'react-router-redux-fixed'
import * as Api from './api'
import { parseParam, getCurrentUser, getUserMenus, getUserOrgs, cacheLoginInfo, getUserTokens, getHzHost } from 'util'
import _isEmpty from 'lodash/isEmpty'
import { PostJsonBody } from 'xFetch';
