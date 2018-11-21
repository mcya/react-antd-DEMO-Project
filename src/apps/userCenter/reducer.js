import { createReducer } from '../../util';
import { Map } from 'immutable';
import { message } from 'antd';
import MsgBox from 'MsgBox';

const initialState = Map({
  getPostRes: { //根据部门id获取所属公司和所属部门
    success: false,
    data: null,
    message: null,
    code: 0
  },
  validOldPswRes: { //校验旧密码
    success: false,
    data: null,
    message: null,
    code: 0
  },
  updPswLoading: false,
  updatePswRes: { //修改密码
    success: false,
    data: [],
    message: null,
    code: 0
  },
  headImgUrl: null
});

export default createReducer(initialState, {
  'userCenter.userInfo.getPost_bypar_PENDING': (state, data) => { //所属部门
    return state
  },
  'userCenter.userInfo.getPost_bypar_ERROR': (state, data) => {
    return state
  },
  'userCenter.userInfo.getPost_bypar_SUCCESS': (state, data, params) => {
    return state.set('getPostRes', data.jsonResult)
  },

  'userCenter.userInfo.getOldPsw_bypar_PENDING': (state, data) => { //校验旧密码
    return state
  },
  'userCenter.userInfo.getOldPsw_bypar_ERROR': (state, data) => {
    return state
  },
  'userCenter.userInfo.getOldPsw_bypar_SUCCESS': (state, data, params) => {
    return state.set('validOldPswRes', data.jsonResult)
  },

  'userCenter.userInfo.updPsw_bypar_PENDING': (state, data) => { //修改密码
    state.get('validOldPswRes').success = false;
    return state.set('updPswLoading', true);
  },
  'userCenter.userInfo.updPsw_bypar_ERROR': (state, data) => {
    message.error(data);
    return state.set('updPswLoading', false);
  },
  'userCenter.userInfo.updPsw_bypar_SUCCESS': (state, data, params) => {
    message.success(data.jsonResult.message);
    return state.set('updPswLoading', false)
                .set('updatePswRes', data.jsonResult)
  },

  'userCenter.userInfo.headImg': (state, data, params) => {
    return state.set('headImgUrl', params);
  }
})
