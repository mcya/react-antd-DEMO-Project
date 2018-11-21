import React from 'react';
import { Modal, Form, Row, Col, Input, Button, Icon, Table, message, Select, Tree, Popconfirm, InputNumber, Spin } from 'antd';
import TitleWithTools from 'TitleWithTools';
import MsgBox from 'MsgBox';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as action from '../../apps/saleMgr/orderInfo/action'
import _union from 'lodash/union';
import _cloneDeep from 'lodash/cloneDeep';
import _unionBy from 'lodash/unionBy';
import _concat from 'lodash/concat'
import _difference from 'lodash/difference'
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;

class Salesman extends React.Component {
  static defaultProps = {
    callbackSalesman: () => {}
  }
  constructor() {
   super();
   this.state = {
     addDetailVisible: false,
     selectedRowKeys: [],
     selectedRows: [],
     dataRows: [],
     nodeSeletedRows: [],
     nodeSeletedKeys: []
   }
 }

componentWillReceiveProps(nextProps) {
  if (this.props.sellerVisible !== nextProps.sellerVisible && nextProps.sellerVisible) {
    this.setState({ dataRows: [] });
  }
}

componentWillUnmount() {
  console.log('componentWillUnmount');
  this.cleanSelectedRowKeys();
}

addDetail() {
  this.setState({ addDetailVisible: true });
  this.props.getStaUserTreeByProjId({ projid: this.props.projid })
}
closeAddDetail() {
  this.setState({ addDetailVisible: false, nodeSeletedKeys: [] })
}
onDelete(item) {
  const _this = this;
  MsgBox.confirm({
    title: '提示',
    content: '确定要删除吗?',
    onOk: _this.deleteSalesman.bind(_this)
  })
}

onMemoChange(text, record, e) {
  //console.log('onMemoChange:e, text, record', e, text, record);
  record.memo = e.target.value;
  this.forceUpdate();
}

cleanSelectedRowKeys() {
  this.setState({ selectedRowKeys: [], selectedRows: [], dataRows: [] });
}

closeEvent() {
  this.cleanSelectedRowKeys();
  this.props.closeSeller();
}

saveSalesman() {
  console.log('this.state.dataRows:', this.state.dataRows);
  const submitData = this.state.dataRows;
  this.props.callbackSalesman(submitData);
  this.closeEvent();
}

hasValueInArray(v = {}, arr = []) {
  for (var i in arr) {
    if (arr[i].salesid == v.salesid) return true;
  }
  return false;
}

saveAddDetail() {
  const { nodeSeletedRows } = this.state;
  let { dataRows } = this.state;
  if (this.props.isRadio) {
    dataRows = [];
  }
  if (nodeSeletedRows.length > 0) {
    nodeSeletedRows.map((val) => {
      val.salesid = val.id;
      val.salesname = val.name;
      val.salesmanid = val.id;
      val.salesmantype = this.props.salesmantype;
      val.memo = null;
      val.agentid = val.agentid;
      val.agentname = val.agentname;
      val.pid = val.pid;
      val.pname = val.pname;
      val.orgname = val.orgname;
      val.orgcode = val.orgcode;
      dataRows.push(val);
      return dataRows;
    })
    console.log('dataRows', dataRows);
    this.setState({
      dataRows,
      nodeSeletedRows: [],
      nodeSeletedKeys: []
    });
    this.closeAddDetail();
  } else {
    message.warning('请选择团队成员！')
  }
}

deleteSalesman() {
  const b = this.state.selectedRows;
  const newDataRows = this.state.dataRows.filter(x => !this.hasValueInArray(x, b));
  this.setState({
    dataRows: newDataRows,
    selectedRows: [],
    selectedRowKeys: []
  });
}

onNodeSelect(selectedKeys, e) {
  const record = e.node.props;
  const { nodeSeletedRows } = this.state;
  //console.log('selectedNodes', selectedKeys, e);
  if ((e.selected || e.checked) && record.type === 'user') {
    nodeSeletedRows.push({
      id: record.eventKey,
      name: record.title,
      agentid: record.agentid,
      agentname: record.agentname,
      pid: record.pid,
      pname: record.pname,
      orgname: record.orgname,
      orgcode: record.orgcode
    });
    this.setState({
      nodeSeletedKeys: selectedKeys,
      nodeSeletedRows
    })
  } else if (!(e.selected || e.checked)) {
    nodeSeletedRows.map((val, key) => {
      if (val.id === record.eventKey) {
        nodeSeletedRows.splice(key, 1)
      }
      return nodeSeletedRows;
    })
    this.setState({
      nodeSeletedKeys: selectedKeys,
      nodeSeletedRows
    })
  } else {
    message.error('请选择团队成员！')
  }
}

treeDisabled(e) {//已存在的销售员不可选
  const { dataRows } = this.state;
  let result = false;
  if (dataRows) {
     dataRows.map((val) => {
       if (e.id === val.salesid) {
         result = true;
       }
       return result;
     })
  }
   return result;
}
radioDisabled(e) {
  let result = false;
  if (this.state.nodeSeletedKeys.length === 0) {
    result = false;
  } else if (this.state.nodeSeletedKeys[0] !== e.id) {
    result = true;
  } else {

  }
  return result;
}

render() {
  const allTeam = this.props.getStaUserTreeByOrgIdResult.data || []; //所有成员
  console.log('allTeam', this.props.getStaUserTreeByOrgIdResult.data);
  const validTeam = _cloneDeep(allTeam); //有效成员
  // console.log('//有效成员', validTeam);
  const filterSecond = (data) => {//筛选第二步
    for (let i = data.length - 1; i > -1; i--) {
      if (data[i].children) {
        filterSecond(data[i].children)
      }
      if (data[i] === '') {
        data.splice(i, 1);
      }
    }
    return data;
  }
  const filterFirst = (data) => {//筛选第一步
    data.map((val, key) => {
      if (val.children) {
        filterFirst(val.children)
      }
      if (val.status === '1') {
        data[key] = ''
      }
      return data;
    });
    filterSecond(data);
    return data;
  }
  const screenTree = filterFirst(validTeam); //最终treeData
  // console.log('最终treeData', screenTree);
  const loop = (data = []) => (data.length === 0 ? null : data.map((item = {}) => {
    if (item.children) {
      return (
        <TreeNode key={item.id} title={item.name} type={item.type}
          pid={item.pid} pname={item.pname} agentid={item.agentid} agentname={item.agentname}
          orgname={item.orgname} orgcode={item.orgcode}
          disabled={this.props.isRadio ? this.radioDisabled(item) : this.treeDisabled(item)}>
          {loop(item.children)}
        </TreeNode>
      )
    }
    return <TreeNode title={item.name} key={item.id} type={item.type}
      pid={item.pid} pname={item.pname} agentid={item.agentid} agentname={item.agentname}
      orgname={item.orgname} orgcode={item.orgcode}
      disabled={this.props.isRadio ? this.radioDisabled(item) : this.treeDisabled(item)}
    />
  }))
  const salesmantype = this.props.salesmantype;

  const columns = [{
    title: '序号',
    dataIndex: 'sortorder',
    render: (text, record, index) => ++index
  }, {
    title: '代理公司',
    dataIndex: 'agentname',
    className: this.props.title ? '' : 'hiddenColumn'
  }, {
    title: this.props.title ? this.props.title : '业务员',
    dataIndex: 'salesname'
  }];
  const _this = this;
  const rowSelection = {
    selectedRowKeys: this.state.selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      _this.setState({ selectedRowKeys, selectedRows });
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User'
    })
  };
  return (
    <Modal
      title={this.props.title ? this.props.title : '时代家业务员'}
      maskClosable={false}
      visible={this.props.sellerVisible}
      onCancel={::this.closeEvent}
      width={600}
      footer={[
        <Button key="sellerBtn1" onClick={::this.saveSalesman} loading={this.props.loading} type="primary">保存</Button>,
        <Button key="sellerBtn2" onClick={::this.closeEvent} loading={this.props.loading} >关闭</Button>
      ]}
    >
      <TitleWithTools name={this.props.title ? `${this.props.title}列表` : '时代家业务员列表'}>
        <Button type="ghost" onClick={::this.addDetail}>新增</Button>&nbsp;
        <Button type="ghost" onClick={::this.onDelete}>删除</Button>
      </TitleWithTools>
      <Table
        rowKey="salesid"
        size="middle"
        className={"InterlacedBg"}
        columns={columns}
        dataSource={this.state.dataRows}
        rowSelection={rowSelection}
      />
        <Modal title="选择项目团队成员"
          maskClosable={false}
          visible={this.state.addDetailVisible}
          onCancel={::this.closeAddDetail}
          width={400}
          footer={[
            <Button loading={this.props.loading} key={'sellerAddModalBtn_1'} onClick={::this.saveAddDetail} type="primary">保存</Button>,
            <Button loading={this.props.loading} key={'sellerAddModalBtn_2'} onClick={::this.closeAddDetail}>关闭</Button>
          ]}
        >
         <Spin spinning={this.props.loading}>
           <Row>
             <FormItem label="项目" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
               <Input value={allTeam.length > 0 ? allTeam[0].name : ''} disabled />
             </FormItem>
           </Row>
           <div style={{ height: 300, overflow: 'auto', background: '#f6f6f6' }}>
             <Tree
               checkable
               checkStrictly
               multiple
               checkedKeys={this.state.nodeSeletedKeys}
               selectedKeys={this.state.nodeSeletedKeys}
               onSelect={::this.onNodeSelect}
               onCheck={::this.onNodeSelect}
             >
               {loop(screenTree)}
            </Tree>
          </div>
         </Spin>
        </Modal>
    </Modal>
   )
  }
}



function mapStateToProps(state, ownProps) {
  // console.log('getStaUserTreeByOrgIdResult--', state.getIn(['saleMgr', 'orderInfo', 'getStaUserTreeByOrgIdResult']));
  return {
    loading: state.getIn(['saleMgr', 'orderInfo', 'loading']),
    sellerVisible: state.getIn(['saleMgr', 'orderInfo', 'sellerVisible']),
    getStaUserTreeByOrgIdResult: state.getIn(['saleMgr', 'orderInfo', 'getStaUserTreeByOrgIdResult']),
    queryProjTeamResult: state.getIn(['saleMgr', 'orderInfo', 'queryProjTeamResult']), //搜索项目团队
    queryProjTeamMembersResult: state.getIn(['saleMgr', 'orderInfo', 'queryProjTeamMembersResult']) //获取项目团队成员
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(action, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Salesman)
