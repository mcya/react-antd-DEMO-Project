// Use require.context to require reducers automatically
// Ref: https://webpack.github.io/docs/context.html
/*const context = require.context('./', true, /\.js$/);
const keys = context.keys().filter((item) => {return item !== './index.js' && /([^\/]+)_reducer\.js$/.test(item); });

const reducers = keys.reduce((memo, key) => {
  memo[key.match(/([^\/]+)_reducer\.js$/)[1]] = context(key);
  return memo;
}, {});

console.dir(Object.keys(reducers));*/

import AppReducer from '../apps/reducer';
import Immutable from 'immutable';
import { combineReducers } from 'redux-immutable';
import _isEmpty from 'lodash/isEmpty';
import _clone from 'lodash/clone';

const appPaths = {};
const modules = {};
const context = require.context('../apps/', true, /^\.\/.+(reducer)\.js$/);
const appkeys = context.keys();
const logModuleLoad = (name, module, isReload) => console.log(`module ${name} ${isReload ? 're' : ''}loaded !`);


appkeys.forEach((item) => {
  const parts = item.split('/');
  const module = context(item);
  modules[item] = module;
  // logModuleLoad(item,module,false);
  parts.forEach((part, index) => {
    if (part !== '.') {
      let cps = appPaths;//当前路径对象
      const cpath = ['.'];
      for (let i = 1; i < index; i++) {
        const pi = parts[i];
        cpath.push(pi);
        if (!cps[pi]) cps[pi] = {};
        cps = cps[pi];
      }
      if (index == parts.length - 1) {
        cps['reducer'] = cpath.join('/')+`/${parts[index]}`;
      }
    }
  })
});
// console.log('module ars paths', appPaths);

const reducerPathMap = Immutable.fromJS(appPaths);
/**
const travelModules = (cmod, parent = {}, path = []) => {
  const subModNames = Object.keys(cmod);
  //判断当前路径下是否有reducer
  if (subModNames.indexOf('reducer') > -1) {
    const currentPath = _clone(path);
    let modName = `${path[path.length - 1]}`;
    //判断路径是父节点并有reducer的话，由于object的key无法重复自动加上下划线_[modeName]
    if (subModNames.length > 1) {
      modName = `_${path[path.length - 1]}`;
    }
    currentPath.push('reducer');
    const modeReucer = context(reducerPathMap.getIn(currentPath));
    //注册对应路径的reducer，警告非法的reducer
    if (typeof modeReucer === 'function') {
      parent[modName] = modeReucer
    } else {
      console.warn('非法的reducer, reducer必须是一个function', currentPath);
    }
  }
  const realParent = parent; //把参数里的父级对象存起来
  if (path.length > 0) {
    const modeName = `${path[path.length - 1]}`;
    parent = parent[modeName]; //如果当前路径不是根路径，将parent对象指向对应路径的对象
  }
  let subModeCount = 0;
  subModNames.forEach((modeName) => {
    if (modeName === 'reducer') return;
    if (!parent[modeName]) {
      parent[modeName] = {}; //初始化子模块对象
    }
    const nextPath = _clone(path);
    nextPath.push(modeName);
    // console.log(nextPath, parent, modeName);
    travelModules(cmod[modeName], parent, nextPath); //递归到找不到子模块
    subModeCount++;
  });
  if (subModeCount > 0 && path.length > 0) {
    const modeName = `${path[path.length - 1]}`;
    realParent[modeName] = combineReducers(parent);
    // realParent[modeName] = { _: '...', ...parent };
  }
}**/

/*const travelTree = {};
travelModules(appPaths, travelTree);
console.log('travleTree', travelTree);*/

const getReducer = (path) => {
  const reducer = reducerPathMap.getIn(path);
  if (!reducer) {
    console.error('reducer不存在!', path)
  }
  return reducer;
}

