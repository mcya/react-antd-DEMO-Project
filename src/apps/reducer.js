import { createReducer, cleanLoginInfo, setLocalStorageItem, removeLocalStorageItem, getCurrentProject } from 'util';
import { Map } from 'immutable';
import { message } from 'antd'
import MsgBox from 'MsgBox';
import { LOCATION_CHANGE } from 'react-router-redux-fixed';
import { CURRENT_ORG, CURRENT_PROJECT, USER_ORGS } from '../constants'
import _cloneDeep from 'lodash/cloneDeep';

const initialState = Map({
	loading: false,
  leftMenuCollapsed: false,
  currentExpanded: '/',
  location: {},
	rengoushuTableData: {
		success: true,
    data: {
			param: {},
			list: []
		},
    message: null,
    code: 0
	},
	rengoushuLoading: false,
  userInfo: {
    org: [],
    station: [],
    user: { username: '' }
  },
	vkUserInfo: {},
  projectTree: {
    success: true,
    data: [],
    message: null,
    code: 0
  },
	sendSimpleHZResult: {
    success: false,
    data: null,
    message: null,
    code: 0
  },
	getHostsResult: {
    success: false,
    data: null,
    message: null,
    code: 0
  },
	getAppCodeResult: {
    success: false,
    data: null,
    message: null,
    code: 0
  },
	projectTreeToVxKp: {
		success: true,
    data: [],
    message: null,
    code: 0
	},
	buildTree: {
    success: true,
    data: {
      buildingTree: []
    },
    message: null,
    code: 0
  },
	ProTreSelected: null,
	vxkpProjid: null, //微信开盘projid
	ProTreeSelectedOrgId: null, //projectTree中选泽的项目所属的OrgId，与下面的orgIdSelected不是同一个
	ProTreeSelectEdName: null,
	ProTreeSelectNameName: '',
	ProTreeSelectName: [],
	ProTreeData: {},
	orgIdSelected: null,
	CurrentOrg: { orgname: '请选择公司' },
  BldTreSelected: null,
  CurrentOrgId: null,
  commonParamList: {
    success: true,
    data: [],
    message: null,
    code: 0
  },
	addTabPanes: [],
	dictList: {
		success: true,
		data: [],
		message: null,
		code: 0
	},
	treeLoading: true,
	applyObj: {},
	login: {
		isLogging: false,
		message: null,
		loginSuccess: false,
		jsessionid: [],
		fr_host: '',
		fr_jsessionid: '',
		fr_username: '',
		host: []
	},
	hzHost: null, //慧正工作流地址
	servHost: null, //服务器后台地址
	vkHost: null, // 微客服务器地址
  userOrgs: [], // 登录用户的组织
  mainMenus: [], // 登录用户主菜单
	userTokens: [], // 登录用户功能权限
	projectUsers: {//项目用户
		projid: null,
		loading: false,
		data: []
	},
	isVeeker: false, //tab是否为veeker
	isyjsetClick: false,
	iscustHelpService: false,
	isshidaijiaClick: false,
	saveSateBldDataVal: [],
	bigProjChangeProjidValue: null, //大项目改变de projid
	bigProjChangeProjidName: null, //大项目改变de projid name
	// changeTabs: { //tabs数据
	// 	change: false,
	// 	panes: null,
	// 	activeKey: null,
	// 	urlParams: null
	// },
	ProjBldLoading: false,
	bigProjLoading: false,
	bigprojData: [],
	bigprojToTreeData: [], //构造大项目 树形 组件数据
  ProjBldResult: {
    success: false,
    data: {},
    message: '',
    code: 0
  },
	unionPayReconciliationLoading: false,
	unionPayReconciliationVisible: {
    success: false,
    data: [],
    message: '',
    code: 0
  },
	orgTree: {},

	//全局组件
	buildDataLoading: false, // 楼栋数据
	buildDataRes: {
		success: false,
		data: {
			projBldTree: []
		},
		message: null,
		code: 0
	},
	allManSalePromiseCustmerLoading: false,
	allManSalePromiseCustmerData: {
		success: false,
		data: [],
		message: null,
		code: 0
	},
	buildDetailDataLoading: false, // 楼栋详情数据
	buildDetailDataRes: {
		success: false,
		data: [],
		message: null,
		code: 0
	},
});

