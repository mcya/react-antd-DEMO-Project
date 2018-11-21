import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, IndexLink } from 'react-router';
import isEmpty from 'lodash/isEmpty';
import styles from './index.less'
import * as appAction from 'AppAction'

class LeftPanel extends React.Component {

  // static defaultProps = {
  //   data: []
  // }

  constructor() {
    super();
    this.options = [];
  }

  componentWillMount() {
    this.props.mainMenus.forEach((item) => {
      if (item.hidden) {
        return;
      }
      if (item.expand === false) {
        this.options.push({ key: item.authid, value: item.authname });
      } else if (!isEmpty(item.children)) {
        item.children.forEach((citem) => {
          this.options.push({ key: `${citem.menuurl}`, value: `${item.authname}-${citem.authname}` });
        })
      }
    });
  }

  getMenuClass(menuName) {
    switch (menuName) {
      case '我的工作台':
        return 'menu1';

      case '项目准备':
        return 'menu2';

      case '交易管理':
        return 'menu3';
      case '客户管理':
        return 'menu3';

      case '售后服务':
        return 'menu4';
      case '个人自助服务':
        return 'menu4';
      case '佣金管理':
        return 'menu4';
      case '时代+':
        return 'menu4';

      case '财务管理':
        return 'menu5';
      case '费控管理':
        return 'menu5';

      case '价格管理':
        return 'menu6';

      case '微信开盘':
        return 'menu13';

      case '套打设置':
        return 'menu7';

      case '系统设置':
        return 'menu8';

      case '我的工作':
        return 'menu9';

      case '微客管理':
        return 'menu10'

      case '集中开盘':
        return 'menu13'
      case '集中开盘(大开盘)':
        return 'menu13'

      case '报表管理':
        return 'menu14'

      case '发函管理':
        return 'menu15'

      default:
        return 'menu1'
    }
  }

  generateMenuHead(config) {
    if (isEmpty(config.children) || config.expand === false) {
      return (
        <div className="ItemHead acdU2" onClick={() => {
            // console.log('config', config);
            this.props.switchExpand('/');
            if (config.menuurl === '/veeker') {
              this.props.changeLocation('/veeker');
            } else if (config.menuurl === '/yjset') {
              this.props.changeLocation('/yjset');
            } else if (config.menuurl === '/letterMgr') {
              this.props.changeLocation('/letterMgr');
            } else if (config.menuurl === '/shidaijia') {
              this.props.changeLocation('/shidaijia');
            } else if (config.menuurl === '/custHelpService') {
              this.props.changeLocation('/custHelpService');
            } else {
              this.props.changeLocation('/');
            }
          }}
        >
          <span className={this.getMenuClass(config.authname)} />
          <p className="pickUp2">{config.authname}</p>
          <a className="onbg" />
        </div>
      )
    }
    return (
      <div className="ItemHead" onClick={() =>
          !this.props.collapsed && this.props.switchExpand(config.menuurl)
        }
      >
        <span className={this.getMenuClass(config.authname)} />
        <p className="pickUp2">{config.authname}</p>
        <a className="expand pickUp2" />
        <a className="onbg" />
      </div>
    )
  }

  generateMenuBody(config) {
    if (isEmpty(config.children) || config.expand === false) return '';
    const result = [];
    for (const bodyItem of config.children) {
      const isOn = this.props.currentPath === bodyItem.menuurl;
      result.push(
        <li key={bodyItem.menuurl} className={isOn ? 'select' : ''} >
          <Link to={bodyItem.menuurl}>{bodyItem.authname}</Link>
        </li>
      )
    }

    return (
      <div className="ItemBody">
        <ul className={this.props.collapsed ? 'acdUl acdUl1' : 'acdUl'}>
          {result}
        </ul>
      </div>
    );
  }
  generateMenuItem(config) {
    const pathArr = this.props.currentPath.split(/\//);
    let isOn = false;
    //如果第一次进入页面，并且路径匹配一级菜单
    if (this.props.currentExpanded === '/' && pathArr[1] === 'workBench' && config.menuurl === '/') {
      isOn = true;
    } else if (
      !isEmpty(config.children)
      && ((this.props.currentExpanded === '/' && `/${pathArr[1]}` === config.menuurl) || this.props.currentExpanded === config.menuurl)
    ) {
      //如果当前菜单有子菜单并且没有手动收缩，并且当前展开匹配url
      isOn = true
    }

    return (
      <div key={config.menuurl} className={isOn ? 'acdItem on' : 'acdItem'}>
        {this.generateMenuHead(config)}
        {this.generateMenuBody(config)}
      </div>
    )
  }
  generateMenuAll() {
    const result = [];
    const _this = this;
    if (this.props.mainMenus) {
      this.props.mainMenus.forEach((config) => {
        if (config.hidden !== true) {
          //console.log(config.authname, config.menuurl)
          result.push(_this.generateMenuItem(config));
        }
      });
    }
    return result;
  }

  render() {
    return (
      <div className={this.props.collapsed ? 'menuPanel out_1' : 'menuPanel'}>
        <div className={this.props.collapsed ? 'logoDiv' : 'logoDiv out_2'}>
          <span className="pickUp2" />
        </div>

        {/*<div className="userMenu1">

          <div className="htext pickUp2">
            <span className="hName"> 您好，{this.props.userInfo.user.username}</span>
            <div className="hPosition" onClick={::this.showOrgTree}>
              <span>{this.props.currentOrg.orgname}</span>
              <b />
            </div>
            <OrgTreeModal
              visible={this.state.visible}
              onOk={::this.handleOk}
              onCancel={::this.handleCancel}
              onSelect={::this.handleTreeSelect}
              userOrgs={this.props.userOrgs}
            />
          </div>
        </div>*/}

        <div className="acdBox">
          {/*<div
            className={this.props.currentPath === '/'
              && this.props.currentExpanded === '/' ? 'acdItem on' : 'acdItem'}
            onClick={() => {this.props.switchExpand('/'); this.props.changeLocation('/')}}
          >

            <div className="ItemHead acdU2">
              <IndexLink to="/">
              <span className="menu1" />
              <p className="pickUp2">
                我的工作台
              </p>
              </IndexLink>
              <a className="onbg" />
            </div>
          </div>*/}

          {::this.generateMenuAll()}

        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    userInfo: state.getIn(['APP', 'userInfo']),
    currentOrg: state.getIn(['APP', 'CurrentOrg']),
    userOrgs: state.getIn(['APP', 'userOrgs']),
    mainMenus: state.getIn(['APP', 'mainMenus'])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(appAction, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftPanel)
