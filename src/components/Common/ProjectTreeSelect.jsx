import React from 'react';
import { Select, Button, TreeSelect } from 'antd';
import MsgBox from 'MsgBox';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as action from 'AppAction'
import _isEmpty from 'lodash/isEmpty'
import _find from 'lodash/find'
import { getCurrentProject } from 'util'

const TreeNode = TreeSelect.TreeNode;


class ProjectTreeSelect extends React.Component {

	componentDidMount() {
		const currentProject = getCurrentProject();

		if (currentProject) {
			this.props.changeProjectSelected(currentProject.projid, currentProject.projname, currentProject.orgid, currentProject.projData);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.projectDatas.length === 0 && nextProps.projectDatas.length > 0) {
			const currentProject = getCurrentProject();
			if (currentProject) {
				this.props.changeProjectSelected(currentProject.projid, currentProject.projname, currentProject.orgid, currentProject);
			}
		} else if (this.props.projectDatas !== nextProps.projectDatas
			&& nextProps.projectDatas.length > 0) {
				const childrenProj = [];
				const loopProj = (projectDatas) => {
					projectDatas.forEach((item) => {
						if (item && item.children && item.children.length > 0) {
							loopProj(item.children)
						} else {
							childrenProj.push(item)
						}
					})
				}
				loopProj(nextProps.projectDatas);
				const proj = childrenProj[0];
				const projname = proj.projshortname ? proj.projshortname : proj.projname;
				this.props.changeProjectSelected(proj.projid, projname, proj.orgid, proj);
		}
  }

  //shouldComponentUpdate(nextProps, nextState) {
    //return this.props.ProTreSelect !== nextProps.ProTreSelect
					//|| this.props.value !== nextProps.value
					//|| this.props.ProTreSelected !== nextProps.ProTreSelected;
//  }

  	commonFun(value, label, extra) {
			const ProjectOrgId = extra.triggerNode.props.orgId;//选取的项目的orgId
			const projData = extra.triggerNode.props.itemNode;
			this.props.changeProjectSelected(value, label, ProjectOrgId, projData);
			if (!value && this.props.onUnselect) {
				this.props.onUnselect();
			}
		}
    onChangeHandle(value, label, extra) {
			if (!extra.triggerNode.props.isleaf) { //禁止选中大项目
				return;
			}
			// 20171130：昨天坤哥跟林工说要去掉这个提示，说是禅道上有明确提出这样的需求--yy。
			// const _this = this;
			// MsgBox.confirm({
			// 	title: '提示',
			// 	content: '切换项目时，将关闭当前所有标签页，回到我的工作台页面！',
			// 	onOk: () => _this.commonFun(value, label, extra)
			// })
			this.commonFun(value, label, extra)
    }

	render() {
    //项目树开始
    const loop = (data = []) => (data.length === 0 ? null : data.map((item = {}) => {
      if (item.children && item.children.length > 0) {
				let nameNei;
				if (item.projshortname) {
					nameNei = item.projshortname
				} else {
					nameNei = item.projname
				}
        return (
          <TreeNode itemNode={item} key={item.projcode} value={item.projid} name={nameNei} title={nameNei} orgId={item.orgid} nodeType={'proj'} projCode={item.projcode}>
            {loop(item.children)}
          </TreeNode>
        );
      }
			let nameWai;
			if (item.projshortname) {
				nameWai = item.projshortname
			} else {
				nameWai = item.projname
			}
			return <TreeNode itemNode={item} key={item.projcode} isleaf value={item.projid} name={nameWai} title={nameWai} orgId={item.orgid} nodeType={'proj'} projCode={item.projcode} />;
    }));
		//处理切换公司后自动选择大项目下的第一个小项目
		// const projectDatas = this.props.projectDatas;
		// let selectedProjectId = this.props.selectedProjectId;
		// if (projectDatas instanceof Array && projectDatas.length) {
		// 	const projectObj = _find(projectDatas, { projid: selectedProjectId });
		// 	if (projectObj && projectObj.children && projectObj.children.length > 0) {
		// 		selectedProjectId = projectObj.children[0].projid;
		// 	}
		// }
    return (
      <TreeSelect
        showSearch
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="--请选择项目--"
        notFoundContent="未找到"
        defaultValue={this.props.selectedProjectId}
        treeNodeFilterProp="name"
        allowClear
        treeDefaultExpandAll
        value={this.props.selectedProjectId}
        onChange={::this.onChangeHandle}
        {...this.props}
      >
        {loop(this.props.projectDatas)}
      </TreeSelect>
    );
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
export default connect(mapStateToProps, mapDispatchToProps)(ProjectTreeSelect)
