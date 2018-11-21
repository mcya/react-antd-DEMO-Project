import React from 'react';
import { Row, Col, Select } from 'antd';
import { bindActionCreators } from 'redux'
import * as Api from '../../apps/api'
const Option = Select.Option;

//用法引入标签后 <CommonParamSelect groupId="fc_FeeItem" paramLevel="2" />
const DictCacher = {};
export default class CommonParamSelect extends React.Component {

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
    	Api.getCommonParamByGroupId(params).then(({ jsonResult = { data: [] } }) => {
    		DictCacher[newKye] = jsonResult.data;
	      _this.setState({
	        commonParamList: jsonResult.data
	      })

        if (this.props.all) {
           const list = this.state.commonParamList;
           console.log('-----新增的是否有‘全部选项’');
           list.push({
             key:'all',
             paramid: 'all',
             paramname: '全部'
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
    if (this.props.all) {
        return <Option key={item.paramid} value={item.paramname}>{item.paramname}</Option>;
    }else{
        return <Option key={item.paramid} value={item.paramid}>{item.paramname}</Option>;
    }

    });
		return (
      <Select {...this.props} size="large" >
        {loop(this.state.commonParamList)}
      </Select>
		)
	}
}