//这里设置reducer对象树
const reducerTree = {
  //登录
  //login: context(getReducer(['login', 'reducer'])),
  //项目准备
  // projectPre: combineReducers({
  //   projectMgr: context(getReducer(['projectPre', 'projectMgr', 'reducer'])),
	// 	businessParam: context(getReducer(['projectPre', 'businessParam', 'reducer'])),
  //   _businessParam: combineReducers({
  //     ylzd: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'ylzd', 'reducer'])),
  //     dlhtset: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'dlhtset', 'reducer'])),
  //     pdaquerysetting: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'pdaquerysetting', 'reducer'])),
  //     hkaddress: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'hkaddress', 'reducer'])),
  //     // pdaquerysetting: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'pdaquerysetting', 'reducer'])),
  //     afterSerFileDict: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'dictitem', 'afterSerFile', 'reducer'])),
  //     paramgroup: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'dictitem', 'group', 'reducer'])),
  //     paramproject: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'dictitem', 'project', 'reducer'])),
  //     chooseroom: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'chooseroom', 'reducer'])),
  //     agencyrule: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'agencyrule', 'reducer'])),
  //     propertydateset: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'propertydateset', 'reducer'])),
  //     vatset: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'vatset', 'reducer'])),
  //     saleprocset: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'saleprocset', 'reducer'])),
  //     saleservprocset: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'saleservprocset', 'reducer'])),
  //     areabcfaset: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'areabcfaset', 'reducer'])),
  //     yearrate: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'yearrate', 'reducer'])),
  //     paramsyscompany: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'sysparam', 'company', 'reducer'])),
  //     paramsysgroup: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'sysparam', 'group', 'reducer'])),
  //     paramsysproject: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'sysparam', 'project', 'reducer'])),
  //     tddksz: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'tddksz', 'reducer'])),
  //     rgdForm: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'rgdForm', 'reducer'])),
  //     anjieyinhang: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'anjieyinhang', 'reducer'])),
  //     wqyuanying: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'wqyuanying', 'reducer'])),
  //     zjlx: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'zjlx', 'reducer'])),
  //     namesetting: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'namesetting', 'reducer'])),
  //     payment: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'payment', 'reducer'])),
  //     mortgageBankLenders: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'mortageBankLenders', 'reducer'])),
  //     mortgageBankLendersAndRange: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'mortageBankLendersAndRange', 'reducer'])),
  //     salemodel: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'salemodel', 'reducer'])),
  //     cfChangeCause: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'confessChangeCause', 'reducer'])),
  //     orgName: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'orgName', 'reducer'])),
  //     letterMgr: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'letterMgr', 'reducer'])),
  //     delayCert: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'delayCert', 'reducer'])),
  //     debtReason: context(getReducer(['projectPre', 'businessParam', 'component', 'modal', 'debtReason', 'reducer'])),
  //   }),
  //   payment: context(getReducer(['projectPre', 'payment', 'reducer'])),
  //   zengsong: context(getReducer(['projectPre', 'zengsong', 'reducer'])),
  //   discount: context(getReducer(['projectPre', 'discount', 'reducer'])),
  //   house: context(getReducer(['projectPre', 'house', 'reducer'])),
  //   priceMgr: context(getReducer(['projectPre', 'priceMgr', 'reducer'])),
  //   roomMgr: context(getReducer(['projectPre', 'roomMgr', 'reducer'])),
  //   fengpanMsg: context(getReducer(['projectPre', 'roomMgr', 'component', 'modal', 'fengpanMsg', 'reducer'])),
  //   compensatePrice: context(getReducer(['projectPre', 'compensatePrice', 'reducer']))
  // }),
  // //财务
  // //财务
  // finance: combineReducers({
  // 	  invoice: context(getReducer(['finance', 'invoice', 'reducer'])),//票据管理
  //     ysk: context(getReducer(['finance', 'crmt', 'ysk', 'reducer'])),
  //     interface: context(getReducer(['finance', 'interface', 'reducer'])),//财务接口
  //     query: context(getReducer(['finance', 'crmt', 'query', 'reducer'])), //单据查询
  //     payment: context(getReducer(['finance', 'crmt', 'payment', 'reducer'])), //款项明细查询
  //     housePay: context(getReducer(['finance', 'crmt', 'housePay', 'reducer'])), //房款管理
  //     crmt: context(getReducer(['finance','crmt','reducer'])),//收支管理
  //     voucherMgr: context(getReducer(['finance','voucherMgr','reducer'])),//凭证管理
  //     dsf: context(getReducer(['finance', 'agencyFund', 'reducer'])),//代收费管理
  //     loan: context(getReducer(['finance', 'crmt', 'loan', 'reducer'])),//银行批量放款
  //     printer: context(getReducer(['finance', 'crmt', 'printer', 'reducer']))
  // }),
  // //系统
  // system: combineReducers({
  //   user: context(getReducer(['system', 'user', 'reducer'])),
  //   log: context(getReducer(['system', 'log', 'reducer'])),
  //   org: context(getReducer(['system', 'org', 'reducer'])),
  //   manage: context(getReducer(['system', 'manage', 'reducer'])),
  //   sysSet: context(getReducer(['system', 'sysSet', 'reducer'])),
  //   general: context(getReducer(['system', 'general', 'reducer'])),
  //   shortMsg: context(getReducer(['system', 'shortMsg', 'reducer'])),
  //   docManage: context(getReducer(['system', 'docManage', 'reducer']))
  // }),
  // _system: context(getReducer(['system', 'reducer'])),
  // batchOpen: combineReducers({
  //   confessInfo: context(getReducer(['batchOpen', 'confessInfo', 'reducer'])),
  //   confessDetail: context(getReducer(['batchOpen', 'confessDetail', 'reducer'])),
  //   openAnalysis: context(getReducer(['batchOpen', 'openAnalysis', 'reducer'])),
  //   signRGS: context(getReducer(['batchOpen', 'signRGS', 'reducer']))
  // }),
  // //大开盘
  // largeBatchOpen: combineReducers({
  //   common: context(getReducer(['largeBatchOpen', 'common', 'reducer'])),
  // }),
  //  //售后
  // afterSer: combineReducers({
  //   contractSer: context(getReducer(['afterSer', 'contractSer', 'reducer'])),
  //   areaCompensate: context(getReducer(['afterSer', 'areaCompensate', 'reducer'])),
  //   loansSer: context(getReducer(['afterSer', 'loansSer', 'reducer'])),
  //   occupationSer: context(getReducer(['afterSer', 'occupationSer', 'reducer'])),
  //   propertySer: context(getReducer(['afterSer', 'propertySer', 'reducer'])),
  //   serOverview: context(getReducer(['afterSer', 'serOverview', 'reducer'])),
  //   andreminders: context(getReducer(['afterSer', 'andreminders', 'reducer'])),
  //   pushSign: context(getReducer(['afterSer', 'pushSign', 'reducer'])),
  //   contractClaim: context(getReducer(['afterSer', 'contractClaim', 'reducer'])),
  //   }),
  // _afterSer: context(getReducer(['afterSer', 'reducer'])),
  // //交易管理
  // saleMgr: combineReducers({
  //   myDesk: context(getReducer(['saleMgr', 'myDesk', 'reducer'])),
  //   searchResult: context(getReducer(['saleMgr', 'searchResult', 'reducer'])),
  //   roomInfo: context(getReducer(['saleMgr', 'roomInfo', 'reducer'])),
  //   orderInfo: context(getReducer(['saleMgr', 'orderInfo', 'reducer'])),
  //   tradeList: context(getReducer(['saleMgr', 'tradeList', 'reducer'])),
  //   changeLog: context(getReducer(['saleMgr', 'changeLog', 'reducer'])),
  //   bpmTable: context(getReducer(['saleMgr', 'bpmTable', 'reducer'])),
  //   houseQuery: context(getReducer(['saleMgr', 'houseQuery', 'reducer'])),
  //   btXk: context(getReducer(['saleMgr', 'btXk', 'reducer'])),
  //   housingBind: context(getReducer(['saleMgr', 'housingBind', 'reducer'])),
  //   mortManage: context(getReducer(['saleMgr', 'mortManage', 'reducer'])),
  //   recZp: context(getReducer(['saleMgr', 'recZp', 'reducer'])),
  //   repurchase: context(getReducer(['saleMgr', 'repurchase', 'reducer'])),
  //   customerAcc: context(getReducer(['saleMgr', 'customerAcc', 'reducer'])),
  //   special: context(getReducer(['saleMgr', 'customerAcc', 'component', 'customerFolder', 'reducer'])),
  //   batchRefund: context(getReducer(['saleMgr', 'batchRefund', 'reducer'])),
  //   printer: context(getReducer(['saleMgr', 'orderInfo', 'component', 'printer', 'reducer'])),
  //   changePayment: context(getReducer(['saleMgr', 'orderInfo', 'component', 'modal', 'changePayment', 'reducer'])),
  //   agentModal: context(getReducer(['saleMgr', 'orderInfo', 'component', 'modal', 'agentModal', 'reducer'])),
  //   memo: context(getReducer(['saleMgr', 'orderInfo', 'component', 'memo', 'reducer'])),
  //   commision: context(getReducer(['saleMgr', 'commision', 'reducer']))
  // }),
  // _saleMgr: context(getReducer(['saleMgr', 'reducer'])),
  // //工作台
  // workBench: combineReducers({
  //   bill: context(getReducer(['workBench', 'bill', 'reducer'])),
  //   myDesks: context(getReducer(['workBench', 'myDesks', 'reducer']))
  // }),
  // tdprint:combineReducers({
	//   template:context(getReducer(['tdprint', 'template', 'reducer'])),
  //   receipt:context(getReducer(['tdprint', 'receipt', 'reducer'])),
  // }),
  // workflow:combineReducers({
	//   mywork:context(getReducer(['workflow', 'mywork', 'reducer'])),
  //   myworked:context(getReducer(['workflow', 'myworked', 'reducer'])),
  //   myworkhi:context(getReducer(['workflow', 'myworkhi', 'reducer'])),
  //   startwork:context(getReducer(['workflow', 'startwork', 'reducer'])),
  //   myMonitor:context(getReducer(['workflow', 'myMonitor', 'reducer'])),
  //   myread:context(getReducer(['workflow', 'myread', 'reducer'])),
  //   myreaded:context(getReducer(['workflow', 'myreaded', 'reducer'])),
  //   myproxy:context(getReducer(['workflow', 'myproxy', 'reducer'])),
  //   myworksseek:context(getReducer(['workflow', 'myworksseek', 'reducer'])),
  //   myworkedseek:context(getReducer(['workflow', 'myworksseek', 'myworkedseek', 'reducer'])),
  //   myworkhiseek:context(getReducer(['workflow', 'myworksseek', 'myworkhiseek', 'reducer'])),
  //   myworkseek:context(getReducer(['workflow', 'myworksseek', 'myworkseek', 'reducer']))
  // }),
  // //报表
  // reportForm: combineReducers({
  //   count: context(getReducer(['reportForm', 'count', 'reducer'])),
  //   reportManage: context(getReducer(['reportForm', 'reportManage', 'reducer']))
  // }),
  // //用户中心
  // userCenter: combineReducers({
  //   userInfo: context(getReducer(['userCenter', 'reducer']))
  // }),
  // letterMgr: combineReducers({
  //   letter: context(getReducer(['letterMgr', 'reducer']))
  // }),
  // //客户管理
  // customerMgr: combineReducers({
  //   customerGoal: context(getReducer(['customerMgr', 'customerGoal', 'reducer'])),
  // }),
  // // 微信开盘
  // vxKp: context(getReducer(['vxKp', 'reducer'])),
  // // 报团系统
  // btSystem: context(getReducer(['btSystem', 'reducer'])),
  // // 费控管理
  // fkMgr: context(getReducer(['fkMgr', 'reducer'])),
}
// console.log('reducerTree', reducerTree);


export default { APP: AppReducer, ...reducerTree };
