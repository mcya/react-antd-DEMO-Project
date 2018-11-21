import React from 'react';
import { Modal, TreeSelect, Tree, Form, Row, Col, Input, Spin, Checkbox, Button, Select, Table } from 'antd';
import { getBuildTree } from '../../apps/projectPre/payment/api';
import * as action from '../../apps/projectPre/payment/action';
import * as AppAction from 'AppAction';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from '../../apps/projectPre/payment/component/common/index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
const CheckboxGroup = Checkbox.Group;


/*
* 使用： <BigProjToCheckBoxSelectBld titleName="请选择您的数据" getBigProjBldData={::this.getBigProjBldData} />
* getBigProjBldData(data){} getBigProjBldData为获取到的勾选数据
*/
class BigProjToCheckBoxSelectBld extends React.Component {
  constructor() {
    super();
    this.state = {
      defaultKeyValueStatus: [],
      selectedRowKeys: [],
      treeData: [],
    }
  }

  componentDidMount() {
    // console.log('this.props.ProTreSelected', this.props.bigProjChangeProjidValue);
    // this.props.getBuildTree({ projid: this.props.bigProjChangeProjidValue });
    // 大项目数据权限过滤
    var treeData = []
    console.log('log 9090', this.props.bigprojData);
    if (this.props.bigprojData && this.props.bigprojData.length>0) {
      var childrenProjLength = this.getChildProjLength(this.props.bigprojData)
      for (var i = 0; i < this.props.bigprojData.length; i++) {
        if (!this.props.bigprojData[i].bigProj) {
          getBuildTree({ projid: this.props.bigprojData[i].projid }).then( ({jsonResult}) => {
            console.log('jsonResult.data', jsonResult.data.projBldTree);
            if (jsonResult.data.projBldTree && jsonResult.data.projBldTree.length==1) {
              // if (jsonResult.data.projBldTree[0].children && jsonResult.data.projBldTree[0].children.length > 0) {
              //   var array = jsonResult.data.projBldTree[0].children;
              //   for (var j = 0; j < array.length; j++) {
              //     if (array[j].children && array[j].children.length>0) {
              //       for (var k = 0; k < array[j].children.length; k++) {
              //         if (array[j].children[k].children && array[j].children[k].children.length==0) {
              //           array[j].children[k].children = '';
              //           delete array[j].children[k].children;
              //         }
              //       }
              //     }
              //   }
              // }
              treeData.push(jsonResult.data.projBldTree[0])
            }
            console.log('childrenProjLength', childrenProjLength, treeData.length, treeData);
            if (childrenProjLength==treeData.length) {
              this.props.saveSateBldData(treeData)
            }
          }).catch( (error) => { console.log(error); })
          // .finally(() => {
          //   this.setState({ treeData })
          //   // this.props.saveSateBldData(treeData)
          // })
        }
      }
    }
    // this.setState({ treeData })
    this.setState({ selectedRowKeys: [] })
  }
  getChildProjLength(datas) {
   var j = 0
   for (var i = 0; i < datas.length; i++) {
     if (!datas[i].bigProj) {
       j++
     }
   }
   return j;
 }


  selectBldData(selectedData) {
    console.log('selectedData', selectedData);
  }
  detleteProjid(val) {
    for (var i = 0; i < this.props.bigprojData.length; i++) {
      if (val == this.props.bigprojData[i].projid) {
        return '-1'
      }
    }
    return val;
  }
  onCheck(setlectData) {
    // 先把项目过滤了再 透传
    console.log('setlectData 处理前', setlectData);
    var setlectDataArr = [];
    for (var i = 0; i < setlectData.length; i++) {
      var bldidVal = this.detleteProjid(setlectData[i]);
      if (bldidVal!='-1') {
        setlectDataArr.push(bldidVal)
      }
    }
    console.log('setlectData 处理后', setlectDataArr);
    this.props.getBigProjBldData(setlectDataArr);
  }
  render() {
    var _this = this;
    const loop = (data = []) => (data.length === 0 ? null : data.map((item = {}) => {
			// 非楼栋不可选
      if (item.children && item.children.length > 0) {
				if (item.type=='bld') {
					return(
						<TreeNode key={item.key} isleaf={item.isLeaf} value={item.bldid} name={item.projName} title={item.projName} >
							{loop(item.children)}
						</TreeNode>
					)
				}
        return (
          <TreeNode key={item.key} isleaf={item.isLeaf} value={item.projName+"zhuxin216"} name={item.projName} title={<span>{item.projName}</span>} >
            	{loop(item.children)}
          </TreeNode>
        );
      }
			if (item.type=='bld') {
				return(
					<TreeNode key={item.key} isleaf={item.isLeaf} value={item.bldid} name={item.projName} title={item.projName} >
						{loop(item.children)}
					</TreeNode>
				)
			}
			return (
				<TreeNode key={item.key} isleaf={item.isLeaf} value={item.projName+"zhuxin216"} name={item.projName} title={<span>{item.projName}</span>} >
						{loop(item.children)}
				</TreeNode>
			);
    }));
    const treeData = this.props.buildTree.projBldTree ? this.props.buildTree.projBldTree : [];

    return (
        <Form>
          <Row>
            <Col>
              <div className={styles.moduleMain}>
                <div className={styles.titleList}>{ this.props.titleName }</div>
                <div className={styles.chooseRoom}>
                    <Tree
                      checkable
                      onCheck={::this.onCheck}
                    >
                      {
                        (this.props.saveSateBldDataVal && this.props.saveSateBldDataVal.length > 0) ?
                        loop(this.props.saveSateBldDataVal)
                        : <p>该项目暂无楼栋数据。</p>
                      }
                    </Tree>
                </div>
              </div>
            </Col>
          </Row>
        </Form>
    )
  }
}
function mapStateToProps(state, ownProps) {
  console.log('state bigProjChangeProjidValue', state.getIn(['APP', 'bigProjChangeProjidValue']));
  return {
    bigprojData: state.getIn(['APP', 'bigprojData']),
    treeLoading: state.getIn(['projectPre', 'payment', 'treeLoading']),
    // bigProjChangeProjidValue: state.getIn(['APP', 'bigProjChangeProjidValue']),
    buildTree: state.getIn(['projectPre', 'payment', 'buildTree']).data,
    saveSateBldDataVal: state.getIn(['APP', 'saveSateBldDataVal']),
  }
}
function mapDispatchToProps(dispatch) {
	return {
    ...bindActionCreators(action, dispatch),
		...bindActionCreators(AppAction, dispatch),
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(BigProjToCheckBoxSelectBld)
