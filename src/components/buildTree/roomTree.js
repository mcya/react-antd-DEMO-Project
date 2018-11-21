import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AppAction from 'AppAction';
import { Modal, Row, Col, Tree, Checkbox, Button, Spin } from 'antd';
import styles from './index.less';
import MsgBox from 'MsgBox';

const TreeNode = Tree.TreeNode;
const CheckboxGroup = Checkbox.Group;

//页面渲染逻辑：
//点选楼栋请求出对应的单元（数据包含楼层和房间）。。。，数据储存在state
//点选单元通过index取出楼层（数据包含房间）。。。
//点选楼层通过index取出房间。。。
//单元和楼层的选中逻辑：选中数据添加 { current: true } 属性，其余为 false；render函数中
//将 current = true 的数据渲染 className = "chooseOption"
//
// API:
// multiple: 是否允许多选, boolean
// getRoomSelected: 选中房间时调用的方法， function, 必填！！！
// mutexData: 互斥数据，选填

class RoomTreeByBld extends React.Component {
  static propTypes = {
    multiple: React.PropTypes.bool,
    getRoomSelected: React.PropTypes.func
  }
  constructor() {
    super();
    this.state = {
      bldSelectedKeys: [], //楼栋key
      bldSelectedName: '', //楼栋name
      unitData: [], //楼栋对应的单元、楼层、房间
      unitName: '', //选中的单元name
      floorData: [], //单元对应的楼层data
      floorName: '', //选中的楼层name
      roomOptions: [], //楼层对应的房间data
      roomSelectedValues: [], //选中的房间
      indeterminate: false, //房间部分选中图标
      checkAll: false, //房间全选标识
    }
  }
  componentWillMount() {
    if (!this.props.buildDataRes.projBldTree.length) { //没有楼栋数据时请求楼栋
      const params = {
        projid: this.props.ProTreSelected
      };
      this.props.acGetBuildData(params)
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.buildDetailDataRes !== this.props.buildDetailDataRes && nextProps.buildDetailDataRes.success) {
      this.setState({
        unitData: nextProps.buildDetailDataRes.data
      });
    }
    //互斥数据有值的时候清空房间
    if (nextProps.mutexData && nextProps.mutexData.length) {
      this.cleanRoomSelect();
    }
  }
  cleanRoomSelect() { //清空选中的房间
    this.setState({
      roomSelectedValues: [],
      indeterminate: false,
      checkAll: false
    })
  }
  bldSelect(selectedKeys, node) { //点击楼栋
    this.props.getBuildDetailByBldId({ bldid: selectedKeys });
    this.cleanRoomSelect();
    this.setState({
      bldSelectedKeys: selectedKeys,
      bldSelectedName: node.node.props.title,
      unitName: '', //清空单元name
      floorData: [], //清空楼栋
      floorName: '', //清空楼层name
      roomOptions: [] //清空房间
    });
  }
  unitSelect(index) { //点击单元
    const { unitData } = this.state;
    //先将所有节点的current改成false，再将当前节点改为true
    unitData.map(item => Object.assign(item, { current: false }));
    Object.assign(unitData[index], { current: true });
    const floorData = unitData[index].floors;
    this.cleanRoomSelect();
    this.setState({
      unitData,
      unitName: unitData[index].unit,
      floorData,
      roomOptions: [] //清空房间
    });
  }
  floorSelect(index) { //点击楼层
    const { floorData } = this.state;
    //先将所有节点的current改成false，再将当前节点改为true
    floorData.map(item => Object.assign(item, { current: false }));
    Object.assign(floorData[index], { current: true });
    const roomData = floorData[index].rooms;
    //房间解析
    const roomOptions = [];
    roomData.map(item => roomOptions.push({ label: item.room, value: item.roomid }));
    this.cleanRoomSelect();
    this.setState({
      floorData,
      floorName: floorData[index].floor,
      roomOptions
    });
  }
  roomSelect(checkedValues) { //点击房间-单选
    //是否允许多选
    const finalValues = this.props.multiple ? checkedValues : [checkedValues[checkedValues.length - 1]];
    const { roomOptions, bldSelectedName, unitName, floorName } = this.state;
    const getData = p => q => q.value === p; //柯里化函数
    const execute = () => {
      //option是每次匹配到的一个房间节点数组 [{ label: '...', value: '...' }];
      //(item) => {}该函数每次需要返回一个房间节点，而不是数组
      const params = finalValues.map(item => {
        const option = roomOptions.filter(getData(item));
        return option[0];
      });
      //console.log('当前选中信息：', `${bldSelectedName}${unitName}单元${floorName}层`)
      // 可以根据实际需求返回特定格式的数据
      // 目前客户台账模块需要单选，返回x栋xxx。房源绑定需要多选，返回x栋x单元x层xxx。
      const fullName = this.props.multiple ? `${bldSelectedName}${unitName}单元${floorName}层` : `${bldSelectedName}`;
      const checkedData = params.map(item => ({ value: item.value, label: fullName + item.label }));
      this.props.getRoomSelected(checkedData);
      this.setState({
        roomSelectedValues: finalValues,
        indeterminate: !!finalValues.length && (finalValues.length < this.state.roomOptions.length),
        checkAll: finalValues.length === this.state.roomOptions.length
      });
    };
    //mutexData:互斥的楼栋数据，如果有值则提示
    if (this.props.mutexData && this.props.mutexData.length) {
      MsgBox.confirm({
        title: '是否确定选择房间',
        content: '当选择房间的时候，之前选中的楼栋数据会被清空，请确认是否要做此操作！',
        okText: '确认',
        cancelText: '取消',
        onOk: () => { execute(); },
        onCancel: () => { return false; }
      });
    } else {
      execute();
    }
  }
  roomAllSelect(e) { //点击房间-全选
    const { roomOptions, bldSelectedName, unitName, floorName } = this.state;
    const params = e.target.checked ? roomOptions : [];
    const execute = () => { //执行函数
      const fullName = `${bldSelectedName}${unitName}单元${floorName}层`;
      const checkedData = params.map(item => ({ value: item.value, label: fullName + item.label }));
      this.props.getRoomSelected(checkedData);
      this.setState({
        roomSelectedValues: e.target.checked ? roomOptions.map(item => item.value) : [],
        indeterminate: false,
        checkAll: e.target.checked
      });
    };
    //mutexData:互斥的楼栋数据，如果有值则提示
    if (this.props.mutexData.length) {
      MsgBox.confirm({
        title: '是否确定选择房间',
        content: '当选择房间的时候，之前选中的楼栋数据会被清空，请确认是否要做此操作！',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          execute();
        },
        onCancel: () => { return false; }
      });
    } else {
      execute();
    }
  }
  render() {
    // 楼栋树
    const projBldTree = this.props.buildDataRes.projBldTree;
    const TreeNodeList = projBldTree.length ? projBldTree[0].children : [];
    const bldLoop = (data = []) => (data.length ? data.map((item, index) => <TreeNode key={item.bldid} title={item.projName} />) : null);

    //楼层解析
    const floorLoop = (data = []) => (data.length ? data.map((item, index) => (
      item.current ?
      <p key={`floor_${index}`} className="chooseOption" onClick={this.floorSelect.bind(this, index)}>{item.floor}</p> :
      <p key={`floor_${index}`} onClick={this.floorSelect.bind(this, index)}>{item.floor}</p>
    )) : null);
    return (
      <div>
        <Row gutter={16}>
          <Col span={8}>
            <div className={styles.moduleMain}>
              <div className={styles.titleList}>楼栋</div>
              <div className={styles.chooseRoom}>
                <Spin spinning={this.props.buildDataLoading}>
                  <Tree
                    defaultExpandAll
                    selectedKeys={this.state.bldSelectedKeys}
                    onSelect={this.bldSelect.bind(this)}
                  >
                    { bldLoop(TreeNodeList) }
                  </Tree>
                </Spin>
              </div>
            </div>
          </Col>
          <Col span={3}>
            <div className={styles.moduleMain}>
              <div className={styles.titleList}>单元</div>
              <div className={styles.chooseRoom} style={{ textAlign: 'center' }} id="unit">
                <Spin spinning={this.props.buildDetailDataLoading}>
                  {
                    //逻辑：界面打开时只显示楼栋，其他均不显示
                    this.state.bldSelectedKeys.length && this.state.unitData && this.state.unitData.length ?
                    this.state.unitData.map((item, index) => (
                      item.current ?
                      <p key={`unit_${index}`} className="chooseOption" onClick={this.unitSelect.bind(this, index)}>{item.unit}</p> :
                      <p key={`unit_${index}`} onClick={this.unitSelect.bind(this, index)}>{item.unit}</p>
                    )) : null
                  }
                </Spin>
              </div>
            </div>
          </Col>
          <Col span={3}>
            <div className={styles.moduleMain}>
              <div className={styles.titleList}>楼层</div>
              <div className={styles.chooseRoom} style={{ textAlign: 'center' }} id="floor">
                { floorLoop(this.state.floorData) }
              </div>
            </div>
          </Col>
          <Col span={10}>
            <div className={styles.moduleMain}>
              <div className={styles.titleList}>房间</div>
              <div className={styles.chooseRoom}>
                {
                  this.props.multiple ?
                  <div style={{ padding: '2px 7px', borderBottom: '1px solid #d9d9d9' }}>
                    <Checkbox
                      indeterminate={this.state.indeterminate}
                      onChange={this.roomAllSelect.bind(this)}
                      checked={this.state.checkAll}
                    >全选</Checkbox>
                </div> : null
                }
                <CheckboxGroup
                  options={this.state.roomOptions}
                  value={this.state.roomSelectedValues}
                  onChange={this.roomSelect.bind(this)}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    buildDataLoading: state.getIn(['APP', 'buildDataLoading']),
    buildDataRes: state.getIn(['APP', 'buildDataRes']).data,
    buildDetailDataLoading: state.getIn(['APP', 'buildDetailDataLoading']),
    buildDetailDataRes: state.getIn(['APP', 'buildDetailDataRes']),
    ProTreSelected: state.getIn(['APP', 'ProTreSelected'])
  }
}
function mapDispatchToProps(dispatch) {
	return {
		...bindActionCreators(AppAction, dispatch)
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(RoomTreeByBld)
