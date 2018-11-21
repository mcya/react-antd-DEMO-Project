import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Breadcrumb, Icon } from 'antd';
import * as action from './action'
import isEmpty from 'lodash/isEmpty';
import leftMenuData from '../../constants/leftMenu'

const Item = Breadcrumb.Item;
// const leftMenuMap = Immutable.fromJS(leftMenuData);

class MianBao extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.location.pathname !== nextProps.location.pathname;
  }

  render() {
    const { pathname } = this.props.location;
    const pathArr = pathname.split(/\//).slice(1);
    if (pathArr[0] === 'workBench' ? pathArr.length > 1 : pathArr.length > 2) {
      const BItems = [];
      let currentParts = leftMenuData;
      pathArr.forEach((part, index) => {
        const cpo = currentParts.find((item) => item.key === part);
        if (!cpo) {
          return false;
        }
        BItems.push(
          <Item key={cpo.url}>
            { index === 0 ? <Icon type="home" /> : ''}
            <Link to={cpo.url}>{cpo.name}</Link>
          </Item>
        )
        currentParts = cpo.children || [];
        return true;
      })
      return (
        <div style={{ margin: '10px 0' }}>
          <Breadcrumb>
            {BItems}
          </Breadcrumb>
        </div>
      )
    }
      return <div style={{ minHeight: '20px' }}></div>
  }
}

function mapStateToProps(state, ownProps) {
  return {
    location: state.getIn(['APP', 'location'])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(action, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MianBao)
