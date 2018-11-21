import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LeftPanel from '../components/LeftPanel'
import RightPanel from '../components/RightPanel'
import * as action from './action'
import leftMenuData from '../constants/leftMenu'
import { cleanLoginInfo } from 'util'

class App extends React.Component {

  componentWillMount() {
    this.props.getCurrUserInfo()
    if (this.props.location.query.adlogin === 1
      || !this.props.loginInfo.loginSuccess) {
        cleanLoginInfo();
        this.props.getSystemInitInfo();
    }
  }
  componentWillUnmount() {
    this.props.clearUserTokens(); //清空reducer的userTokens
  }

  render() {
    return (
      <div>
        <LeftPanel
          data={leftMenuData}
          collapsed={this.props.collapsed}
          currentExpanded={this.props.currentExpanded}
          currentPath={this.props.location.pathname}
          switchExpand={this.props.switchLeftExpand}
        />
        <RightPanel
          toggleLeftCollapsed={this.props.toggleLeftCollapsed}
          collapsed={this.props.collapsed}
        >
          {this.props.children}
        </RightPanel>
      </div>
    );
  }
}

/**
 * APP级别的全局状态映射到APP组件的属性上，供控制全局的展现
 * eg. 左侧菜单的状态(放大缩小，当前路径高亮展开子菜单，右侧的统一面包屑路径，登录用户状态信息等等等)
 * @param  {[type]} state    [description]
 * @param  {[type]} ownProps [description]
 * @return {[type]}          [description]
 */
function mapStateToProps(state, ownProps) {
  return {
    collapsed: state.getIn(['APP', 'leftMenuCollapsed']),
    currentExpanded: state.getIn(['APP', 'currentExpanded']),
    loginInfo: state.getIn(['APP', 'login']),
    userOrgs: state.getIn(['APP', 'userOrgs'])
  };
}

/**
 * APP级别的全局状态触发事件绑定，由./reducer里的函数负责触发状态修改，分离view和controller
 * @param  {[type]} dispatch [description]
 * @return {[type]}          [description]
 */
function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(action, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
