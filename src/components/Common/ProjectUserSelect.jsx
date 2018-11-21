import React from 'react';
import { Select } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AppAction from 'AppAction'
const Option = Select.Option;

/*
 * 必须参数，projid，即需要查询的项目
 * 可选参数，defaultUserid，如果传输了该参数，那么会默认选择该用户，否则默认选择当前用户
 */
class ProjectUserSelect extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      projusers:[]
    };
  }

  componentDidMount(){
    this.getProjectUsers(this.props.projid);
  }

  componentWillReceiveProps(nextProps){
    if(this.props.projid != nextProps.projid){
      this.getProjectUsers(nextProps.projid);
    }else if(this.props.projectUsers != nextProps.projectUsers){//用户发生了变化
      if(nextProps.projectUsers.projid == nextProps.projid){//且查询的projid是当前的projid
        this.setState({projusers:nextProps.projectUsers.data});
        this.props.onChange.call(this,nextProps.defaultUserid || nextProps.userInfo.user.userid);
      }
    }else if(!nextProps.value){//当发生了清空表单的操作时，重新将用户选择为当前用户
      this.props.onChange.call(this,nextProps.defaultUserid || nextProps.userInfo.user.userid);
    }

    if (this.props.clickTime!==nextProps.clickTime) {
      this.getProjectUsers(nextProps.projid);
    }

  }
  getProjectUsers(projid){
    if(!projid){
      console.log('使用ProjectUserSelect必须传输projid属性');
      return;
    }
    if(this.props.projectUsers.projid !== projid){
      this.props.getProjectUsers({projid});
    }else {
      this.setState({projusers:this.props.projectUsers.data});
      this.props.onChange.call(this,this.props.defaultUserid || this.props.userInfo.user.userid);
    }
  }
  render(){
    const loop = (data = [])=>data.map((item)=>{
      return <Option key={item.userid}>{item.username}</Option>
    });
    return (
      <Select
         id = {this.props.id}
         value = {this.props.value}
         onChange = {this.props.onChange}
         showSearch={true}
         placeholder='请输入用户名称！'
         notFoundContent='没有可供选择的用户！'
         optionFilterProp='children'
      >
      {loop(this.state.projusers)}
      </Select>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    projectUsers:state.getIn(['APP','projectUsers']),
    userInfo: state.getIn(['APP', 'userInfo']),
  };
}


function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(AppAction, dispatch)
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(ProjectUserSelect)
