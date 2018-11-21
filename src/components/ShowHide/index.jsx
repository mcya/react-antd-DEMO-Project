import React, { Component } from 'react';
import style from './index.less';

class ShowHide extends Component {
    static defaultProps = {
      ShowHideBtn: () => {}
    }
    constructor(props) {
        super(props);
        //初始化组件状态
        this.state = {
            number: 0,
            dropdown: props.showName ? props.showName : '展开',
            isDropdown: false,
            className: props.showName ? 'drop71' : 'drop1'
        }
    }
    componentWillMount() {
      if (this.props.dropdown) { //传入dropdown属性时，默认收起
        this.setState({
          isDropdown: false,
          dropdown: this.props.showName ? this.props.showName : '展开',
          className: this.props.langChar ? 'drop71' : 'drop1'
        })
      } else {
        this.setState({
          isDropdown: true,
          dropdown: this.props.hideName ? this.props.hideName : '收起',
          className: this.props.langChar ? 'drop70' : 'drop'
        })
      }
    }
    toggleDown(event) {
        if (this.state.isDropdown) {
            this.setState({
              isDropdown: false,
              dropdown: this.props.showName ? this.props.showName : '展开',
              className: this.props.langChar ? 'drop71' : 'drop1'
            });
            this.props.ShowHideBtn()
        } else {
            this.setState({
              isDropdown: true,
              dropdown: this.props.hideName ? this.props.hideName : '收起',
              className: this.props.langChar ? 'drop70' : 'drop'
            })
            this.props.ShowHideBtn()
        }
    }
    render() {
        return (
            <div className={style.shBody}>
              <div className={style[this.state.className]} onClick={this.toggleDown.bind(this)}>
                  {this.state.dropdown}
              </div>
              <div className={style.dropCon} style={{ display: this.state.isDropdown ? 'block' : 'none' }}>
                {this.props.children}
              </div>
            </div>
        );
    }
}
export default ShowHide;
