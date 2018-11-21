import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as OrgAction from '../../apps/system/org/action';
import * as OrgApi from '../../apps/system/org/api';
import { Modal, Button, Form, Row, Col, Input, Tree, Table, Icon, Message } from 'antd';
import TitleWithTools from 'TitleWithTools';
import _isEmpty from 'lodash/isEmpty'

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;

const ChooseUserModal = React.createClass({
  getInitialState() {
    return {
      treeORGID: -1,  //获取组织架构树orgid，查询时作为条件之一
      selectedRowKeys: [],
      selectedData: [],  //储存备选用户表中选中的数据
      userData: [],
      loadingSearch: false
    };
  },
  componentDidMount() {
    if (_isEmpty(this.props.orgTree)) {
      this.props.InitORGTree();
    }
  },

  onSelects(info) {  //树点击事件
    const params = {
      orgid: info
    }
    this.setState({  //清空选中行
      selectedRowKeys: [],
      treeORGID: info[0]
    });

    const context = this;
    OrgApi.getUserByOrgId({ orgid: info[0] }).then(({ jsonResult }) => {
      const { success, data } = jsonResult;
      if (success && data) {
        context.setState({
          userData: data
        })
      }
    });
    // this.props.getUserByOrgId(params);
  },

  handleOk() {  //保存
    const { onOk } = this.props;
    if (onOk) {
      onOk(this.state.selectedData);
    }
  },
  handleCancel() {  //取消
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  },

  handleSearch(e) {
    e.preventDefault();
    this.setState({
      loadingSearch: true
    })
    const context = this;
    this.props.form.validateFields((err, values) => {
      const treeORGID = this.state.treeORGID;
      values.orgid = treeORGID;
      OrgApi.getUserByOrgId(values).then(({ jsonResult }) => {
        context.setState({
          loadingSearch: false,
          userData: jsonResult.data
        });
      }).catch((error) => {
        context.setState({
          loadingSearch: false
        })
      })
    });
  },

  render() {
    // 解析树数据开始
    const loop = (data = []) => (data.length === 0 ? null : data.map((item = {}) => {
      //console.log(item)
      if (item.children) {
        return (
          <TreeNode key={item.orgid} title={item.fullname} >
          {loop(item.children)}
          </TreeNode>
          );
      }
      return <TreeNode key={item.orgid} title={item.fullname} />;
    }));
      // 解析树数据结束
    const { getFieldDecorator } = this.props.form;
    const { selectedRowKeys } = this.state;
    /*table1开始*/
    const columns1 = [{
      title: '用户代码',
      dataIndex: 'usercode'
    }, {
      title: '用户名称',
      dataIndex: 'username'
    }, {
      title: '工号',
      dataIndex: 'jobnumber'
    }, {
      title: '所属组织',
      dataIndex: 'orglistname'
    }, {
      title: '状态',
      dataIndex: 'isdisabeld',
      render: (value) => {
        if (value === 0) {
          return '启用';
        }
          return '禁用';
      }
    }];
     const data1 = [];
     if (this.state.userData) {
       this.state.userData.forEach((val, key) => {
        data1.push({
          key,
          userid: val.userid,
          usercode: val.usercode,
          username: val.username,
          orglistname: val.orglistname,
          isdisabeld: val.isdisabeld
        })
      });
    }
     // 调用table1中的自带方法
     const $this = this;
     const rowSelection = {
       type: 'radio',
       selectedRowKeys,
       onChange: (selectedRowKeys, selectedRows) => {
         this.setState({
           selectedRowKeys,
           selectedData: selectedRows
         });
       }
     };
     const pagination = {//table分页函数
       //total: data1.length,
       showSizeChanger: true,
       onShowSizeChange(current, pageSize) {
         console.log('Current: ', current, '; PageSize: ', pageSize);
       },
       onChange(current) {
         console.log('Current: ', current);
       }
     };
     /*table1结束*/
    return (
        <Modal
          visible={this.props.visible}
          title="选择用户"
          width="1000"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" type="primary" size="large" loading={this.state.loadingSave} onClick={this.handleOk}>保存</Button>,
            <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取消</Button>
          ]}
        >
        {/*top部分开始*/}
        <div>
          <Form horizontal onSubmit={this.handleSearch}>
            <Row>
              <Col span={7}>
                <FormItem
                  label="用户代码:"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 14 }}
                >
                {getFieldDecorator('usercode')(
                    <Input size="large" placeholder="" />
                )}
                </FormItem>
              </Col>
              <Col span={7}>
                <FormItem
                  label="用户名称:"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 14 }}
                >
                {getFieldDecorator('username')(
                    <Input size="large" placeholder="" />
                )}
                </FormItem>
              </Col>
              <Col span={7}>
                <FormItem
                  label="所属组织:"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 14 }}
                >
                {getFieldDecorator('organisation')(
                    <Input size="large" placeholder="" />
                )}
                </FormItem>
              </Col>
              <Col span={2}>
                <Button type="primary" htmlType="submit" loading={this.state.loadingSearch}>查找</Button>
              </Col>
            </Row>
          </Form>
        </div>
        {/*top部分结束*/}
      <div>
      <Row>
        <Col span={7} style={{ border: '1px solid #ededed', height: 400, overflow: 'auto' }}>
          <Tree onSelect={this.onSelects}>
            {loop(this.props.orgTree)}
          </Tree>
        </Col>
        <Col span={17} style={{ paddingLeft: 10 }}>
          <TitleWithTools name="备选用户" />
            <Table size="middle" className="InterlacedBg" style={{ border: '1px solid #ededed' }} rowSelection={rowSelection} columns={columns1} dataSource={data1} pagination={pagination} />
        </Col>
      </Row>
      </div>
    </Modal>
    );
  }
});
function mapStateToProps(state, ownProps) {
  return {
    orgTree: state.getIn(['system', 'org', 'queryResult']).data.orgTree
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(OrgAction, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ChooseUserModal));
