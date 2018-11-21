import React from 'react';
import { Select, Button, Form, Row, Col, Input } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as action from 'AppAction'
import * as Api from '../../../src/apps/api'
import _isEmpty from 'lodash/isEmpty'
import MsgBox from 'MsgBox';
const Option = Select.Option;
const FormItem = Form.Item;


class OrgStationSelect extends React.Component {
	static defaultProps = {
		onSelectFunction: () => {}
	}
	constructor() {
		super();
		this.state = {
			dictList: []
		}
	}

	componentDidMount() {
		const params = {
			userid: this.props.userid
		}
		this.getData(params);
	}

	onSelect(value, e) {
		// console.log('onSelect', value, e.props);
		if (!e.props.parentname) {
			MsgBox.warning({
				title: '提示',
				content: '该岗位无上级岗位，请选择其他岗位！',
				onOk: () => this.clearStation(),
				onCancel: () => this.clearStation()
			})
		}
		this.props.form.setFieldsValue({ stationname: e.props.children })
		// 批量划出-发起审批
		this.props.onSelectFunction(value)
  }

	getData(params) {
		Api.getOrgStationByUserId(params).then((data) => {
			this.setState({ dictList: data.jsonResult.data });
			if (data.jsonResult.data && data.jsonResult.data.length === 1) { //如果岗位名称只有一个，默认选中第一个
				if (!data.jsonResult.data[0].parentname) return; //无上级岗位时取消默认选中
				this.props.form.setFieldsValue({
					stationid: data.jsonResult.data[0].stationid,
					stationname: data.jsonResult.data[0].stationname
				})
				this.props.onSelectFunction(data.jsonResult.data[0].stationid)
			}
		});
	}

	clearStation() {
		this.props.form.setFieldsValue({ stationid: '', stationname: '' });
	}

	render() {
		// console.log('this.props.form', this.props.form);
		const { getFieldDecorator } = this.props.form;
		const loop = data => (data instanceof Array) && data.map((item, index) => {
      return <Option key={item.stationid} value={item.stationid} parentname={item.parentname}>{item.stationname}</Option>;
		});
    return (
      <Col span={8}>
				<FormItem label="申请人岗位" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} hasFeedback>
					{getFieldDecorator('stationid', { initialValue: '',
						rules: [{ required: true, message: '请选择申请人岗位!' }]
					})(
						<Select {...this.props} size="large" placeholder="- 请选择 -" onSelect={::this.onSelect}>
							{loop(this.state.dictList)}
						</Select>
					)}
				</FormItem>
				<FormItem style={{ display: 'none' }} label="申请人岗位name" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
					{getFieldDecorator('stationname', { initialValue: '' })(
						<Input />
					)}
				</FormItem>
      </Col>
    );
	}
}


 function mapStateToProps(state, ownProps) {
  return {
		userid: state.getIn(['APP', 'userInfo']).user.userid
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(action, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(OrgStationSelect)
