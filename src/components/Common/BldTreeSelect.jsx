import React from 'react';
import { Select, Button, TreeSelect } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as action from 'AppAction'
import _isEmpty from 'lodash/isEmpty'
const TreeNode = TreeSelect.TreeNode;


class BldTreeSelect extends React.Component {
	constructor() {
    super();
    this.state = {
			fullName: []
    }
  }
	//页面加载后触发事件
	componentDidMount() {
		this.props.getBuildTree({ orgid: this.props.currentOrg.orgid })
    if (_isEmpty(this.props.ProTreSelect)) {
      // this.props.getBuldTreeSel();
			// this.props.getBuildTree({ orgid: this.props.currentOrg.orgid })
    }
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.currentOrg.orgid !== nextProps.currentOrg.orgid) {
			this.props.getBuildTree({ orgid: nextProps.currentOrg.orgid })
			// console.log('orgid', nextProps.currentOrg.orgid);
		}
		// console.log('nextProps---楼栋树--', nextProps);
		// console.log('this.props--楼栋树--', this.props);
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
	// 非楼栋不显示
	erchashu(dataa, valuee) {
		// console.log('erchashu----', dataa, valuee);
    dataa.forEach((item = {}) => {
      if (item.type === 'bld' && item.projName === valuee) {
				// console.log('item.fullname', item.fullname);
				this.setState({
					fullName: item.fullname
				})
				// console.log('this.state.fullName', this.state.fullName);
      } else {
          this.erchashu(item.children, valuee);
      }
  })
}
	// 选中树节点的时候
	onProjectSelect(value, node, extra) {
		// 遍历改变值
		// console.log('onProjectSelect---', value, node, extra);
		const bldData = this.props.ProTreSelect;
		this.erchashu(bldData, value)
    this.props.changeBuldSelected(value);
  }
	maopao(e) {
		e.stopPropagation();
	}
	render() {
    //楼栋树树开始
    const loop = (data = []) => (data.length === 0 ? null : data.map((item = {}) => {
			// 非楼栋不可选
      if (item.children && item.children.length > 0) {
				if (item.type=='bld') {
					return(
						<TreeNode key={item.key} isleaf={item.isLeaf} value={item.projName} name={item.projName} title={item.projName} >
							{loop(item.children)}
						</TreeNode>
					)
				}
        return (
          <TreeNode key={item.key} isleaf={item.isLeaf} value={item.projName} name={item.projName} title={<span onClick={::this.maopao}>{item.projName}</span>} >
            	{loop(item.children)}
          </TreeNode>
        );
      }
			if (item.type=='bld') {
				return(
					<TreeNode key={item.key} isleaf={item.isLeaf} value={item.projName} name={item.projName} title={item.projName} >
						{loop(item.children)}
					</TreeNode>
				)
			}
			return (
				<TreeNode key={item.key} isleaf={item.isLeaf} value={item.projName} name={item.projName} title={<span onClick={::this.maopao}>{item.projName}</span>} >
						{loop(item.children)}
				</TreeNode>
			);
    }));
		const thisFullName = this.state.fullName
		// console.log('thisFullName', thisFullName);
    return (
      <TreeSelect
        showSearch
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="--请选择--"
        notFoundContent="未找到"
        defaultValue={this.props.ProTreSelected}
        treeNodeFilterProp="name"
        allowClear
        treeDefaultExpandAll
        value={thisFullName}
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
		ProTreSelected: state.getIn(['APP', 'orgIdSelected']),
		currentOrg: state.getIn(['APP', 'CurrentOrg'])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(action, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(BldTreeSelect)
