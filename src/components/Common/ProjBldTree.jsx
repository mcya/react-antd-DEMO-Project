import React from 'react';
import { Button, Spin, message, TreeSelect } from 'antd';
import TitleWithTools from 'TitleWithTools';
import MsgBox from 'MsgBox';
import * as action from 'AppAction'
// import styles from './index.less';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const TreeNode = TreeSelect.TreeNode;

class ProjBldTree extends React.Component {
  static defaultProps = {
    changeProjBld: () => {},
    multiple: false
  }
  constructor() {
   super();
   this.state = {
     selectedKeys: [],
     biaohong: true
   }
 }

 componentDidMount() {
   this.props.getBuildingsByProj({ projid: this.props.ProTreSelected })
 }

 componentWillReceiveProps(nextProps) {
  if (this.props.ProTreSelected !== nextProps.ProTreSelected) {
    this.setState({ selectedKeys: [] });
    this.props.getBuildingsByProj({ projid: nextProps.ProTreSelected });
  }
  if (this.props.getBuildingsByProjResult !== nextProps.getBuildingsByProjResult) {
    if (!nextProps.getBuildingsByProjResult.success) {
      message.error(nextProps.getBuildingsByProjResult.message)
    }
  }
  if (this.props.value !== nextProps.value) {
    this.setState({ selectedKeys: nextProps.value })
  }
 }

 onChange(selectedKeys, Node, extra) {
   if (extra.selected && !extra.triggerNode.props.isleaf) { //禁止选中业态
     return;
   }
   this.setState({ selectedKeys });
   this.props.changeProjBld({
     bldid: selectedKeys,
     bldname: Node[0]
   })
 }

 stopProp(e) {
   e.stopPropagation();
   this.setState({
     biaohong: false
   })
   const _this = this
   setTimeout(function() {
     _this.setState({
       biaohong: true
     })
   }, 5000);
 }

 render() {
  //  console.log('this--', this.props.ProjBldResult.data);
   const loop = (data = []) => (!data.length ? null : data.map((item = {}) => {
     if (item.children && item.children.length > 0) {
       return (
         <TreeNode key={item.nodeid} value={item.nodeid} parentid={item.parentid} name={item.nodename}
           title={
             <span onClick={::this.stopProp}>
               {item.nodename}
               {
                 this.state.biaohong ? ''
                 :
                 <span>
                   <br />
                   <span style={{ color: '#f50', textShadow: '-5px 3px 20px #f1b495' }}>操作提示：点击<span style={{ fontWeight: 'bold' }}>左侧三角形</span>展开下拉的内容哦</span>
                 </span>
               }
             </span>
        }>
           {loop(item.children)}
         </TreeNode>
       )
     }
     return (
       <TreeNode key={item.nodeid} isleaf value={item.nodeid} parentid={item.parentid} name={item.nodename} title={item.nodename} />
     )
   }));
   let isMultiple = {}
   if (this.props.multiple) {
     Object.assign(isMultiple, {
       allowClear: true,
       multiple: true
     })
   }
   return (
        <TreeSelect
          showSearch
          treeNodeFilterProp="title"
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          size="large"
          treeDefaultExpandAll
          placeholder="--请选择楼栋--"
          notFoundContent="未找到"
          onChange={::this.onChange}
          value={this.state.selectedKeys}
          {...isMultiple}
          {...this.props}
        >
          {loop(this.props.ProjBldResult.data)}
        </TreeSelect>
   )
  }
}
function mapStateToProps(state, ownProps) {
  // console.log('1---1', state.getIn(['APP', 'ProjBldSelected']));
 return {
   ProTreSelected: state.getIn(['APP', 'ProTreSelected']),
   ProjBldLoading: state.getIn(['APP', 'ProjBldLoading']),
   ProjBldResult: state.getIn(['APP', 'ProjBldResult']),
   ProjBldSelected: state.getIn(['APP', 'ProjBldSelected'])
 };
}

function mapDispatchToProps(dispatch) {
 return {
   ...bindActionCreators(action, dispatch)
 }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjBldTree)
