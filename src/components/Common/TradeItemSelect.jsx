import React from 'react';
import { Select, Button, message } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as action from 'AppAction'
import * as Api from '../../../src/apps/api'
import _isEmpty from 'lodash/isEmpty'
const Option = Select.Option;


class TradeItemSelect extends React.Component {
	constructor() {
		super();
		this.state = {
			dictList: []
		}
	}
	componentDidMount() {
		const params = {
			type: this.props.type //原因类型:ts_ReasonSort  申请类型:ts_applytype 特批底价折扣名称:s_djtpzk
		}
		this.getData(params);
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.type !== nextProps.type) {
			const params = {
        type: nextProps.type
      }
			this.getData(params);
		}
	}
	onSelect(value, ele) {
    // console.log(value, ele.props.children);
		this.props.saveCause({
			applytype: value,
			applyname: ele.props.children
		})
  }
	getData(params) {
		Api.getCauseType(params).then((data) => {
		  // console.log('params', params, data.jsonResult.data.length)
		  if (data.jsonResult.data.length === 0 && params.type === 'ts_tfbtkType') {
		    message.info('退房不退款原因类型参数配置为空，请先配置!')
      }
      this.setState({ dictList: data.jsonResult.data })
    });
	}
	render() {
		const loop = data => data.map((item, index) => {
			if (this.props.showName) {
				return <Option key={item.dictid} value={item.dictname}>{item.dictname}</Option>;
			}
			return <Option key={item.dictid} value={item.dictname}>{item.dictname}</Option>;
		});
    return (
      <div>
        <Select {...this.props} size="large" placeholder="- 请选择 -" onSelect={::this.onSelect}>
          {loop(this.state.dictList)}
        </Select>
      </div>
    );
	}
}


 function mapStateToProps(state, ownProps) {
  return {
		dictList: state.getIn(['APP', 'dictList']).data
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(action, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TradeItemSelect)
