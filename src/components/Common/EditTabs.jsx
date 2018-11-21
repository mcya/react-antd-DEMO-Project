import React from 'react';
import { Tabs } from 'antd';
import styles from './common.less'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as AppAction from 'AppAction'
const TabPane = Tabs.TabPane;

class EditTabs extends React.Component {
  static defaultProps = {
    defalutTabPanes: {}
  }
  constructor() {
    super();
    this.newTabIndex = 0;
    this.state = {
      activeKey: '',
      defaultKey: '',
      panes: []
    };
  }
  componentDidMount() {
    this.setState({
      panes: [this.props.defalutTabPanes],
      activeKey: this.props.defalutTabPanes.key,
      defaultKey: this.props.defalutTabPanes.key
    });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.addTabPanes !== nextProps.addTabPanes) {
      // console.log(33333, this.props.addTabPanes, nextProps.addTabPanes, this.state.panes);
      const panes = [this.props.defalutTabPanes];
      nextProps.addTabPanes.map(array => panes.push(array));
      const tabLength = nextProps.addTabPanes.length - 1;
      if (tabLength < 0) {
        this.setState({ panes, activeKey: panes[0].key });
        return;
      }
      const activeKey = nextProps.addTabPanes[tabLength].key;
      this.setState({ panes, activeKey });
    }
  }
  onChange(activeKey) {
    this.setState({ activeKey });
  }
  onEdit(targetKey, action) {
    this[action](targetKey);
  }
  add() {
    const panes = this.state.panes;
    const activeKey = `newTab${this.newTabIndex++}`;
    panes.push(this.props.addTabPanes);
    this.setState({ panes, activeKey });
  }
  remove(targetKey) {
    if (targetKey === this.state.defaultKey) {
      return;
    }
    let activeKey = this.state.activeKey;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key;
    }
    const panes1 = panes.filter(pane => pane.key !== this.state.defaultKey);
    this.props.editTabPanes(panes1)
    this.setState({ panes, activeKey });
  }
  render() {
    console.log('this.state.panes---', this.state.panes);
    return (
      <div className={styles.editTabs}>
        <Tabs
          hideAdd
          onChange={::this.onChange}
          activeKey={this.state.activeKey}
          type="editable-card"
          onEdit={::this.onEdit}
        >
          {this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)}
        </Tabs>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  console.log('addTabPanes---', state.getIn(['APP', 'addTabPanes']));
  return {
    addTabPanes: state.getIn(['APP', 'addTabPanes'])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(AppAction, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(EditTabs)
