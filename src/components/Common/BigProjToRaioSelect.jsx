import React from 'react';
import { Button, Spin, message, TreeSelect } from 'antd';
import { getBuildingsByProj } from '../../apps/api';
import TitleWithTools from 'TitleWithTools';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as action from 'AppAction';
import MsgBox from 'MsgBox';

const TreeNode = TreeSelect.TreeNode;

/*
* 使用方式:
* import BigProjToRaioSelect from 'BigProjToRaioSelect';

* 1.0 常规使用: <BigProjToRaioSelect changeProjBld={::this.changeProjBld} />; 传值到 changeProjBld 函数: 传值{ bldid, bldname, selectedProjid }
* 1.1 changeProjBld 返回一个对象 {bldid, bldname, selectedProjid}
* 1.2 其中, 返回一个 value: { bldid: '选择的楼栋ID', bldname: '选择的楼栋名称', selectedProjid: '所属的项目id', };

* 2.0 表格式: <BigProjToRaioSelect isForm={true} />; 在 props.form 中获取

* 3.0 项目级联动使用: <BigProjToRaioSelect changeProjFlage={this.state.changeProjFlage} changeProjVal={this.state.changeProjVal}/>
*** 3.1 其中, changeProjFlage 为标识, changeProjVal 为当前大项目组件(BigProjSelect)所选的项目id;
*** 3.2 this.state.changeProjFlage 默认值为false 需要在选择大项目了之后再变为true; 与 changeProjVal 同步。
*** 3.3 由于切换项目会使楼栋发生变化, 为保证不出现一串id, 需在引入的地方进行重置: this.props.form.setFieldsValue({ bldid: ''});

*/

class BigProjToRaioSelect extends React.Component {
  static defaultProps = {
    changeProjBld: () => {},
    multiple: false
  }
  constructor() {
   super();
   this.state = {
     selectedKeys: [],
     biaohong: true,
     loadingState: false,
     treeData: [],
   }
 }

 componentDidMount() {
   this.props.getProjAuthDataByUserAndProjid({
     userid: this.props.userInfo.user.userid,
     projid: this.props.ProTreSelected
   })
 }
 getChildProjLength(datas) {
   var j = 0
   for (var i = 0; i < datas.length; i++) {
     if (!datas[i].bigProj) {
       j++
     }
   }
   console.log('getChildProjLength', datas, j);
   return j;
 }
 getTreeData(datas) { //直接获取大项目楼栋树
   // console.log('测试走你 5.1', datas);
   var treeData = [];
   var childrenProjLength = this.getChildProjLength(datas); //获取非大项目个数
   var _this = this;
   datas.map((item) => {
     // console.log('测试走你 5.2', treeData);
     if (!item.bigProj) {
       getBuildingsByProj({ projid: item.projid }).then( ({jsonResult}) => {
         if (jsonResult.data && jsonResult.data.length==1) {
           treeData.push(jsonResult.data[0])
         }
         if (treeData.length==childrenProjLength) {
           _this.props.saveSateBldData(treeData)
         }
       }).catch( (error) => { console.log(error); })
     }
   })

   if (treeData.length==childrenProjLength) {
     this.props.saveSateBldData(treeData)
   }
 }

 componentWillReceiveProps(nextProps) {
   console.log('测试走你 2', nextProps.bigprojData, nextProps.ProTreSelected);
   if (nextProps.bigprojData && nextProps.changeProjFlage && (nextProps.changeProjVal!==this.props.changeProjVal || nextProps.changeProjFlage!==this.props.changeProjFlage)) {
     // 项目联动，更改项目之后，直接更改楼栋数据，这个需要在引用组件的地方进行配置。
     this.getTreeDataToProjSelect(nextProps.bigprojData, nextProps.changeProjVal)
   }
   if (nextProps.ProTreSelected!==this.props.ProTreSelected) {
     this.props.getProjAuthDataByUserAndProjid({
       userid: nextProps.userInfo.user.userid,
       projid: nextProps.ProTreSelected
     })
   }
   if (nextProps.bigprojData && nextProps.ProTreSelected!==this.props.ProTreSelected) {
     if (nextProps.bigprojData.length>0) {
       // this.setState({ loadingState: true });
       this.getTreeData(nextProps.bigprojData);
     }
   }
   if (nextProps.bigprojData!==this.props.bigprojData) {
     if (nextProps.bigprojData.length>0) {
       // this.setState({ loadingState: true });
       this.getTreeData(nextProps.bigprojData);
     }
   }
   if (nextProps.bigprojData && nextProps.bigprojData!==this.props.bigprojData) {
     if (nextProps.bigprojData.length>0) {
       // this.setState({ loadingState: true });
       this.getTreeData(nextProps.bigprojData);
     }
   }
 }
 getTreeDataToProjSelect(bigProjData, changeProjVal) {
   var falge = this.isBigProjid(changeProjVal);
   // this.setState({ selectedKeys: [] }) //清空选中值，避免出现英文
   if (falge) { //直接获取大项目数据
     this.getTreeData(bigProjData);
   } else { //只查询所选的子项目
     var treeData = [];
     getBuildingsByProj({ projid: changeProjVal }).then( ({jsonResult}) => {
       if (jsonResult.data && jsonResult.data.length==1) {
         treeData.push(jsonResult.data[0])
       }
       console.log('getTreeDataToProjSelect 1', treeData, treeData.length);
       if (treeData.length==1) {
         console.log('getTreeDataToProjSelect 2', treeData);
         // this.setState({ loadingState: false })
         this.props.saveSateBldData(treeData)
       }
     }).catch( (error) => { console.log(error); })
   }
 }
 isBigProjid(val) { //判断所选项目是否属于大项目
   for (var i = 0; i < this.props.bigprojData.length; i++) {
     if (this.props.bigprojData[i].bigProj && this.props.bigprojData[i].projid==val) {
       return true
     }
   }
   return false
 }


 onChange(selectedKeys, Node, extra) {
   if (extra.selected && !extra.triggerNode.props.isleaf) { //禁止选中业态
     return;
   }

   var array = this.props.saveSateBldDataVal, selectedProjName = "";
   for (var i = 0; i < array.length; i++) {
     if (array[i].nodeid == extra.triggerNode.props.parentid) {
       selectedProjName = array[i].nodename
     }
   }

   this.setState({ selectedKeys });
   if (this.props.isForm) {
     return
   }
   this.props.changeProjBld({
     bldid: selectedKeys, bldname: Node[0], selectedProjid: extra.triggerNode.props.parentid, selectedProjName: selectedProjName,
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
          treeDefaultExpandAll={false}
          placeholder="--请选择楼栋--"
          notFoundContent="未找到"
          onChange={::this.onChange}
          value={this.state.selectedKeys}
          // loading={this.state.loadingState}
          {...isMultiple}
          {...this.props}
        >
          {loop(this.props.saveSateBldDataVal)}
        </TreeSelect>
   )
  }
}
function mapStateToProps(state, ownProps) {
 return {
   userInfo: state.getIn(['APP', 'userInfo']),
   bigprojData: state.getIn(['APP', 'bigprojData']),
   ProTreSelected: state.getIn(['APP', 'ProTreSelected']),
   saveSateBldDataVal: state.getIn(['APP', 'saveSateBldDataVal']),
 };
}

function mapDispatchToProps(dispatch) {
 return {
   ...bindActionCreators(action, dispatch)
 }
}
export default connect(mapStateToProps, mapDispatchToProps)(BigProjToRaioSelect)
