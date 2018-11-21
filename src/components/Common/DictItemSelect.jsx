import React from 'react';
import { Row, Col, Select } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Api from '../../apps/api'
const Option = Select.Option;

//<DictItemSelect groupId="fc_assist2object" />
const DictCacher = {};
export default class DictItemSelect extends React.Component {

  constructor() {
    super();
    this.state = {
      dictItemList: []
    }
  }

	componentDidMount() {//页面加载后触发事件
		// if (this.props.dictItemList.length === 0) {
			const params = {
				groupId: this.props.groupId,
        projid: this.props.projid
			}
      const _this = this;
			if (DictCacher[params.groupId]) {
        _this.setState({
          dictItemList: DictCacher[params.groupId]
        })
      } else {
        Api.getDictItemByGroupId(params).then(({ jsonResult = { data: [] } }) => {
          DictCacher[params.groupId] = jsonResult.data;
          _this.setState({
            dictItemList: jsonResult.data
          })
        })
      }
		// }
	}

	render() {
		const loop = data => data.map((item) => {
      return <Option key={item.dictid} value={item.dictid}>{item.dictname}</Option>;
		});
		return (
      <Select {...this.props} size="large" allowClear>
        {loop(this.state.dictItemList)}
      </Select>
		)
	}
}
