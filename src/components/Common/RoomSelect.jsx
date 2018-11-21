import React from 'react';
import { Popconfirm, Select, Modal, Form, Row, Col, Input, Button, Icon, Table, message } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Api from '../../apps/api'
import * as action from 'AppAction'
import TitleWithTools from 'TitleWithTools';
import DictUtil from '../../apps/saleMgr/dict-util.js'
const Option = Select.Option;
const FormItem = Form.Item;


class RoomSelect extends React.Component {

  constructor() {
    super();
    this.state = {
      keyword: '',
      page: {
        current: 1,
        pageSize: 10
      },
      dataList: [],
      status: '2'
    }
  }

	componentDidMount() {//页面加载后触发事件

	}
  componentWillReceiveProps(nextProps) {

  }
  componentDidUpdate() {

  }
  onCancel() {
    this.setState({
      dataList: [],
      total: 0,
      keyword: '',
      bproducttypename: '',
      status: '2'
    })
    this.props.form.resetFields();
    this.props.closeModal();
  }
  onkeyword(e) {
    this.setState({
      keyword: e.target.value,
      page: {
        current: 1,
        pageSize: 10
      }
    })
  }
  buttonClick(record, index) {
    if (this.props.relaHashOrd && this.props.relaHashOrd[record.roomid]) {
      message.info('该房间已选择!');
    } else if (this.props.checkWorkflow && record.title) {
      message.info(`存在在途审批流程，${record.title}`);
    } else if (record.type) {
      if (record.status == 2) {
        this.props.onOk(record);
        this.onCancel()
      } else {
        message.info('请选择待售的房间!');
      }
    } else {
      message.info('房间视图类型不能为空!');
    }
  }
	render() {
    const { getFieldDecorator } = this.props.form;
    const columns = [
      { title: '序号', dataIndex: 'currentrow' },
      { title: '房间', dataIndex: 'roomname', sorter: true },
      { title: '房间类型', dataIndex: 'bproducttypename' },
      { title: '房间状态', dataIndex: 'status', render: (text, record, index) => {
        return DictUtil.getRoomStatus(text);
      }, sorter: true },
      { title: '工作流控制', dataIndex: 'title', render: (text, record, index) => {
        return <Input value={record.title} />;
      } },
      { title: '操作', dataIndex: 'caozuo', render: (text, record, index) => {
        return (
            <Popconfirm title="确定要选择吗?" onConfirm={this.buttonClick.bind(this, record, index)}>
              <a>选择</a>
            </Popconfirm>
        )
      } }
    ];
    const handleTableChange = (pagination, filters, sorter) => {
      let { page } = pagination;
      page.sorterfield = sorter.field;
      page.sorterorder = sorter.order;
      pagination.query();
    }
    const query = () => {
      const params = {
        keyword: this.state.keyword,
        projid: this.props.ProTreSelected,
        status: this.state.status,
        bproducttypename: this.state.bproducttypename,
        currentPage: this.state.page.current,
        pageSize: this.state.page.pageSize,
        sorterfield: this.state.page.sorterfield,
        sorterorder: this.state.page.sorterorder
      }
      Api.getManyConditionsSearchRoom(params).then(({ jsonResult = { data: {} } }) => {
        this.setState({
          dataList: jsonResult.data.data,
          total: jsonResult.data.totalRecord
        })
      })
    }
    const onStatusSelect = (value) => {
      this.state.status = value;
      this.state.page.current = 1;
      query();
    }
    const onfjType = (value) => {
      this.state.bproducttypename = value;
      this.state.page.current = 1;
      query();
    }
    //调用table中的自带方法
    const pagination = {//table分页函数
      total: this.state.total,
      showSizeChanger: true,
      onShowSizeChange(current, pageSize) {
        this.page.current = current;
        this.page.pageSize = pageSize;
        this.query();
      },
      onChange(current) {
        this.page.current = current;
        this.query();
      },
      page: this.state.page,
      query
    }
		return (
      <Modal
        title="房间列表"
        maskClosable={false}
        visible={this.props.visible}
        onCancel={::this.onCancel}
        width={850}
        footer={[
          <Button key="BatchModalkey2" onClick={::this.onCancel}>取消</Button>
        ]}
      >
        <Row gutter={16}>
          <Col span={12}>
            <FormItem label="房间状态" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
              {getFieldDecorator('status', { initialValue: '2'
              })(
              <Select id="select1" size="large" onChange={onStatusSelect} >
                <Option value="-1">所有状态</Option>
                <Option value="1">销控</Option>
                <Option value="2">待售</Option>
                <Option value="3">预留</Option>
                <Option value="4">认购</Option>
                <Option value="5">签约</Option>
                <Option value="6">控制</Option>
              </Select>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="房间类型" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
              {getFieldDecorator('bproducttypename', { initialValue: '-1'
              })(
              <Select id="select2" size="large" onChange={onfjType} >
                <Option value="-1">所有状态</Option>
                <Option value="住宅">住宅</Option>
                <Option value="公寓">公寓</Option>
                <Option value="车位">车位</Option>
                <Option value="商铺">商铺</Option>
                <Option value="别墅">别墅</Option>
              </Select>
              )}
            </FormItem>
          </Col>
          </Row>
          <Row gutter={16}>
          <Col span={12}>
            <FormItem label="关键字" labelCol={{ span: 8 }} wrapperCol={{ span: 12 }}>
              {getFieldDecorator('keyword')(
                <Input placeholder="请输入房间名或房间类型名" onChange={::this.onkeyword} />
              )}

            </FormItem>
          </Col>
          <Col span={2}>&nbsp;</Col>
          <Col span={5}>
            <Button type="primary" onClick={query} loading={this.props.loading}>查找</Button>
          </Col>
          </Row>
        <TitleWithTools name="房间列表" />
        <Table
          size="middle"
          className={"InterlacedBg"}
          columns={columns}
          pagination={pagination}
          dataSource={this.state.dataList}
          onChange={handleTableChange}
        />
      </Modal>
		)
	}
}
function mapStateToProps(state, ownProps) {
 return {
   ProTreSelected: state.getIn(['APP', 'ProTreSelected'])
 };
}

function mapDispatchToProps(dispatch) {
 return {
   ...bindActionCreators(action, dispatch)
 }
}
RoomSelect = Form.create({})(RoomSelect)
export default connect(mapStateToProps, mapDispatchToProps)(RoomSelect)
