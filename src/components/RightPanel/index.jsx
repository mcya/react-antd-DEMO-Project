import React, { PropTypes } from 'react';
import MianBao from 'MianBao'
import isEmpty from 'lodash/isEmpty'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AppAction from 'AppAction';
import headImg from '../../common/img/newHead.png';
import { getCurrentOrg, getHzHost } from 'util';
import OrgTreeModal from 'OrgTreeModal';
// import * as loginAction from '../../apps/login/action'
import ProCascader from 'ProCascader'
import ProTreSelect from 'ProTreSelect'
import { Icon, Tabs, Modal, message } from 'antd'
import MsgBox from 'MsgBox'
import styles from './index.less'
import AppDownload from './appDownload'

const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
const workBenchSons = {
  '/workBench': '我的工作台',
  '/workBench/searchResult': '搜索结果',
  '/workBench/searchResult/roomInfo': '房间信息',
  '/workBench/searchResult/roomInfo/orderInfo': '交易单信息',
  '/workBench/searchResult/orderInfo': '交易单信息',
  '/workBench/searchResult/orderInfo/roomInfo': '房间信息',
  '/workBench/searchResult/orderInfo/contractInfo': '合同信息',
  '/workBench/searchResult/orderInfo/contractInfo/roomInfo': '房间信息',
  '/workBench/searchResult/feeList': '供款列表',
  '/workBench/searchResult/bill': '首次收款',
  '/workBench/searchResult/contractInfo': '合同信息',
  '/workBench/bill': '首次收款'
}

class RightPanel extends React.Component {
  /*componentWillUpdate(nextProps, nextState) {
    if (!nextProps.loginSuccess) {
      this.props.changeLocation('/login');
    }
  }*/

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  static childContextTypes = {
    projid: PropTypes.string,
    userInfo: PropTypes.object
  }

  constructor() {
    super();
    this.state = {
      visible: false,
      proVisible: false,
      panes: [], //tab标签页
      activeKey: '', //当前激活的tab
      urlParams: [], //打开页面的url参数,
      appVisible: false,
      getAppCodeResultData: {success: false, data: null, message: null, code: 0},
      contentLoading: true
    }
  }

  getChildContext() {
    return {
      projid: this.props.ProTreSelected,
      userInfo: this.props.userInfo
    }
  }

