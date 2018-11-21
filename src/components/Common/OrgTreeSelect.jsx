import React from 'react'
import { TreeSelect } from 'antd'
import MsgBox from 'MsgBox'
import * as action from 'AppAction'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const TreeNode = TreeSelect.TreeNode;
/**
 * 可传输的属性：
 * enabledOrgType：指定可以选择的公司类型，除了该类型的公司外，其它会被禁止选择
 */
class OrgTreeSelect extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      orgid: null
    }
  }
  componentDidMount() {
    if(this.props.CurrentOrg){
      //默认选择当前用户所选择的组织
      const {enabledOrgType} = this.props;
      this.enabledOrgType = (!enabledOrgType && enabledOrgType != 0)?null:enabledOrgType;
      console.log(this.enabledOrgType,this.enabledOrgType === null);
      let orgid = null;
      if(this.enabledOrgType === null || this.props.CurrentOrg.orgtype == enabledOrgType){
          orgid = this.props.CurrentOrg.orgid;
      }
      this.setState({ orgid })
      this.onChange(orgid);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.enabledOrgType !== this.props.enabledOrgType){
      //默认选择当前用户所选择的组织
      const {enabledOrgType} = nextProps;
      this.enabledOrgType = (!enabledOrgType && enabledOrgType != 0)?null:enabledOrgType;
      let orgid = null;
      if(this.enabledOrgType === null || nextProps.CurrentOrg.orgtype == enabledOrgType){
          orgid = nextProps.CurrentOrg.orgid;
      }
      this.onChange(orgid);
    }else if(this.props.CurrentOrg && this.props.CurrentOrg.orgid != nextProps.CurrentOrg.orgid){
      let orgid = null;
      if(this.enabledOrgType === null || nextProps.CurrentOrg.orgtype == enabledOrgType){
          orgid = nextProps.CurrentOrg.orgid;
      }
      this.onChange(orgid);
    }
  }

  onChange(value) {
    if (this.props.onChange) {
      this.props.onChange.call(this, value);
    }
  }

  onSelect(value, e) {
    this.setState({ orgid: value });
    this.props.orgTreeChange({ orgid: value, orgcode: e.props.orgcode });
  }

  render() {
    const loop = (data = []) => (data.length == 0 ? null:data.map((item={}) => {
      if(item.children){
        return(
          <TreeNode key={item.orgid} orgtype={item.orgtype} orgcode={item.orgcode} disabled={this.enabledOrgType !== null && this.enabledOrgType != item.orgtype} title={item.fullname} value={item.orgid}>
            {loop(item.children)}
          </TreeNode>
        );
      }else {
        return <TreeNode key={item.orgid} orgtype={item.orgtype} orgcode={item.orgcode} disabled={this.enabledOrgType !== null && this.enabledOrgType != item.orgtype} title={item.fullname} value={item.orgid}/>
      }
    }));
    return (
      <TreeSelect
        {...this.props}
        value={this.state.orgid}
        onSelect={::this.onSelect}
        treeDefaultExpandAll={this.enabledOrgType !== null}
      >
        {loop(this.props.userOrgs)}
      </TreeSelect>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(action, dispatch)
  }
}

function mapStateToProps(state, ownProps) {
  return {
    userOrgs: state.getIn(['APP', 'userOrgs']),
    CurrentOrg: state.getIn(['APP', 'CurrentOrg'])
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrgTreeSelect);
