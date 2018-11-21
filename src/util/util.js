import { CURRENT_USER, USER_MENU, CURRENT_ORG, CURRENT_PROJECT, USER_ORGS, USER_TOKENS, USER_AUTH, HZ_HOST,BPM_HOST, SERV_HOST, VK_HOST } from '../constants'
import { message } from 'antd';
import _omitBy from 'lodash/omitBy'
import _isNil from 'lodash/isNil'
import _now from 'lodash/now'
import _isEmpty from 'lodash/isEmpty'
import Cookies from 'js-cookie'

export const noop = function noop() {}

/**
 * createReducer(initialparams, reducerMap)
 *
 * desc：
 * 自定义创建 `Reducer`
 *
 * 参数：
 * 1、 `initialparams` 初始 `params` 对象
 * 2、 `reducerMap` 与 `Action` 的映射关系, 判断 `action.type`的值， `promise` 的处理结果会由中间件 + `_SUCCESS、_ERROR、PENDING` 返回。
 *
 * 例 `reducerMap` 参数形式：
 * {
 *   [`${types.GET_SITE_INFO}_SUCCESS`]: (params, data) => {
 *     return params.set('siteInfo', data)
 *   },

 *   [`${types.GET_SITE_STATS}_SUCCESS`]: (params, data) => {
 *     return params.set('siteStats', data)
 *   },

 *   [`${types.GET_ALL_NODES}_SUCCESS`]: (params, data) => {
 *     return params.set('nodes', data)
 *   }
 * }
 *
 * 返回值：
 * 使用 `es6` 语法返回一个 `function(params = initialparams, action){}` -> `(params = initialparams, action) => {}`
 * 函数内部：取出当前传入的 `action.type` 值，匹配 `reducerMap` 中对应的 `key` 值？ 有匹配值则返回 `reducerMap` 所对应的方法 `(params, data) => {}` 进行处理, 没有则直接返回 `initialSparams`
 *
 */
export function createReducer (initialparams, reducerMap) {
  return (params = initialparams, action) => {
    const reducer = reducerMap[action.type];
    /*
      TODP：判断 `请求` 返回的 `Code` 显示服务端提示信息。
     */

    // console.log('action', action);
    if (!action.error && action.payload && action.payload.code && action.payload.code != '0') {
      message.error(action.payload.message);
      if (params.get('loading')) {
        return params.set('loading', false);
      } else {
        return params;
      }
    }

    return reducer ? reducer(params, action.payload ? action.payload : {}, action.params) : params
  }
}

/**
 * fixNumber(date)
 *
 * desc：
 * 修复时间字符串，判断时间长度是否满足要求，不满足则根据长度差距在其末尾不足 '0'
 *
 * 参数：
 * `date` 时间 String
 *
 * 默认 `dataLength` = 13
 */
const fixNumber = function(date) {
  const dateLength = 13;
  const len = date.length;

  let diffLen = dateLength - len;
  let diff = '';

  while (diffLen) {
    diff += '0';
    diffLen--;
  }

  return date + diff;
};

/**
 * dateFormat(data, format)
 *
 * desc：
 * 时间格式化，默认为 `yyyy-MM-dd` 类型
 *
 * 懵逼了，需要啃下 `es6` 语法。。。
 *
 * */
