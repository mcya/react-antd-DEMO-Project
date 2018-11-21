import React from 'react'
import getContainerRenderMixin from 'rc-util/lib/getContainerRenderMixin';
import getScrollBarSize from 'rc-util/lib/getScrollBarSize';
import style from './index.less'


class TabItem extends React.Component {
  static propTypes = {
    tab: React.PropTypes.string.isRequired,
    key: React.PropTypes.number.isRequired
  };

  static defaultProps = {
    tab: '',
    key: 0
  }

  render() {
    return false;
  }
}

class Content extends React.Component {

  constructor() {
    super();
    //初始化组件状态
    this.state = {
      index: 1, //初始化第一个tabHead的显示样式
      val: 1//初始化第一个tabContent显示,
    }
  }

  componentDidMount() {
    this.componentDidUpdate({});
    const defaultKey = this.props.defaultSelectedKey; //默认选中的key
    if (defaultKey) {
      this.setState({
        index: defaultKey,
        val: defaultKey
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps || this.state !== nextState;
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    console.log('prevProps.visible:', prevProps.visible)
    console.log('props.visible:', props.visible)
    if (props.visible) {
      // first show
      if (!prevProps.visible) {
        this.checkScrollbar();
        this.setScrollbar();
        document.body.style.overflow = 'hidden'
      }
    } else if (prevProps.visible) {
      if (!props.visible) {
        document.body.style.overflow = '';
        this.resetScrollbar();
      }
    }
  }

  setScrollbar() {
    if (this.bodyIsOverflowing && this.scrollbarWidth !== undefined) {
      document.body.style.paddingRight = `${this.scrollbarWidth}px`;
    }
  }

  checkScrollbar() {
    let fullWindowWidth = window.innerWidth;
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      const documentElementRect = document.documentElement.getBoundingClientRect();
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
    if (this.bodyIsOverflowing) {
      this.scrollbarWidth = getScrollBarSize();
    }
  }

  resetScrollbar() {
    document.body.style.paddingRight = '';
  }

  handleClick(event) {
    this.setState({
      val: event.target.getAttribute('value'),
      index: event.target.getAttribute('value')
    })
    if (this.props.onhandleTab) {
       this.props.onhandleTab(event.target.getAttribute('value'));
    }
  }

  handleClose() {
    this.props.onClose && this.props.onClose();
    document.body.style.overflow = 'auto'; //当点击关闭直接卸载该组件时，恢复body的滚动条
  }

  generateContent() {
    const { children = [] } = this.props;
    const $this = this;
    const tabTop = [];
    const tabContent = [];
    React.Children.forEach(children, (item, index) => {
      tabTop.push(
        <li key={index} value={item.key} className={item.props.iconClass} onClick={$this.handleClick.bind($this)} style={{background:item.key==$this.state.index?"#052e5c":"",borderLeft:item.key==$this.state.index?"5px solid #00baf3":""}}>
          {item.props.tab}
        </li>
      )
      tabContent.push(
        <div key={index} style={{ display: item.key == $this.state.val ? 'block' : 'none'}}>{item.props.children}</div>
      );
    })
    this.tabTop = tabTop;
    this.tabContent = tabContent;
  }

  render() {
    this.generateContent();
    return (
      <div className="ant-modal-wrap" style={{ display: this.props.visible ? 'block' : 'none' }}>
        <div className="ant-modal-content">
          <div className={style.Tabs}>
            <div>
              <div onClick={::this.handleClose}>返回</div>
              <ul>
                {this.tabTop}
              </ul>
            </div>
            <div>
              <div className={style.TabContent}>
                {this.tabContent}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

const DialogWrap = React.createClass({
  mixins: [
    getContainerRenderMixin({
      isVisible(instance) {
        return instance.props.visible;
      },
      autoDestroy: false,
      getComponent(instance, extra) {
        return (
          <Content
            {...instance.props}
          />
        );
      }
    })
  ],

  getDefaultProps() {
    return {
      visible: false
    };
  },

  shouldComponentUpdate({ visible }) {
    return !!(this.props.visible || visible);
  },

  componentWillUnmount() {
    //临时解决，使用浏览器前进后退时强制销毁
    this.removeContainer();
    /*if (this.props.visible) {
      this.renderComponent({
        afterClose: this.removeContainer,
        onClose() {
        },
        visible: false
      });
    } else {
      this.removeContainer();
    }*/
  },

  getElement(part) {
    return this._component.getElement(part);
  },

  render() {
    return null;
  }
});

DialogWrap.TabItem = TabItem;

export default DialogWrap;
