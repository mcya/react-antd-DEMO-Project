import React from 'react';
import { Select, Button, Cascader } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as action from 'AppAction'
import _isEmpty from 'lodash/isEmpty'
// import shallowCompare from 'react-addons-shallow-compare'

class ProjectCascader extends React.Component {
  constructor() {
   super();
   this.state = {
     options: []
   }
  }

	componentDidMount() {//页面加载后触发事件
    if (_isEmpty(this.props.ProTreSelect)) {
      this.props.getProTreSel();
    }
	}

  componentWillReceiveProps(nextProps) {
    if (this.props.ProTreSelect !== nextProps.ProTreSelect) {
      const loop = (data = []) => (data.length === 0 ? null : data.map((item = {}) => {
        if (item.children && item.children.length > 0) {
          return {
            label: item.projName,
            value: item.projid,
            children: loop(item.children)
          }
        }
          return {
            label: item.projName,
            value: item.projid
          }
      }));
      const options = loop(nextProps.ProTreSelect);
      this.setState({
        options
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.ProTreSelect !== nextProps.ProTreSelect || this.state.options !== nextState.options;
  }

	render() {
		return (
      <Cascader
        options={this.state.options}
        style={{ width: 270 }}
        placeholder="--请选择项目--"
        changeOnSelect
        { ...this.props }
      />
		)
	}
}

 function mapStateToProps(state, ownProps) {
  return {
    ProTreSelect: state.getIn(['APP', 'projectTree']).data.projTree
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(action, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectCascader)
