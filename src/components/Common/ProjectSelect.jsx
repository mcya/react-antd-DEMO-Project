/*
@auther 张磊磊
组件说明
！！！！！组件应专注于提供数据展示和通过API返回数据，而不是提供功能实现。
之前的项目树组件（ProjectTree.jsx和ProjectTreeSelect.jsx）已经被写成特定的功能实现，
不能复用，失去了组件的价值。
本组件专注于提供 项目树（小项目）的 Select化
 */
// API说明：
// getSelectData(): 本组件通过getSelectData方法将选中的节点数据传给父组件
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as action from 'AppAction';
import { TreeSelect } from 'antd';

const TreeNode = TreeSelect.TreeNode;

class ProjSelect extends Component {
  constructor() {
    super();
    this.state = {
      treeValue: null
    }
  }
  doSelect(value, node) {
    if (!node.props.isProj) {
      return;
    }
    this.setState({ treeValue: value });
    this.props.getSelectData(node.props.itemNode);
  }
  render() {
    const loop = (data = []) => data.map(item => {
      if (item.children && item.children.length) {
        return (
          <TreeNode itemNode={item} key={item.projid} value={item.projid} title={item.projshortname ? item.projshortname : item.projname}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      //isProj标识表示小项目节点
      return <TreeNode itemNode={item} key={item.projid} isProj value={item.projid} title={item.projshortname ? item.projshortname : item.projname} />
    });
    return (
      <TreeSelect
        showSearch
        placeholder="--请选择项目--"
        notFoundContent="未找到"
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        allowClear
        treeDefaultExpandAll
        treeNodeFilterProp="title"
        defaultValue={this.props.selectedProjectId}
        value={this.state.treeValue || this.props.selectedProjectId}
        onSelect={this.doSelect.bind(this)}
      >
        { loop(this.props.projectDatas) }
      </TreeSelect>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    projectDatas: state.getIn(['APP', 'projectTree']).data,
    selectedProjectId: state.getIn(['APP', 'ProTreSelected'])
  };
}

function mapDispatchToProps(dispatch) {
 return {
   ...bindActionCreators(action, dispatch)
 }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjSelect);
