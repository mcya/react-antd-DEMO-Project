import React from 'react';
import { Row, Col, Select, Form } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import * as Api from '../../apps/api'
import * as action from '../../apps/action'
const Option = Select.Option;


/*
* 0.0 正常使用: <BigProjSelect />. 放入from中获取值即可
* 1.0 涉及到项目范围类使用：<BigProjSelect isAddPayment={true} onchengBigProj={::this.onchengBigProj} /> ; 当选择公司，房间不可选。
* 1.1 其中, isAddPayment为标识, onchengBigProj 函数返回一个value，即是，选中的 projid
* 2.0 查询模块获取子ids: <BigProjSelect needChildProjidFalge={true} getAllProjids={::this.getAllProjids} /> ; getAllProjids中接收选择的(大项目id, 所选的项目/如为大项目取子集id)
* bigprojData: state.getIn(['APP', 'bigprojData']), 获取大项目下拉数据
* bigProjChangeProjidValue: state.getIn(['APP', 'bigProjChangeProjidValue']), 更改项目而全局更改 所选的项目值类似 公共的projid
*/
const DictCacher = {};
class BigProjSelect extends React.Component {

  constructor() {
    super();
    this.state = {
      dictItemList: []
    }
  }

	componentDidMount() {//页面加载后触发事件
      const params = {
				userid: this.props.userInfo.user.userid,
        projid: this.props.ProTreSelected
			}
      this.props.getProjAuthDataByUserAndProjid(params);
      this.props.bigProjChangeProjid({ projName: this.props.ProTreeSelectEdName, value: this.props.ProTreSelected });// 切换tab 重置bigProjid

	}
  componentWillReceiveProps(nextProps) {
    if (nextProps.ProTreSelected!==this.props.ProTreSelected) {
      const params = {
				userid: nextProps.userInfo.user.userid,
        projid: nextProps.ProTreSelected
			}
      this.props.getProjAuthDataByUserAndProjid(params)
      this.props.bigProjChangeProjid({ projName: nextProps.ProTreeSelectEdName, value: nextProps.ProTreSelected });// 重置bigProjid
    }
  }
  isBigProjid(val) {
    for (var i = 0; i < this.props.bigprojData.length; i++) {
      if (this.props.bigprojData[i].projid==val && this.props.bigprojData[i].bigProj) {
        var projids = [];
        for (var i = 0; i < this.props.bigprojData.length; i++) {
          if (!this.props.bigprojData[i].bigProj) {
            projids.push(this.props.bigprojData[i].projid);
          }
        }
        return projids;
      }
    }
    return val;
  }
  getBigProjid() {
    for (var i = 0; i < this.props.bigprojData.length; i++) {
      if (this.props.bigprojData[i].bigProj) {
        return this.props.bigprojData[i].projid
      }
    }
  }

  changeSelect(value) {
    var params = {projName:'', value: value, }
    for (var i = 0; i < this.props.bigprojData.length; i++) {
      if (this.props.bigprojData[i].projid==value) {
        params.projName = this.props.bigprojData[i].projname;
      }
    }
    //全局存储
    this.props.bigProjChangeProjid(params);
    if (this.props.isAddPayment) {
      // 仅返回所选的 projid
      this.props.onchengBigProj(value);
    }
    if (this.props.needChildProjidFalge) {
      // 查询的时候 需要带出子项目的id 即是 返回 {大项目id, 所有子项目ids, 所选的}
      var bigProjid = this.getBigProjid(); //大项目id
      var projids = this.isBigProjid(value); //当选择大项目的时候返回所有子项目ids，否则只返回选择的当前项目id
      this.props.getAllProjids(bigProjid, projids);
    }
    // if (needChildAndSelectProjidFlage) {
    //   var bigProjid = this.getBigProjid(); //大项目id
    //   var projids = this.isBigProjid(value); //所有子项目ids
    //   this.props.getAllProjids(bigProjid, projids, value);
    // }
  }


	render() {
    console.log('this.props.bigprojData', this.props.bigprojData);
		const loop = (data = []) => ((data==null || data=='' || data=='null' || data.length==0) ? null : data.map(item => {
      return <Option key={item.projid} value={item.projid}>{(item.spreadname&&item.spreadname!==undefined&&item.spreadname!==null&&item.spreadname!=='')?item.spreadname:item.projname}</Option>;
		}));
		return (
      <Select
        size="large"
        {...this.props}
        allowClear={false}
        onSelect={::this.changeSelect}
      >
        {loop(this.props.bigprojData)}
      </Select>
		)
	}
}
function mapStateToProps(state, ownProps) {
	return {
    userInfo: state.getIn(['APP', 'userInfo']),
    ProTreSelected: state.getIn(['APP', 'ProTreSelected']),
    ProTreeSelectEdName: state.getIn(['APP', 'ProTreeSelectEdName']),
    bigprojData: state.getIn(['APP', 'bigprojData']),
  }
}
function mapDispatchToProps(dispatch) {
	return {
		...bindActionCreators(action, dispatch)
	}
}
// BigProjSelect = Form.create({})(BigProjSelect)
export default connect(mapStateToProps, mapDispatchToProps)(BigProjSelect)
