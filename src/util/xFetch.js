// import React from 'React'
import 'isomorphic-fetch'
import 'fetch-detector';
import 'fetch-ie8';
import { parseParam, cleanLoginInfo } from './index'
import MsgBox from 'MsgBox'
import { isRepeatClick } from 'util'

const fetch = window.fetch;
const errorMessages = (res) => `${res.status} ${res.statusText}`;

function handleHttpError(res) {
// console.log('----------handleHttpError:', res);
  if (res.status === 401) {
    cleanLoginInfo();
    location.reload(false);
  } else if (res.status === 404) {
      return Promise.reject(errorMessages(res));
  }

  return res;
}

function handle401(res) {
  if (res.jsonResult.code === -1) {
    cleanLoginInfo();
    location.reload(false);
  }

  return res;
}

function jsonParse(res) {
  return res.json().then(jsonResult => ({ ...res, jsonResult }));
}

function errorMessageParse(res) {
  const { success, message } = res.jsonResult;
  if (!success) {
    return Promise.reject(message);
  }
  return res;
}

/*function checkNoLogin(res) {
  const { success, message, code } = res.jsonResult;
  if (!success && message.indexOf('未登录')) {
    MsgBox.warning({
      title: '快速登录',
      content: (
        <div>
          <span>用户未登录或登录超时</span>
        </div>
      )
    })
  }
  return res;
}*/

function xFetch(url, options) {
  // if (isRepeatClick(url)) return;
  const opts = { ...options, credentials: 'include' };
  opts.headers = {
    ...opts.headers
  };

  if(__CONTEXT__){
    url = __CONTEXT__ + url;
  }

  return fetch(url, opts)
    .then(jsonParse)
    .then(handleHttpError)
    .then(handle401)
    // .then(checkNoLogin)
    .then(errorMessageParse);
}

export function Post(url, params = {}) {
  params._ = new Date().getTime();//add cache
  const query = parseParam(params);
  return xFetch(url, {
    method: 'POST',
    headers: {
      Accept: 'text/javascript, text/html, application/xml, text/xml, */*',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: query
   });
}

export function Get(url, params = {}) {
  params._ = new Date().getTime();//add cache
  const query = parseParam(params);
  return xFetch(`${url}?${query}`, { method: 'GET' });
}

export function PostJsonBody(url, params = '') {
  //const query = parseParam(params);
  return xFetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: params
   });
}

export default xFetch;
