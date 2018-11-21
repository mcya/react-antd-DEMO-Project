import React from 'react';
import { Row, Col, Button, TreeSelect, Input, Modal, Tree, Icon } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import * as action from 'AppAction';
import styles from './common.less';

const TreeNode = TreeSelect.TreeNode;
// const TreeNode = Tree.TreeNode;

class ProjTree extends React.Component {
  	constructor() {
    	super();
   		this.state={
	    	projIds: '',
	    	expandedKeys: [],
	    	autoExpandParent: true,
        selectValue: [],
	    	selectedKeys: [],
	    	checkStrictly:false
   		 }
  	}


  componentWillReceiveProps(nextProps) {
    if (this.props.clickTime !== nextProps.clickTime) {
      this.setState({
        selectValue: []
      })
    }
  }


    onCheck = (value, label, checkedKeys) => {
      // console.log('value:',value, 'label:',label, 'checkedKeys:',checkedKeys);
      this.setState({
        selectValue: value
      })
    }

	saveProj() {
		const projIds = [];
    // console.log("save:", this.state.selectValue)
		this.props.addProj((this.state.selectValue).join(','));
	}

	render() {
		const loop = (data = []) => (!data.length ? null : data.map((item = {}) => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode key={item.projid} name={item.projname} value={item.projid} title={item.projname} >
            {loop(item.children)}
          </TreeNode>
        );
      }
        return <TreeNode key={item.projid} name={item.projname} value={item.projid} title={item.projname} />;
    }));
    const abc = []
		return (
      <Modal
        onCancel={this.props.hiddeProjTree}
        key={this.props.clickTime}
        title="新增项目"
        visible={this.props.visible}
        onOk={::this.saveProj.bind(this)}
        width={400}
        maskClosable={false}
        footer={[
          <Button type="primary" onClick={::this.saveProj}>确定</Button>,
          <Button onClick={this.props.hiddeProjTree}>取消</Button>
        ]}
      >
      		{/* <div className={styles['proj-title']}>
      		项目树
      		<Icon type="save" onClick={::this.saveProj.bind(this)}  className={styles['proj-btn-save']} />
      		<Icon type="close" onClick={this.props.hiddeProjTree} className={styles['proj-btn-close']}/>
      		</div> */}
      		{/* {this.props.projTree.length ? */}
          {/* <Input /> */}
          {/* checkStrictly={this.state.checkStrictly} */}
            {/* <Tree
              checkable
              onCheck={::this.onCheck}
              autoExpandParent={false}
              CheckedKeys={this.state.CheckedKeys}
            >
              {loop(this.props.projTree)}
            </Tree> */}
             {/* : 'loading tree'} */}
             <TreeSelect
               showSearch
               multiple={true}
               treeCheckable={true}
               size="large"
               notFoundContent="未找到"
               treeNodeFilterProp="name"
               onChange={::this.onCheck}
               placeholder="-----点击此处，选择项目 / 或输入文字搜索相关项目-----"
               dropdownStyle={{ maxHeight: 222, overflow: 'auto' }}
               {...this.props}
             >
               {loop(this.props.projTree)}
             </TreeSelect>
          </Modal>
		)
	}
}

 function mapStateToProps(state, ownProps) {
  return {
    currentOrg: state.getIn(['APP', 'CurrentOrg']),
    projTree: state.getIn(['APP', 'projectTree']).data
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(action, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjTree)
