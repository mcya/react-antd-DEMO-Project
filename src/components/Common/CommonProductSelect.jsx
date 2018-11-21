import React from 'react';
import { Row, Col, Select } from 'antd';
import { bindActionCreators } from 'redux'
import * as Api from '../../apps/api'
const Option = Select.Option;

//用法引入标签后 <CommonProductSelect groupId="fc_FeeItem" paramLevel="2" />
const DictCacher = {};
export default class CommonProductSelect extends React.Component {

  constructor() {
    super();
		this.state = {
      commonParamList: [],
      znjsf:{
      paramid:'',
      paramname:''
      }
    }
  }

	componentDidMount() {//页面加载后触发事件
    const params = {
      groupId: this.props.groupId,
      paramLevel: this.props.paramLevel
    }
    const newKye=params.groupId+'_'+params.paramLevel;
    const _this = this;
    if(DictCacher[newKye]){
    	console.log("缓存中取CommonParamSelect");
    	_this.setState({
    		commonParamList: DictCacher[newKye]
    	});
    }else{
    	console.log("数据库中取CommonParamSelect");
    	Api.getProductTypeByGroupId(params).then(({ jsonResult = { data: [] } }) => {
      console.log('===产品=',jsonResult);
    		DictCacher[newKye] = jsonResult.data;
	      _this.setState({
	        commonParamList: jsonResult.data
	      })

        if (this.props.all) {
           const list = this.state.commonParamList;
           console.log('-----list',list);
           list.push({
             key:'all',
             dictid: '全部',
             dictname: '全部'
           })
             this.setState({
                commonParamList: list
             })
        }
	    })
    }

	}

	render() {
		const loop = (data = []) => data.map((item) => {
      if(this.props.getvalue){
        return <Option key={item.dictid} value={item.dictid}>{item.dictname}</Option>;
      }else{
        return <Option key={item.dictid} value={item.dictname}>{item.dictname}</Option>;
      }

    });
		return (
      <Select {...this.props} size="large" >
        {loop(this.state.commonParamList)}
      </Select>
		)
	}
}