export default createReducer(initialState, {

  /**
   * 控制左侧菜单的显示隐藏
   */
  TOGGLE_LEFT_COLLAPSED: (state, data) => {
    return state.update('leftMenuCollapsed', v => !v);
  },
  SWITCH_LEFT_EXPAND: (state, data, params) => {
		// console.log('左侧侧边栏，点击的是头部');
		// console.log('左侧--state, data, params', state, data, params);
    return state.update('currentExpanded', v => (v == params.url && v !='/' ? `-${v}` : params.url));
  },
  [LOCATION_CHANGE]: (state, location) => {
		// console.log('------------location, ', location, state)
    return state.set('location', location);
  },
  GET_PROJECT_PENDING: (state, data) => {//获取项目树
		//console.log("项目树运行中");
    return state;
  },
  GET_PROJECT_ERROR: (state, data) => {
		//console.log("项目树报错");
    return state;
  },
  GET_PROJECT_SUCCESS: (state, data, params) => {
		//console.log("项目树有输出", data.jsonResult);
    return state.set('projectTree', data.jsonResult).set('projectTreeToVxKp', data.jsonResult);
  },

	changeOrgToGetProjTree_PENDING: (state, data) => {//微信开盘-项目树
		//console.log("项目树运行中");
    return state;
  },
  changeOrgToGetProjTree_ERROR: (state, data) => {
		//console.log("项目树报错");
    return state;
  },
  changeOrgToGetProjTree_SUCCESS: (state, data, params) => {
		//console.log("项目树有输出", data.jsonResult);
    return state.set('projectTreeToVxKp', data.jsonResult);
  },

	changeVxkpProjid: (state, data, params) => { //微信开盘 - projid
		console.log('changeVxkpProjid', data, params);
		return state.set('vxkpProjid', data)
	},


	GET_BULDTREE_PENDING: (state, data) => {//获取项目树
		//console.log("楼栋树运行中");
    return state.set('treeLoading', true);
  },
  GET_BULDTREE_ERROR: (state, data) => {
		//console.log("楼栋树报错");
    return state.set('treeLoading', false);
  },
  GET_BULDTREE_SUCCESS: (state, data, params) => {
		//console.log("楼栋树有输出");
    return state.set('buildTree', data.jsonResult).set('treeLoading', false);
  },
	getCurrUserInfo_PENDING: (state, data) => {//获取项目树
    return state.set();
  },
  getCurrUserInfo_ERROR: (state, data) => {
    return state.set();
  },
  getCurrUserInfo_SUCCESS: (state, data, params) => {
		// console.log('获取到的 vkUserInfo', data.jsonResult, data.jsonResult.data)
    return state.set('vkUserInfo', data.jsonResult.data);
  },
	CHANGE_PROJECT_SELECTED: (state, data, params) => {//项目树选择
		setLocalStorageItem(CURRENT_PROJECT, JSON.stringify(params));
		console.log('项目树选择的参数state, data, params', state, data, params);
		const projname = params.projname;
		return state.set('ProTreSelected', params.projid)
								.set('bigProjChangeProjidValue', params.projid)
								.set('vxkpProjid', params.projid)
								.set('bigProjChangeProjidName', (projname instanceof Array) ? projname[0] : projname)
								.set('ProTreeSelectEdName', (projname instanceof Array) ? projname[0] : projname)
								.set('ProTreeSelectNameName', projname)
								.set('ProTreeSelectedOrgId', params.ProTreeSelectedOrgId)
								.set('ProTreeSelectName', projname)
								.set('ProTreeData', params.projData);
	},
	CHANGE_BULD_SELECTED: (state, data, params) => {//楼栋树选择
		// console.log('选择楼栋的时候触发以下三个');
		// console.log(state);
		// console.log(data);
		// console.log(params);
		return state.set('orgIdSelected', params.selectedOrgId);
	},
	CHANGE_CURRENT_ORG_PENDING: (state) => {
		removeLocalStorageItem(CURRENT_PROJECT);
		return state.set('ProTreSelected', null)
								.set('bigProjChangeProjidValue', null)
								.set('vxkpProjid', null)
								.set('ProTreeSelectEdName', null)
								.set('bigProjChangeProjidName', null)
								.set('ProTreeSelectedOrgId', null)
								.set('ProTreeSelectName', null);
	},
	CHANGE_CURRENT_ORG_SUCCESS: (state, data, params) => {
    const projTreeData = data[1].jsonResult;
		//console.log('----------CHANGE_CURRENT_ORG_SUCCESS', data);
    setLocalStorageItem(CURRENT_ORG, JSON.stringify(params));
    return state.set('CurrentOrg', params)
			.set('projectTree', projTreeData)
			.set('projectTreeToVxKp', projTreeData );
  },
	GET_RPOJECT_TREE_SUCCESS: (state, data, params) => {
		return state.set('projectTree', data.jsonResult).set('projectTreeToVxKp', data.jsonResult);
	},
	SET_CURRENT_ORG_FORM_CACHE_PENDING: (state) => {
		return state.set('ProTreSelected', null)
								.set('bigProjChangeProjidValue', null)
								.set('vxkpProjid', null)
								.set('ProTreeSelectEdName', null)
								.set('bigProjChangeProjidName', null)
								.set('ProTreeSelectedOrgId', null)
								.set('ProTreeSelectName', null);
	},
	SET_CURRENT_ORG_FORM_CACHE_SUCCESS: (state, data, params) => {
    const projTreeData = data[1].jsonResult;
    return state.set('CurrentOrg', params)
			.set('projectTreeToVxKp', data.jsonResult)
			.set('projectTree', projTreeData);
  },
  SET_CURRENT_ORG: (state, data) => {
    return state.set('CurrentOrg', data);
  },
	INIT_TABPANES: (state, data) => {
		return state.set('addTabPanes', []);
	},
	EDIT_TABPANES: (state, data, params) => {
		// console.log('addTabPanes', params.filter(x => x));
		return state.set('addTabPanes', params.filter(x => x));
	},

	GET_CAUSE_TYPE_PENDING: (state, data, params) => { //获取申请类型--原因类型
		return state;
	},
	GET_CAUSE_TYPE_ERROR: (state, data, params) => {
    return state;
  },
  GET_CAUSE_TYPE_SUCCESS: (state, data, params) => {
		// console.log('data.jsonResult', data.jsonResult)
    return state.set('dictList', data.jsonResult);
  },


	querySubScription_PENDING: (state, data, params) => { //获取申请类型--原因类型
		return state.set('rengoushuLoading', true);
	},
	querySubScription_ERROR: (state, data, params) => {
    return state.set('rengoushuLoading', false);
  },
  querySubScription_SUCCESS: (state, data, params) => {
		console.log('认购书数据', data.jsonResult);
    return state.set('rengoushuLoading', false).set('rengoushuTableData', data.jsonResult);
  },

	BatchExport_PENDING: (state, data, params) => { //获取申请类型--原因类型
		return state.set('rengoushuLoading', true);
	},
	BatchExport_ERROR: (state, data, params) => {
		MsgBox.error({ content: data });
    return state.set('rengoushuLoading', false);
  },
  BatchExport_SUCCESS: (state, data, params) => {
		console.log('批量导出', data.jsonResult);
		MsgBox.info({ content: data.jsonResult.message })
    return state.set('rengoushuLoading', false);
  },

	unionPayReconciliation_PENDING: (state, data, params) => { //获取申请类型--原因类型
		return state.set('unionPayReconciliationLoading', true);
	},
	unionPayReconciliation_ERROR: (state, data, params) => {
		MsgBox.error({ content: data });
    return state.set('unionPayReconciliationLoading', false);
  },
  unionPayReconciliation_SUCCESS: (state, data, params) => {
		console.log('App对账', data.jsonResult);
    return state.set('unionPayReconciliationLoading', false).set("unionPayReconciliationVisible", data.jsonResult);
  },

	SAVE_CAUSE: (state, data, params) => { //保存申请类型--原因类型的值和文本值
    return state.set('applyObj', params);
  },

	GET_USER_ORGS_PENDING: (state, data, params) => {
		return state;
	},
	GET_USER_ORGS_ERROR: (state, data, params) => {
		return state;
	},
	GET_USER_ORGS_SUCCESS: (state, data, params) => {
		const orgs = data.jsonResult;
		//console.log(orgs)
		state.set('userOrgs', orgs);
		if (orgs.length > 0) {
			state.set('CurrentOrg', orgs[0]);
		}
		return state;
	},

	USER_LOGIN_PENDING: (state, data, params) => {
    //return state.set('login.isLogging', true);
    return state.set('login', { isLogging: true, loginSuccess: false });
  },
  USER_LOGIN_ERROR: (state, data, params) => {
    message.error(`登录出错,${data}`);
		return state.set('login', { isLogging: false, loginSuccess: false });
    //return state.set('login.isLogging', false);
  },
  USER_LOGIN_SUCCESS: (state, res, params) => { //登录加载
		console.log('---------------USER_LOGIN_SUCCESS: ', res)
		//改变路径
		for (var i = 0; i < res.mainMenus.length; i++) {
			if (res.mainMenus[i].menuurl=="/btSystem") {
				for (var k = 0; k < res.mainMenus[i].children.length; k++) {
					if (res.mainMenus[i].children[k].menuurl=="/btSystem/btXk") {
						res.mainMenus[i].children[k].menuurl = "/saleMgr/btXk"
					}
				}
			}
		}
		console.log("res.mainMenus", res.mainMenus);
		const loginResult = Object.assign({ isLogging: false }, res.loginResult);
		message.success(loginResult.message);
		return state.set('login', loginResult).set('userOrgs', res.userOrgs)
      .set('mainMenus', res.mainMenus)
			.set('userInfo', res.userInfo)
			.set('currentExpanded', '/')
			.set('userTokens', res.userTokens)
			.set('hzHost', res.hzHost)
			.set('servHost',res.servHost)
	},
  USER_LOGOUT_ERROR: (state) => {
    //message.error('注销出错，请重试!');
    cleanLoginInfo();
    return state;
  },
  USER_LOGOUT_SUCCESS: (state, data, params) => {
    if (params.cb) {
      params.cb();
    }
    cleanLoginInfo();
		return state.set('login', { isLogging: false, loginSuccess: false });
    //return state.set('isLogging', false).set('loginSuccess', false);
  },
  RESET_LOGIN: (state) => {
		cleanLoginInfo();
		return state.set('login', { isLogging: false, loginSuccess: false });
    //return state.set('isLogging', false).set('loginSuccess', false);
  },
	GET_SYSTEM_INIT_INFO_SUCCESS: (state, res) => { //刷新加载
		console.log('-----GET_SYSTEM_INIT_INFO_SUCCESS', res);
		for (var i = 0; i < res.mainMenus.length; i++) {
			if (res.mainMenus[i].menuurl=="/btSystem") {
				for (var k = 0; k < res.mainMenus[i].children.length; k++) {
					if (res.mainMenus[i].children[k].menuurl=="/btSystem/btXk") {
						res.mainMenus[i].children[k].menuurl = "/saleMgr/btXk"
					}
				}
			}
		}
		if (res.userInfo.user && !res.userInfo.user.userid) {//userid为空时重新登录
			cleanLoginInfo();
			window.location.reload();
			return state.set('login', { isLogging: false, loginSuccess: false });
		}
		return state.set('userOrgs', res.userOrgs)
      .set('mainMenus', res.mainMenus)
			.set('userInfo', res.userInfo)
			.set('userTokens', res.userTokens)
			.set('hzHost', res.hzHost)
			.set('servHost', res.servHost)
	},

	GET_PROJECT_USERS_SUCCESS: (state, data, params) => {
		return state.set('projectUsers', {
			projid: params.queryCondition.projid,
			data: data.jsonResult.data
		});
	},
	GET_PROJECT_USERS_ERROR: (state, data, params) => {
		message.error('查询项目用户失败！');
		return state.set('projectUsers', {
			data: []
		});
	},

	GET_ISVEEKER: (state, data, params) => { //tab是否是veeker
		return state.set('isVeeker', params)
	},
	yjsetClick: (state, data, params) => { //tab是否是veeker
		return state.set('isyjsetClick', params)
	},
	custHelpService: (state, data, params) => { //tab是否是veeker
		return state.set('iscustHelpService', params)
	},
	shidaijiaClick: (state, data, params) => { //tab是否是veeker
		return state.set('isshidaijiaClick', params)
	},
	bigProjChangeProjid: (state, data, params) => {
		console.log('bigProjChangeProjid', data, params);
		return state.set('bigProjChangeProjidValue', data.value).set('bigProjChangeProjidName', data.projName)
	},
	saveSateBldData: (state, data, params) => {
		console.log('BigProjToRaioSelect Datas', data, params);
		return state.set('saveSateBldDataVal', data);
	},
	// CHANGETABS_BYDEL: (state, data, params) => {
	// 	return state.set('changeTabs', params)
	// },
	//通过项目id查询楼栋
  getBuildingsByProj_PENDING: (state, data) => {
   return state.set('ProjBldLoading', true);
  },
  getBuildingsByProj_ERROR: (state, data) => {
    return state.set('ProjBldLoading', false).set('ProjBldResult', { success: false, message: data, data: {} });
  },
  getBuildingsByProj_SUCCESS: (state, data) => {
    return state.set('ProjBldLoading', false).set('ProjBldResult', data.jsonResult);
  },

	// 大项目
	getProjAuthDataByUserAndProjid_PENDING: (state, data) => {
   return state.set('bigProjLoading', true);
  },
  getProjAuthDataByUserAndProjid_ERROR: (state, data) => {
    return state.set('bigProjLoading', false).set('bigprojData', []);
  },
  getProjAuthDataByUserAndProjid_SUCCESS: (state, data) => {
		var bigprojToTreeDataChild = [], bigprojToTreeDataFather = {}, array=_cloneDeep(data.jsonResult.data); //构造树形大项目组件数据
		if (data.jsonResult && data.jsonResult.data && array.length>0) {
			for (var i = 0; i < array.length; i++) {
				if (array[i].bigProj) {
					bigprojToTreeDataFather = array[i];
				} else {
					bigprojToTreeDataChild.push(array[i]);
				}
			}
		}
		bigprojToTreeDataFather.children = bigprojToTreeDataChild;
		bigprojToTreeDataFather = [bigprojToTreeDataFather]; // 转数组循环
    return state.set('bigProjLoading', false).set('bigprojData', data.jsonResult.data).set('bigprojToTreeData', bigprojToTreeDataFather);
  },
	clear_UserTokens: (state, data) => { //清空userTokens
		return state.set('userTokens', [])
								.set('CurrentOrg', {})
								.set('projectTree', { success: true, data: [], message: null, code: 0 })
								.set('ProTreeSelectEdName', null)
								.set('ProTreSelected', null)
								.set('vxkpProjid', null)
								.set('bigProjChangeProjidValue', null)
								.set('bigProjChangeProjidName', null)
	},
	orgTree_change: (state, data, params) => {
		return state.set('orgTree', params) //公司组织树的值
	},
	//全局组件
	acGetBuildData_PENDING: (state, data) => {
		return state.set('buildDataLoading', true);
	},
	acGetBuildData_ERROR: (state, data) => {
		message.error(data);
		return state.set('buildDataLoading', false);
	},
	acGetBuildData_SUCCESS: (state, data) => {
		return state.set('buildDataLoading', false)
								.set('buildDataRes', data.jsonResult);
	},

	getBuildDetailByBldId_PENDING: (state, data) => {
		return state.set('buildDetailDataLoading', true);
	},
	getBuildDetailByBldId_ERROR: (state, data) => {
		message.error(data);
		return state.set('buildDetailDataLoading', false);
	},
	getBuildDetailByBldId_SUCCESS: (state, data) => {
		return state.set('buildDetailDataLoading', false)
								.set('buildDetailDataRes', data.jsonResult);
	},

	searchProof_PENDING: (state, data) => {
		return state.set('allManSalePromiseCustmerLoading', true);
	},
	searchProof_ERROR: (state, data) => {
		message.error(data);
		return state.set('allManSalePromiseCustmerLoading', false);
	},
	searchProof_SUCCESS: (state, data) => {
		return state.set('allManSalePromiseCustmerLoading', false)
								.set('allManSalePromiseCustmerData', data.jsonResult);
	},

	sendSimpleHZ_PENDING: (state, data) => {
		return state.set('loading', true);
	},
	sendSimpleHZ_ERROR: (state, data) => {
		// message.error(data);
		MsgBox.error({ content: data })
		return state.set('loading', false).set("sendSimpleHZResult", {success: false, data: null, message: null, code: 0} );
	},
	sendSimpleHZ_SUCCESS: (state, data) => {
		message.success(data.jsonResult.message);
		return state.set('loading', false).set("sendSimpleHZResult", data.jsonResult)
	},

	getAppCode_PENDING: (state, data) => {
		return state.set('loading', true);
	},
	getAppCode_ERROR: (state, data) => {
		// message.error(data);
		MsgBox.error({ content: data })
		return state.set('loading', false).set("getAppCodeResult", {success: false, data: null, message: null, code: 0} );
	},
	getAppCode_SUCCESS: (state, data) => {
		message.success(data.jsonResult.message);
		return state.set('loading', false).set("getAppCodeResult", data.jsonResult)
	},

	getHosts_PENDING: (state, data) => {
		return state.set('loading', true);
	},
	getHosts_ERROR: (state, data) => {
		// message.error(data);
		MsgBox.error({ content: data })
		return state.set('loading', false).set("getHostsResult", {success: false, data: null, message: null, code: 0} );
	},
	getHosts_SUCCESS: (state, data) => {
		// message.success(data.jsonResult.message);
		return state.set('loading', false).set("getHostsResult", data.jsonResult)
	},

});