export function dateFormat (date, format) {
  let _format = format || 'yyyy-MM-dd';

  const d = date;
  const o = {
    'M+' : d.getMonth() + 1, // month
    'd+' : d.getDate(), // day
    'h+' : d.getHours(), // hour
    'm+' : d.getMinutes(), // minute
    's+' : d.getSeconds(), // second
    'q+' : Math.floor((d.getMonth() + 3) / 3), // quarter
    'S' : d.getMilliseconds() // millisecond
  };

  /**
   * `repeat` 方法返回一个新字符串，表示将原字符串重复 `n` 次。
   *
   * `RegExp` 是javascript中的一个内置对象。为正则表达式。
   * `RegExp.$1` 是 `RegExp` 的一个属性,指的是与正则表达式匹配的第一个 子匹配(以括号为标志)字符串
   * 以此类推，RegExp.$2，RegExp.$3，..RegExp.$99总共可以有99个匹配
   *
   * 例子：
   * var r= /^(\d{4})-(\d{1,2})-(\d{1,2})$/; //正则表达式 匹配出生日期(简单匹配)
   * r.exec('1985-10-15');
   * s1=RegExp.$1;
   * s2=RegExp.$2;
   * s3=RegExp.$3;
   * console.log(s1+" "+s2+" "+s3)//结果为1985 10 15
   *
   * `test()` 方法用于检测一个字符串是否匹配某个模式.
   * 语法：RegExpObject.test(string)
   *
   */

  /**
   * 使用正则匹配年份：
   *
   * 1、 /(y+)/.test(_format)
   * - 检测： `_format` 中最少有一个 `y` // 正则： `+` 表示最少要有一个； `*` 表示 `0-N` ge; `?` 表示 `0/1` 个
   *
   * 2、 (d.getFullYear() + '').substr(4 - RegExp.$1.length))
   * - 判断正则匹配的字符串长度，截取年份字符串，正则匹配长度为 `1~3`、`5~7` 匹配结果为 `1~3` 位的年份字符串， `4,8,...` 为整个年份字符串
   *
   * 3、 _format = _format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
   * - 替换所有 `y` 为上面匹配出的年份字符串的结果
   *
   */

  if (/(y+)/.test(_format)) {
    _format = _format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  for (const k in o) {
    if (o.hasOwnProperty(k) && new RegExp('(' + k + ')').test(_format)) {
      _format = _format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }

  return _format;
}

/**
 * imgTrustUrl(url)
 * 在 `node` 服务上使用，判断 `开发环境/测试环境` 补全 `Url`，在前面加入服务器 `Url`
 *
 * 后续研究下如何扩展 `Java` 配置
 *
 */
export function imgTrustUrl(url) {
  // if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  //   return IMAGE_HOST_TEST + url
  // } else if (process.env.NODE_ENV === 'production') {
  //   return IMAGE_HOST_PROD + url
  // } else {
  //   return url
  // }
  return url;
}

/**
 * isPromise (value)
 *
 * desc：判断是否是 `Promise` 类型
 *
 * 入参：Object
 *
 * 返回值：Boolean
 *
 */
export function isPromise(value) {
  if (value !== null && typeof value === 'object') {
    return value.promise && typeof value.promise.then === 'function'
  }
  return false;
}

/**
 * getCookie(name)
 *
 * desc：
 * 根据传入的名字，获取 `cookie` 中的值
 * 拼接后以数据的形式返回
 *
 * 入参：String
 *
 * 返回值：Array
 *
 */
export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

/**
 * 新旧page对象切换
 */
export function getNewPager(newPage, oldPage) {
  if (!newPage) {
    return oldPage;
  }
  return {
      pageId: newPage.pageId ? newPage.pageId : oldPage.pageId,
      recPerPage: newPage.recPerPage ? newPage.recPerPage : oldPage.recPerPage,
      total: newPage.total || newPage.total === 0 ? newPage.total : oldPage.total
    }
}

/**
 * 对象转换为url查询参数
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export function parseParam(params = {}) {
  params = _omitBy(params, _isNil);
  const esc = encodeURIComponent;
  return Object.keys(params)
      .map(k => `${esc(k)}=${esc(params[k])}`)
      .join('&');
}

/**
 * 清除数据里的空数据children
 * @param  {Array}  [node=[]] [description]
 * @return {[type]}           [description]
 */
export const clearData = (node = []) => {
  node.forEach((item) => {
    if (item.children && item.children.length > 0) {
      clearData(item.children);
    } else {
      delete item.children;
    }
  })
}

/**
 * 设置会话期间保存的数据
 * @param {[type]} name  [description]
 * @param {[type]} value [description]
 */

export const setSessionStorageItem = (key, value) => {
  if (window.sessionStorage) {
    window.sessionStorage.setItem(key, value);
  }
}

export const getSessionStorageItem = (key) => {
  if (window.sessionStorage) {
    const value = sessionStorage.getItem(key);
    return value === undefined || value === 'undefined' ? null : value;
  }
  return null;
}

export const removeSessionStorageItem = (key) => {
  if (window.sessionStorage) {
    sessionStorage.removeItem(key);
  }
}

export const setLocalStorageItem = (key, value) => {
  if (window.localStorage) {
    localStorage.setItem(key, value)
  }
}

export const getLocalStorageItem = (key) => {
  if (window.localStorage) {
    const value = window.localStorage.getItem(key);
    return value === undefined || value === 'undefined' ? null : value;
  }
  return null;
}

export const removeLocalStorageItem = (key) => {
  if (window.localStorage) {
    window.localStorage.removeItem(key);
  }
}

export const setCookieItem = (name, value) => {
    Cookies.set(name, value);
}

export const getCookieItem = (name) => {
    const value = Cookies.get(name);
    return value === undefined || value === 'undefined' ? null : value;
}

export const removeCookieItem = (name) => {
    Cookies.remove(name);
}

export const DataUtil = {
  eventMap: new Map(),

  setStore(store) {
    this.store = store;
  },
  /**
   * 根据项目id获取项目节点对象
   */
  getProjDataById(id) {
    if (!this.store) return null;
    const projTree = this.store.getState().getIn(['APP', 'projectTree']).data.projTree;
    let matchNode = null;
    const eachTree = (node) => {
      if (matchNode) return;
      for (let i = 0; i < node.length; i++) {
        const item = node[i]
        if (item.projid === id) {
          matchNode = item;
          break;
        }
        if (item.children && item.children.length > 0) {
          eachTree(item.children);
        }
      }
    }
    eachTree(projTree);
    return matchNode;
  }
}

/**
获取全局的ctx(目前是根据编译机器上的环境变量传入)
 **/
export const ctx = (() => {
  return __CONTEXT__ ? __CONTEXT__ : ''
})();

/*获取缓存在cookie的登录标记*/
export const getUserAuth = () => {
  return getCookieItem(USER_AUTH);
}

/*获取当前登录用户的信息*/
export const getCurrentUser = () => {
  const user = getLocalStorageItem(CURRENT_USER);
  if (user !== null) {
    return JSON.parse(user);
  }
  return DataUtil.store.getState().getIn(['APP', 'userInfo']);
}

/*获取用户公司*/
export const getUserOrgs = () => {
  const orgs = getLocalStorageItem(USER_ORGS);
  if (orgs !== null) {
    return JSON.parse(orgs);
  }
  return DataUtil.store.getState().getIn(['APP', 'userOrgs']);
}

function findMatchOrg(orgs, orgid) {
  let result = null;
  for (const org of orgs) {
    if (org.orgid === orgid) {
      result = org;
      break;
    }

    if (!_isEmpty(org.children)) {
      result = findMatchOrg(org.children, orgid);
      if (!_isEmpty(result)) {
        break;
      }
    }
  }
  return result;
}

/*获取当前选择的公司*/
export const getCurrentOrg = () => {
  const cacheOrg = getLocalStorageItem(CURRENT_ORG);
  if (cacheOrg !== null) {
    return JSON.parse(cacheOrg);
  }

  const userOrgs = getUserOrgs();
  if (_isEmpty(userOrgs)) {
    return null;
  }

  let currOrg = null;
  const preferenceStr = getCurrentUser().user.preference;
  if (!_isEmpty(preferenceStr)) {
    const pref = JSON.parse(preferenceStr);
    currOrg = findMatchOrg(userOrgs, pref.currOrg);
  }

  currOrg = _isEmpty(currOrg) ? userOrgs[0] : currOrg;
  setLocalStorageItem(CURRENT_ORG, JSON.stringify(currOrg));
  return currOrg;
}

function findMatchProject(projs, projid) {
  let result = null;
  if (_isEmpty(projid)) { //处理用户首次登陆会选中大项目的问题
    for (const proj of projs) {
      if (!_isEmpty(proj.children)) {
        result = findMatchProject(proj.children, projid);
      } else {
        result = proj;
        break;
      }
    }
  } else {
    for (const proj of projs) {
      if (proj.projid === projid) {
        result = proj;
        break;
      }
      if (!_isEmpty(proj.children)) {
        result = findMatchProject(proj.children, projid);
        if (!_isEmpty(result)) {
          break;
        }
      }
    }
  }
  return result;
}

/*获取当前选择的项目*/
export const getCurrentProject = () => {
  const cacheProj = getLocalStorageItem(CURRENT_PROJECT);
  if (cacheProj !== null) {
    return JSON.parse(cacheProj);
  }

  //GET FORM USER PREFERENCE
  let currProj = null;
  const preferenceStr = getCurrentUser().user.preference;
  const projs = DataUtil.store.getState().getIn(['APP', 'projectTree']).data;
  if (_isEmpty(projs)) {
    return null;
  }

  if (!_isEmpty(preferenceStr)) {
    const pref = JSON.parse(preferenceStr);
    currProj = findMatchProject(projs, pref.currProj);
  }

  currProj = _isEmpty(currProj) ? projs[0] : currProj;
  setLocalStorageItem(CURRENT_PROJECT, currProj);
  return currProj;
}

/*获取当前用户的菜单*/
export const getUserMenus = () => {
  const menus = getLocalStorageItem(USER_MENU);
  if (menus !== null) {
    return JSON.parse(menus);
  }
  return DataUtil.store.getState().getIn(['APP', 'mainMenus']);
}

/**/
export const getUserTokens = () => {
  const tokens = getLocalStorageItem(USER_TOKENS);
  if (tokens !== null) {
    return JSON.parse(tokens);
  }
  return DataUtil.store.getState().getIn(['APP', 'userTokens']);
}

/*获取慧正工作流地址*/
export const getHzHost = () => {
  const hzHost = getLocalStorageItem(HZ_HOST);
  if (hzHost !== null) {
    return hzHost
  }
  return DataUtil.store.getState().getIn(['APP', 'hzHost']);
}

/*获取BPM工作流地址*/
export const getBPMHost = () => {
  const bpmHost = getLocalStorageItem(BPM_HOST);
  if (bpmHost !== null) {
    return bpmHost
  }
  return DataUtil.store.getState().getIn(['APP', 'bpmHost']);
}

/*获取服务端地址*/
export const getServHost = () => {
  const host = getLocalStorageItem(SERV_HOST);
  if (host !== null) {
    return host
  }
  return DataUtil.store.getState().getIn(['APP', 'servHost']);
}

/*获取慧正工作流地址*/
export const getVkHost = () => {
  const vkHost = getLocalStorageItem(VK_HOST);
  if (vkHost !== null) {
    return vkHost
  }
  return DataUtil.store.getState().getIn(['APP', 'vkHost']);
}

/*缓存用户登录后的信息*/
export const cacheLoginInfo = (res) => {
  setCookieItem(USER_AUTH, true);
  setLocalStorageItem(CURRENT_USER, JSON.stringify(res.userInfo));
  setLocalStorageItem(USER_ORGS, JSON.stringify(res.userOrgs));
  setLocalStorageItem(USER_MENU, JSON.stringify(res.mainMenus));
  setLocalStorageItem(USER_TOKENS, JSON.stringify(res.userTokens));
  setLocalStorageItem(HZ_HOST, res.hzHost);
  setLocalStorageItem(BPM_HOST, res.bpmHost);
  setLocalStorageItem(SERV_HOST, res.servHost);
  setLocalStorageItem(VK_HOST, res.vkHost);
}

/*session过期或退出登录之后，清除用户登录信息*/
export const cleanLoginInfo = () => {
  Cookies.remove(USER_AUTH);
  removeLocalStorageItem(CURRENT_USER);
  removeLocalStorageItem(USER_ORGS);
  removeLocalStorageItem(CURRENT_PROJECT);
  removeLocalStorageItem(CURRENT_ORG);
  removeLocalStorageItem(USER_MENU);
  removeLocalStorageItem(USER_TOKENS);
  removeLocalStorageItem(HZ_HOST);
  removeLocalStorageItem(BPM_HOST);
  removeLocalStorageItem(SERV_HOST);
  removeLocalStorageItem(VK_HOST);
}

/*
*@param key - 受保护资源的唯一标识
*@param className - 返回类型，true：返回className；false: 返回boolean值
**/
export const hasPermission = (key, className = true) => {
  //本地代码
  //return  '';
  const userInfo = getCurrentUser();
  if (userInfo.user.isadmin === 1) {
    if (className) {
      return false;
    }
    return '';
  }
  const tokens = getUserTokens();
  const result = tokens.find(t => t === key);
  if (className) {
    return !result;
  }
  return !result ? 'hidden' : '';
}


/**
 * 判断是否快速重复的点击页面按钮
 * @param  {[type]}  key [description]
 * @return {Boolean}     [description]
 */
export const isRepeatClick = (key) => {
  let result = false;
  const eventMap = DataUtil.eventMap;

  key = key.split('\?')[0];
  const prvtime = eventMap.get(key);
  const currtime = _now();
  if (prvtime && currtime - prvtime < 1200) {
    result = true;
  }
  eventMap.set(key, currtime);
  //window.sessionStorage.setItem('EVENT_FILTER', JSON.stringfy(eventMap));
  return result;
}

//将毫秒数格式化
//date 如果不是number类型则直接显示，如果是number类型会按format来格式化，都必填
export const toLocaleStr = (date, format) => {
  if (!date) {
    return ''
  } else if (typeof date !== 'number') {
    return date
  } else {
    const dd = new Date(date);
    const o = {
      'M+': dd.getMonth() + 1, //月
      'D+': dd.getDate(), //日
      'H+': dd.getHours(), //时
      'm+': dd.getMinutes(), //分
      's+': dd.getSeconds(), //秒
      'q+': Math.floor((dd.getMonth() + 3) / 3), //季度
      'S+': dd.getMilliseconds() //毫秒
    };
    if (/(Y+)/.test(format)) {
      format = format.replace(RegExp.$1, ('' + dd.getFullYear()).substr(4 - RegExp.$1.length));
    }
    for (let i in o) {
      if (new RegExp(`(${i})`).test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[i]) : (('00' + o[i]).substr(('' + o[i]).length)))
    }
    return format;
  }
}

// 123==>123.00  价格的零点保存函数
export const IntegerToFloat = (date) => {
  if (date == null || date == 'NaN') {
    return '';
  }
  const arr = date.toString().split('.');
  if (arr.length === 1) {
    return `${date}.00`;
  } else if (arr.length === 2 && arr[1].length === 1) {
    return `${date}0`;
  } else if (arr.length === 2 && arr[1].length > 1) {
    return `${arr[0]}.${arr[1].substring(0, 2)}`;
  } else {
    return date;
  }
}

// 导入导出
export const generateExportURL = (url, params) => {
  //生成链接，uri，前面没有斜杠，也不要？号结尾，例如afterSale/loanServst.do
	//let prefix = getServHost();
  console.log('url, params', url, params);
  const host = getServHost();
  let URL = host+'/'+url + '?';
  // let URL = url + '?';
  if (params && params instanceof Object) {
    for (let key in params) {
      URL += key + '=' + (params[key] || '') + '&';
    }
  }
  URL = URL.substring(0, URL.length - 1);
  console.log('URL', URL);
  return URL;
}

//对象数组的去重，参数arr=[{...}, {...}];
export const getNoRepeatArr = (arr) => {
  //{name: 'a'}, {name: 'a'}由于内存地址不同，所以在Set数据中无法去重，
  //将其转换成json字符串即可，然后将Set数据转换为array，再转为对象数组
  const newSet = new Set(arr.map(item => JSON.stringify(item)));
  return Array.from(newSet).map(item => JSON.parse(item));
};

//金额格式化123456 => 123,456
export const formatMoney = (data) => {
  const arrData = data.split('.');
  let parseData = arrData[0];
  let result = '';
  while (parseData.length > 3) {
    result = `,${parseData.slice(-3)}${result}`;
    parseData = parseData.slice(0, parseData.length - 3);
  }
  if (parseData) result = parseData + result;
  if (arrData[1]) return `${result}.${arrData[1]}`;
  return result;
};
