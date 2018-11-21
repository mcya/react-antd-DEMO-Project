import React from 'react';
import { Select, Button, TreeSelect } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as action from 'AppAction'
import _isEmpty from 'lodash/isEmpty'
const TreeNode = TreeSelect.TreeNode;


class BldTreeSelectNoDaf extends React.Component {
	constructor() {
    super();
		// disabledChanged: false,
    this.state = {
			fullName: []
    }
  }
	//页面加载后触发事件
	componentDidMount() {
		this.props.getBuildTree({ orgid: this.props.currentOrg.orgid })
    if (_isEmpty(this.props.ProTreSelect)) {
      // this.props.getBuldTreeSel();
    }
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.currentOrg.orgid !== nextProps.currentOrg.orgid) {
			this.props.getBuildTree({ orgid: nextProps.currentOrg.orgid })
			// console.log('orgid', nextProps.currentOrg.orgid);
		}
		if (nextProps.ProTreSelect.length > 0) {
			if (this.props.ProTreSelect.length === 0 || !nextProps.ProTreSelected) {
				// const proj = nextProps.ProTreSelect[0];
				// this.props.changeProjectSelected(proj.projid, proj.projname, proj.orgid);
				const bldData = this.props.ProTreSelect;
				// this.erchashu(bldData, value)
		    // this.props.changeBuldSelected(value);
			}
		}
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   return this.props.ProTreSelect !== nextProps.ProTreSelect
	// 				|| this.props.value !== nextProps.value
	// 				|| this.props.ProTreSelected !== nextProps.ProTreSelected;
  // }
	erchashu(dataa, valuee) {
    dataa.forEach((item = {}) => {
      if (item.type == 'bld' && item.bldid==valuee) {
				this.setState({
					fullName: item.fullname
				})
      } else if (item.type == 'proj' && item.key==valuee) {
				this.setState({
					fullName: item.projName
				})
      } else if (item.type == 'cpy' && item.key==valuee) {
				this.setState({
					fullName: item.projName
				})
      } else if (item.type == 'grp' && item.key==valuee) {
				this.setState({
					fullName: item.projName
				})
      } else {
          this.erchashu(item.children, valuee);
      }
  })
}
	// 选中树节点的时候
	onProjectSelect(value, node, extra) {
		// 遍历改变值
		const bldData = this.props.ProTreSelect;
		this.erchashu(bldData, value)
    this.props.changeBuldSelected(value);
  }
	render() {
    const loop = (data = []) => (data.length === 0 ? null : data.map((item = {}) => {
			// 非楼栋可选
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode key={item.key} isleaf={item.isLeaf} value={item.key} name={item.key} title={item.projName} >
            {loop(item.children)}
          </TreeNode>
        );
      }
			return <TreeNode key={item.key} isleaf={item.isLeaf} value={item.key} name={item.key} title={item.projName} />;
    }));
    return (
      <TreeSelect
        showSearch
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="--请选择--"
        notFoundContent="未找到"
        defaultValue={this.props.ProTreSelected}
        treeNodeFilterProp="name"
        allowClear
        value={this.state.fullName}
        onChange={::this.onProjectSelect}
        { ...this.props }
      >
        {loop(this.props.ProTreSelect)}
      </TreeSelect>
    );
	}
}

 function mapStateToProps(state, ownProps) {
  return {
    ProTreSelect: state.getIn(['APP', 'buildTree']).data.buildingTree,
		datadata: state.getIn(['APP', 'buildTree']).data,
		ProTreSelected: state.getIn(['APP', 'orgIdSelected']),
		currentOrg: state.getIn(['APP', 'CurrentOrg'])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(action, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(BldTreeSelectNoDaf)