  componentDidMount() {
    if (this.props.location && this.props.location.query.newWindow) {
      this.props.toggleLeftCollapsed();
    }
    if (this.props.userOrgs.length > 0) {
      const currentOrg = getCurrentOrg();
      if (currentOrg) {
        this.props.setCurrentOrgFromCache(currentOrg);
      } else {
        const org = this.props.userOrgs[0];
        this.props.changeCurrentOrg(org.orgid, org);
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.getAppCodeResult!==nextProps.getAppCodeResult && nextProps.getAppCodeResult.success) {
      this.setState({ getAppCodeResultData: nextProps.getAppCodeResult })
      this.setState({ appVisible: true });
    }
    if (this.props.userOrgs.length === 0 && nextProps.userOrgs.length > 0) {
      const currentOrg = getCurrentOrg();
      if (currentOrg) {
        this.props.setCurrentOrgFromCache(currentOrg);
      }
      const { panes } = this.state;
      const currentUrl = nextProps.location.pathname
      const leftMenu = nextProps.mainMenus;
      let currentTabName;
      const getTabName = (data) => {
        data.map(item => {
          if (item.children) {
            getTabName(item.children)
          }
          if (currentUrl === item.menuurl) {
            currentTabName = item.authname
          }
          return currentTabName;
        });
        return currentTabName;
      };
      if (currentUrl.match('/workBench')) { //我的工作台模块
        for (let i in workBenchSons) {
          if (i === currentUrl) {
            currentTabName = workBenchSons[i]
          }
        }
      } else if (currentUrl === '/userInfo') {
        currentTabName = '个人信息'
      } else if (currentUrl === '/saleMgr/orderInfo') {
        currentTabName = '交易单信息'
      } else if (currentUrl === '/batchOpen/confessDetail') {
        currentTabName = '认筹单信息'
      } else if (currentUrl === '/largeBatchOpen/confessDetail') {
        currentTabName = '筹单详情'
      } else if (currentUrl === '/finance/crmt/feeList') {
        currentTabName = '供款列表'
      } else if (currentUrl === '/finance/crmt/firstCollection') {
        currentTabName = '首次收款'
      } else if (currentUrl === '/saleMgr/roomInfo') {
        currentTabName = '房间信息'
      } else if (currentUrl === '/finance/interface/docRuleIn') {
        currentTabName = '凭证规则设置'
      } else {
        getTabName(leftMenu)
      }
      const activeKey = currentUrl;
      panes.push({ title: currentTabName, content: nextProps.children, key: activeKey });
      this.setState({ panes, activeKey });
    }
    //登录时打开我的工作台
    if (nextProps.location.pathname === this.props.location.pathname && nextProps.location.pathname === '/workBench') {
      const { panes } = this.state;
      const activeKey = '/workBench';
      if (nextProps.location.query.symbolRefresh) { //改变项目树时，仅保留我的工作台
        const workBenchPanes = [{ title: '我的工作台', content: nextProps.children, key: activeKey }];
        this.setState({ panes: workBenchPanes, activeKey })
      }
      if (!panes.find(item => item.key === activeKey)) {
        //console.log('登录的第一个tab：', activeKey)
        panes.push({ title: '我的工作台', content: nextProps.children, key: activeKey });
        this.setState({ panes, activeKey })
      }
    } else if (nextProps.location.pathname === '/workBench' && nextProps.location.query.symbolRefresh) {
      //改变项目树时，关闭所有标签页，跳转到我的工作台
      const workBenchPanes = [{ title: '我的工作台', content: nextProps.children, key: '/workBench' }];
      this.setState({ panes: workBenchPanes, activeKey: '/workBench' })
    } else if (nextProps.location.pathname !== this.props.location.pathname) { //url切换
      const currentUrl = nextProps.location.pathname;
      const { panes } = this.state;
      if (panes.find(item => (item.key === '/workBench/searchResult' && item.content !== '') || (item.key === '/saleMgr/houseQuery' && item.content !== '') || (item.key === '/projectPre/roomMgr' && item.content !== ''))) {
        panes.map((val, key) => {
          if (val.key === '/workBench/searchResult' || val.key === '/saleMgr/houseQuery' || val.key === '/projectPre/roomMgr') {
            panes[key].content = '';
          }
          return panes;
        });
      }
      let currentTabName;
      console.log('panes', panes, currentUrl);
      if (!panes.find(item => item.key === currentUrl)) { //打开新的tab
        const leftMenu = nextProps.mainMenus;
        console.log('当前tab的URL：:', currentUrl)
        const getTabName = (data) => { //获取当前url的名称
          data.map(item => {
            if (item.children) {
              getTabName(item.children)
            }
            if (item.menuurl === currentUrl) {
              currentTabName = item.authname
            }
            return currentTabName;
          })
          return currentTabName;
        };
        if (currentUrl.match('/workBench')) { //我的工作台模块
          for (let i in workBenchSons) {
            if (i === currentUrl) {
              currentTabName = workBenchSons[i]
            }
          }
        } else if (currentUrl === '/userInfo') {
          currentTabName = '个人信息'
        } else if (currentUrl === '/saleMgr/orderInfo') {
          currentTabName = '交易单信息'
        } else if (currentUrl === '/batchOpen/confessDetail') {
          currentTabName = '认筹单信息'
        } else if (currentUrl === '/largeBatchOpen/confessDetail') {
          currentTabName = '筹单详情'
        } else if (currentUrl === '/finance/crmt/feeList') {
          currentTabName = '供款列表'
        } else if (currentUrl === '/finance/crmt/firstCollection') {
          currentTabName = '首次收款'
        } else if (currentUrl === '/saleMgr/roomInfo') {
          currentTabName = '房间信息'
        } else if (currentUrl === '/finance/interface/docRuleIn') {
          currentTabName = '凭证规则设置'
        } else {
          getTabName(leftMenu);
        }
        console.log('当前tab的名字：', leftMenu, currentTabName)
        const activeKey = currentUrl;
        panes.push({ title: currentTabName, content: nextProps.children, key: activeKey });
        this.setState({ panes, activeKey })
      } else { //已存在tab页面相互切换
        panes.map((item, index) => {
          if (item.key === currentUrl) {
            panes[index].content = nextProps.children;
          } else if ((currentUrl === '/workBench/searchResult' || currentUrl === '/saleMgr/tradeList' || currentUrl === '/saleMgr/houseQuery') && item.key === '/saleMgr/orderInfo') {
            //如果打开的是搜索结果、交易单列表、房源查询，将交易单信息页面置空
            panes[index].content = ''
          } else if (currentUrl.match('/workBench') && item.key.match('/workBench')) {
            //如果打开的是我的工作台，将其子页面内容全部置空
            panes[index].content = ''
          } else if (item.key === '/saleMgr/houseQuery') { //置空房源查询页面
            panes[index].content = ''
          }
          return panes;
        });
        this.setState({ activeKey: currentUrl, panes })
      }
    }
    if (nextProps.isVeeker && nextProps.location.pathname === '/veeker') {
      this.remove('/veeker');
      // this.remove('/veeker/set');
      this.props.veekerClick(false);
    }
    if (nextProps.isyjsetClick && nextProps.location.pathname === '/yjset') {
      // this.remove('/veeker');
      this.remove('/yjset');
      this.props.yjsetClick(false);
    }
    // 更改在本地
    if (nextProps.iscustHelpService && nextProps.location.pathname === '/custHelpService') {
      // this.remove('/veeker');
      this.remove('/custHelpService');
      this.props.custHelpService(false);
    }
    if (nextProps.isshidaijiaClick && nextProps.location.pathname === '/shidaijia') {
      this.remove('/shidaijia');
      this.props.shidaijiaClick(false);
    }

    if (Object.keys(nextProps.location.query).length > 0) { //当打开的url带有参数，保存它
      //console.log('url参数是：', nextProps.location.query);
      const { urlParams } = this.state;
      const urlParam = {
        url: nextProps.location.pathname,
        param: nextProps.location.query
      };
      if (!urlParams.find(item => item.url === urlParam.url)) {
        urlParams.push(urlParam);
      } else {
        urlParams.map((item, index) => {
          if (item.url === urlParam.url) {
            urlParams[index].param = urlParam.param
          }
          return urlParams;
        });
      }
      this.setState({ urlParams });
    }
    if (this.props.ProTreSelected !== nextProps.ProTreSelected) {
      this.handleProCancel()
      if (this.props.ProTreSelected) { //该判断防止刷新当前页面跳转到我的工作台
        this.props.changeLocation('/workBench', { symbolRefresh: true })
      }
    }
    if (nextProps.ProTreSelected) { //projid请求完成之后再加载内容区域
      this.setState({ contentLoading: false })
    }
  }
  componentWillUpdate(prevProps, prevState) {
    if (prevState.panes.length < this.state.panes.length) {
      const { props, activeKey, urlParams } = prevState;
      let param = null;
      urlParams.map(item => {
        if (item.url === activeKey) {
          param = item.param;
        }
        return param;
      });
      this.props.changeLocation(activeKey, param);
    }
  }
  componentDidUpdate(prevProps, prevState) { //tab页切换时在此函数捕获离开的tab，调用remove()自动关闭
    // console.log('prevState--------------------',prevState);
    if (prevState.activeKey === '/finance/crmt/firstCollection') {
      this.remove('/finance/crmt/firstCollection');
      message.warning('首次收款 页面已被关闭！');
    } else if (prevState.activeKey === '/workBench/bill') {
      this.remove('/workBench/bill');
      message.warning('首次收款 页面已被关闭！');
    } else if (prevState.activeKey === '/finance/interface/docRuleIn') {
      this.remove('/finance/interface/docRuleIn');
      message.warning('凭证规则设置 页面已被关闭！');
    }
  }
  onSelect(url) {
    this.props.changeLocation(url);
  }

  handleOk() {
    if (this.orgId) {
      this.props.changeCurrentOrg(this.orgId, this.orgNodeData);
      // this.props.getBuildTree({ orgid: this.orgId })
      this.setState({
        visible: false
      });
    }
  }

  handleCancel() {
    this.setState({
      visible: false
    });
  }
  handleProCancel() {
    this.setState({
      proVisible: false
    });
  }

  handleTreeSelect(selectedKeys, record) {
    this.orgId = selectedKeys[0];
    this.orgNodeData = record;
  }

  showOrgTree() {
    this.setState({
      visible: true
    });
  }
  showProTree() {
    this.setState({
      proVisible: true
    });
  }

  doSetting() {
    MsgBox.show({
      title: '设置',
      content: ''
    });
  }

  doLogout() {
    var hostVal = getHzHost()
    MsgBox.confirm({
      content: '确认退出登录?',
      onOk: () => {
        this.props.doLogout(
          {
            cb: () => {
              // this.context.router.push('/login');
              // window.location.href = ''; //退出登录时重新刷新页面，用于清除reducer缓存

              window.location.href = this.props.getHostsResult.data[0] + "/logout.jsp?salePath="+this.props.getHostsResult.data[1]+"";

            }
          }
        );
        this.props.changeLocation('/login', {loginOut: "yes", hostVal: hostVal });
        //登出报表系统 -- 张磊磊
        document.getElementsByTagName('iframe')[0] ?
        document.getElementsByTagName('iframe')[0].src = 'http://10.1.160.105:8080/WebReport/ReportServer?op=fs_load&cmd=ssout' : null;


        // window.location.href = this.props.getHostsResult.data[0] + "/logout.jsp?salePath="+this.props.getHostsResult.data[1]+"";

        // window.open(this.props.getHostsResult.data[0] + "/logout.jsp?salePath="+this.props.getHostsResult.data[1]+"", "_self");
      }
    })
  }

  doHelpDoc() {
    window.open('/doc/index.html');
  }
  openUserCenter = () => {
    this.props.changeLocation('/userInfo')
  }
  tabChange = (activeKey) => { //tab切换，遍历urlParams，如果有对应的参数，在打开页面中带入参数
    const { urlParams } = this.state;
    //console.log('收集到的url参数：', urlParams)
    let param = null;
    urlParams.map((item, index) => {
      if (item.url === activeKey) {
        param = item.param;
      }
      return param;
    });
    if (param && activeKey !== '/workBench') { //切换到我的工作台，去掉symbolRefresh参数
      this.props.changeLocation(activeKey, param)
    } else {
      this.props.changeLocation(activeKey)
    }
  }
  tabEdit = (targetKey, action) => { //tab删除
    const { panes } = this.state;
    if (panes.length !== 1) {
      this[action](targetKey)
    }
  }
  closeAll = () => {
    const panes = this.state.panes;
    const firstPane = panes[0];
    const urlParams = this.state.urlParams.filter(param => param.url === firstPane.key);
    const activeKey = firstPane.key;
    this.setState({ panes: [firstPane], activeKey, urlParams });
  }
  //在antd源码中加入了onContextMenu事件，请勿更改antd版本或将新版也加入该事件，url：node_modules/antd/lib/tabs/index.js
  onContextMenu = () => {
    //console.log('你点击了右键');
    MsgBox.confirm({
      content: '确定关闭除第一个以外的所有标签页吗?',
      onOk: () => {
        this.closeAll();
      }
    })
  }
  remove = (targetKey) => {
    //console.log('要删除的tab是：', targetKey)
    let activeKey = this.state.activeKey;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        if (i > 0) {
          lastIndex = i - 1;
        } else {
          lastIndex = i;
        }
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    const urlParams = this.state.urlParams.filter(param => param.url !== targetKey);
    if (activeKey !== targetKey) {
      this.setState({ panes, activeKey, urlParams })
    } else {
      activeKey = panes[lastIndex].key;
      let param = null;
      urlParams.map((item, index) => {
        if (item.url === activeKey) {
          param = item.param;
        }
        return param;
      });
      this.setState({ panes, activeKey, urlParams })
    }
  }
  appDownload = () => {
    // if (this.props.getAppCodeResult.data && this.props.getAppCodeResult.data!==null) {
    //   this.setState({ getAppCodeResultData: this.props.getAppCodeResult })
    //   this.setState({ appVisible: true });
    //   return;
    // }
    this.props.getAppCode()
  }
  closeAppDownload = () => {
    this.setState({ appVisible: false })
  }
  avatarLoaded = () => {
    // console.log('avatar loaded!')
  }
  avatarError = () => {
    // console.log('avatar error')
    this.refs.avatarImg.src = headImg;
  }
  render() {
    const defaultSrc = this.props.servHost ? this.props.servHost + '/system/user/getHeadImg.do' : headImg;
    const realSrc = this.props.headImgUrl ? this.props.headImgUrl : defaultSrc;
    return (
      <div className={this.props.collapsed ? 'rightPanel rightPanel1' : 'rightPanel'} >
        <div className={this.props.collapsed ? 'headTool fullSize' : 'headTool'}>
          <span className="userBox">
            <div onClick={this.openUserCenter} style={{ display: 'inline-block', cursor: 'pointer' }}>
              <img src={ realSrc } className="headImg" ref='avatarImg' onLoad={this.avatarLoaded} onError={this.avatarError}/>
              <span className="usernames">{this.props.userInfo.user.username}</span>
            </div>
            <span className="orgnames" onClick={::this.showOrgTree}>
              {this.props.currentOrg.orgname ? this.props.currentOrg.orgname : '请选择公司'}
              <span className="projArrow">&nbsp;</span>
            </span>
            <span className="orgnames" onClick={::this.showProTree}>
              {this.props.ProTreeSelectEdName ? this.props.ProTreeSelectEdName : '请选择项目'}
              <span className="projArrow">&nbsp;</span>
            </span>
          </span>
          <OrgTreeModal
            visible={this.state.visible}
            onOk={::this.handleOk}
            onCancel={::this.handleCancel}
            onSelect={::this.handleTreeSelect}
            userOrgs={this.props.userOrgs}
          />
          <MsgBox
            title="选择项目"
            hideOkBtn
            visible={this.state.proVisible}
            onCancel={::this.handleProCancel}
          >
            <ProTreSelect location={this.props.location} />
          </MsgBox>

          <div style={{ display: 'none' }}>
            <ProTreSelect />
          </div>
          <a className="onOff" style={{ paddingRight: 14 }}>
            <span onClick={::this.doLogout} />
          </a>
          {/* <a className="settingTo">
            <span onClick={::this.doSetting} />
          </a> */}
          <a className="listTo" onClick={this.props.toggleLeftCollapsed}>
            <span className="btn11" />
          </a>
          {/* <a style={{ float: 'right', paddingTop: 0, paddingRight: 20 }}>
            <span onClick={this.openModify} style={{ width: '60px', lineHeight: '50px' }} >修改密码</span>
          </a> */}
          <a className="listTo" style={{ width: '55px', padding: '15px 7px 0 0' }} href="attach/ActiveX.rar">
            控件下载
          </a>
          {}
          {
            __WidthDoc__ ? (
            <a style={{ fontSize: 20, float: 'right', paddingTop: 10 }} onClick={::this.doHelpDoc}>
              <Icon type="question-circle-o" />
            </a>) : false
          }
          <div className={styles.iconBox} onClick={this.appDownload}>
            微客App下载
          </div>
          <AppDownload visible={this.state.appVisible} closeAppDownload={this.closeAppDownload} getAppCodeResult={this.state.getAppCodeResultData} />
        </div>
        <div className="contentPanel">
          {/*
            <MianBao />
            {this.props.children}
            */}
          <div className={styles.tabPaneBox}>
            {
              !this.state.contentLoading &&
                <Tabs
                  type="editable-card"
                  hideAdd
                  animated={false}
                  size="small"
                  activeKey={this.state.activeKey}
                  onChange={this.tabChange}
                  onEdit={this.tabEdit}
                  onContextMenu={this.onContextMenu}
                >
                  {this.state.panes.map(item => <TabPane tab={item.title} key={item.key} >{item.content}</TabPane>)}
                </Tabs>
            }
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    getHostsResult: state.getIn(['APP', 'getHostsResult']),
    userInfo: state.getIn(['APP', 'userInfo']),
    currentOrg: state.getIn(['APP', 'CurrentOrg']),
    userOrgs: state.getIn(['APP', 'userOrgs']),
    location: state.getIn(['APP', 'location']),
    mainMenus: state.getIn(['APP', 'mainMenus']),
    isVeeker: state.getIn(['APP', 'isVeeker']),
    isyjsetClick: state.getIn(['APP', 'isyjsetClick']),
    iscustHelpService: state.getIn(['APP', 'iscustHelpService']),
    isshidaijiaClick: state.getIn(['APP', 'isshidaijiaClick']),
    //changeTabs: state.getIn(['APP', 'changeTabs']),
    ProTreSelected: state.getIn(['APP', 'ProTreSelected']),
    ProTreeSelectEdName: state.getIn(['APP', 'ProTreeSelectEdName']),
    //loginSuccess: state.getIn(['login', 'loginSuccess'])
    servHost: state.getIn(['APP', 'servHost']),
    getAppCodeResult: state.getIn(['APP', 'getAppCodeResult']),
    headImgUrl: state.getIn(['userCenter', 'userInfo', 'headImgUrl'])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    //...bindActionCreators(loginAction, dispatch),
    ...bindActionCreators(AppAction, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RightPanel)
