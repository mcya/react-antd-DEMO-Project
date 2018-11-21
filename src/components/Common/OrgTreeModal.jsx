import React from 'react'
import MsgBox from 'MsgBox'
import { Tree } from 'antd'
//import { InitCOMTree } from '../../apps/system/org/api.js'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
//import * as action from '../../apps/system/org/action.js';
import * as AppAction from 'AppAction';

const TreeNode = Tree.TreeNode;

class OrgTreeModal extends React.Component {

  componentDidMount() {
    //  this.props.getUserOrgs();
  }

  componentWillReceiveProps(nextProps) {
    //if (this.props.userOrgs.length === 0 && nextProps.userOrgs.length > 0) {
      //this.props.getProjectTree({ orgid: nextProps.userOrgs[0].orgid });
    //}
  }

  onTreeSelect(selectedKeys, info) {
    if (this.props.onSelect) {
      let matchNode = null;
      const eachTree = (node) => {
        if (matchNode) return;
        for (let i = 0; i < node.length; i++) {
          const item = node[i]
          if (item.orgid === selectedKeys[0]) {
            matchNode = item;
            break;
          }
          if (item.children && item.children.length > 0) {
            eachTree(item.children);
          }
        }
      }
      eachTree(this.props.userOrgs);
      this.props.onSelect(selectedKeys, matchNode);
    }
  }

  //orgData = [];

  render() {
    const loop = (data = []) => (data.length === 0 ? null : data.map((item = {}) => {
      //console.log(item)
      if (item.children) {
        return (
          <TreeNode key={item.orgid} title={item.fullname} >
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.orgid} title={item.fullname} />;
    }));
    return (
      <MsgBox
        title="选择公司"
        style={{ top: 20 }}
        {...this.props}
      >
        <div style={{ height: document.body.clientHeight - 170, overflow: 'auto' }}>
          {
            this.props.userOrgs.length ?
            <Tree onSelect={::this.onTreeSelect} defaultExpandedKeys={[this.props.userOrgs[0].orgid]} >
              {loop(this.props.userOrgs)}
            </Tree> : null
          }
        </div>
      </MsgBox>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(AppAction, dispatch)
  }
}

function mapStateToProps(state, ownProps) {
  return {
    //orgTree: state.getIn(['system', 'org', 'orgTreeData']).data.orgTree
    //userOrgs: state.getIn(['APP', 'userOrgs'])
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrgTreeModal);
