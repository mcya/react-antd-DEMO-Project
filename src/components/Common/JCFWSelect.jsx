import React from 'react';
import { Row, Col, Select, TreeSelect } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Api from '../../apps/api'
import * as action from 'AppAction'
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
/**
  *getText，获取option字符，为一个function
  *projid，指定查询哪个项目的服务进程，如果没有传输，那么默认去拿当前项目的projid
  */
const DictCacher = {};
class JCFWSelect extends React.Component {
  constructor() {
    super();
    this.state = {
      dictItemList: [],
      defaultValue: '-1',
      projid: '',
      serviceitem: '',
      textValues: '',
    }
  }
	componentDidMount() {//页面加载后触发事件
    if (this.props.projid) {
      this.setState({
        projid: this.props.projid
      })
    }
      const params = {
				serviceitem: this.props.serviceitem,
        projid: this.props.ProTreSelected,
        procetype:this.props.procetype,
			}
      this.getData(params);
	}
  componentWillReceiveProps(nextProps) {
    const params = {
      serviceitem: nextProps.serviceitem,
      projid: nextProps.ProTreSelected,
      procetype:nextProps.procetype,
    }
    if (this.props.ProTreSelected !== nextProps.ProTreSelected && !this.state.projid) {
      this.getData(params);
    }else if (this.props.serviceitem !== nextProps.serviceitem) {
      this.setState({
        defaultValue: '-1'
      })
      this.getData(params);
    }else if (this.props.projid !== nextProps.projid) {
      this.setState({
        projid: nextProps.projid
      })
      this.getData(params);
    }else if(nextProps.visible && !this.props.visible){
      this.getData(params);
    }else if (this.props.value !== nextProps.value) {
      this.setState({
        defaultValue: nextProps.value,
        textValues: nextProps.value
      })
    }
  }
  getData(params) {
    Api.getSaleServProcs(params).then(({ jsonResult = { data: [] } }) => {
      this.setState({
        dictItemList: jsonResult.data
      })
      this.dsValue(jsonResult.data);
    })
  }
  dsValue(data) {
    const serviceId = this.props.defaultSelectById;
    if(serviceId){
      if (data && data.length > 0) {
          data.map((item, index) => {
              if (serviceId === item.servprocid) {
                this.setState({
                  defaultValue: item.servprocid,
                  textValues: item.servprocid
                })
              }
          })
      } else {
        this.setState({
          defaultValue: '-1'
        })
      }
    }else{
      const s = this.props.defaultSelect;
          if (data && data.length > 0) {
          data.map((item, index) => {
              if (s === index) {
                this.setState({
                  defaultValue: item.servprocid,
                  textValues: item.servprocid
                })
              }
          })
      } else {
        this.setState({
          defaultValue: '-1'
        })
      }
    }
  }
  // setvalue = (value, option) => {
  //   this.setState({
  //     defaultValue: value,
  //     text: option.props.children
  //   })
  //   if (this.props.getText) {
  //      this.props.getText(value, option.props.children);
  //   }
  // }
  onSelectTree(value, node, extra) {
    console.log("Select Value:", value, node.props.name)
    this.setState({
      defaultValue: value,
      text: node.props.name
    })
    if (this.props.getText) {
       this.props.getText(value, node.props.name);
    }
  }
  componentDidUpdate() {
    if (this.props.getvalue) {
      this.props.getvalue(this.state.defaultValue);
    }
  }
	render() {
    // const loop = data => data.map((item, index) => {
    //   return <Option key={item.servprocid} item={item} value={item.servprocid} title={item.service}>{item.service}</Option>;
    //   });
    const looTreeSelect = (data=[]) => data.map((item) => {
      return <TreeNode key={item.servprocid} value={item.servprocid} name={item.service} title={item.service} />
    })
		return (
      // <Select {...this.props} size="large" value={this.state.defaultValue} onSelect={::this.setvalue} >
      //   <Option key="-1" value="-1" >{'- 请选择 -'}</Option>
      //   {loop(this.state.dictItemList)}
      // </Select>
      <TreeSelect
        showSearch
        dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
        placeholder='- 请选择 -'
        notFoundContent="未找到"
        treeNodeFilterProp="name"
        searchPlaceholder="可以在这里输入 关键字 进行搜索"
        allowClear
        onSelect={::this.onSelectTree}
        { ...this.props }
      >
        <TreeNode key='-1' value='-1' name='- 请选择 -' title='- 请选择 -' />
        {looTreeSelect(this.state.dictItemList)}
      </TreeSelect>
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
export default connect(mapStateToProps, mapDispatchToProps)(JCFWSelect)
