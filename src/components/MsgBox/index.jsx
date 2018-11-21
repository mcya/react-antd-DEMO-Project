import React from 'react'
import ReactDOM from 'react-dom';
import { Modal, Button, Icon } from 'antd'
import styles from './index.less'
import classNames from 'classnames'

class ActionButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.timeoutId = null;
  }
  componentDidMount() {
    if (this.props.autoFocus) {
      const $this = ReactDOM.findDOMNode(this);
      this.timeoutId = setTimeout(() => $this.focus());
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }
  onClick = () => {
    const { actionFn, closeModal } = this.props;
    if (actionFn) {
      let ret;
      if (actionFn.length) {
        ret = actionFn(closeModal);
      } else {
        ret = actionFn();
        if (!ret) {
          closeModal();
        }
      }
      if (ret && ret.then) {
        this.setState({ loading: true });
        ret.then((...args) => {
          // It's unnecessary to set loading=false, for the Modal will be unmounted after close.
          // this.setState({ loading: false });
          closeModal(...args);
        });
      }
    } else {
      closeModal();
    }
  }

  render() {
    const { type, children } = this.props;
    const loading = this.state.loading;
    return (
      <Button type={type} size="large" onClick={this.onClick} loading={loading}>
        {children}
      </Button>
    );
  }
}

function confirm(config) {
  const props = Object.assign({ iconType: 'question-circle' }, config);
  const div = document.createElement('div');
  document.body.appendChild(div);
  function close() {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult) {
      div.parentNode.removeChild(div);
    }
  }
  if (!('okCancel' in props)) {
    props.okCancel = true;
  }
  const { width = 416, style = {}, title = '提示' } = props;
  const typeClass = `MsgBox-${props.type}`;
  props.okText = props.okText || '确定';
  props.cancelText = props.cancelText || '取消';
  const wrapClassNames = classNames({
    [styles.MsgBox]: true,
    [props.className]: !!props.className,
    [styles[typeClass]]: !!props.type
  });
  let footer = [
    <ActionButton key="okBtn" type="primary" actionFn={props.onOk} closeModal={close} autoFocus>
      {props.okText}
    </ActionButton>,
    <ActionButton key="cancelBtn" type="ghost" actionFn={props.onCancel} closeModal={close}>
      {props.cancelText}
    </ActionButton>
  ]
  if (!props.okCancel) {
    footer = (
      <ActionButton key="okBtn" type="primary" actionFn={props.onOk} closeModal={close} autoFocus>
        {props.okText}
      </ActionButton>
    )
  }
  const iconElement = !!props.type ? <Icon type={props.iconType} /> : false;
  ReactDOM.render(
    <Modal
      wrapClassName={wrapClassNames}
      visible
      isHideScrollbar={props.isHideScrollbar}
      title={title}
      width={width}
      style={style}
      onOk={props.onOk}
      maskClosable={props.maskClosable}
      onCancel={() => {close(); props.onCancel && props.onCancel();}}
      footer={footer}
    >
    { iconElement }{ props.content }
  </Modal>
  , div);

  return {
    destroy: close
  };
}

export default class MsgBox extends React.Component {
  static info(config = { title: '', content: '' }) {
    config = Object.assign(config, { type: 'info', iconType: 'info-circle', okCancel: false });
    return confirm(config);
  }

  static success(config = { title: '', content: '' }) {
    config = Object.assign(config, { type: 'success', iconType: 'check-circle', okCancel: false });
    return confirm(config);
  }

  static error(config = { title: '', content: '' }) {
    config = Object.assign(config, { type: 'error', iconType: 'cross-circle', okCancel: false });
    return confirm(config);
  }

  static warning(config = { title: '', content: '' }) {
    config = Object.assign(config, { type: 'warning', iconType: 'exclamation-circle', okCancel: false });
    return confirm(config);
  }

  static confirm(config = { title: '', content: '' }) {
    config = Object.assign(config, { type: 'confirm' });
    return confirm(config);
  }

  static show(config = { title: '', content: '' }) {
    config = Object.assign(config);
    return confirm(config);
  }

  static showNoIcon(config = { title: '', content: '' }) {
    config = Object.assign(config, { type: '', okCancel: false });
    return confirm(config);
  }

  static defaultProps={
    visible: false
  };

  constructor() {
    super();
    this.state = {
      visible: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible) {
      this.setState({
        visible: nextProps.visible
      })
    }
  }

  render() {
    const { width = 416, className, hideOkBtn } = this.props;
    const wrapClassNames = classNames({
      [styles.MsgBox]: true,
      [className]: !!className
    })
    let footer = [
      <Button key="submit" type="primary" size="large" loading={this.props.loading} onClick={this.props.onOk}>确定</Button>,
      <Button key="back" type="ghost" size="large" onClick={this.props.onCancel}>取消</Button>
    ];
    if (hideOkBtn) {
      footer = [
        <Button key="back" type="ghost" size="large" onClick={this.props.onCancel}>关闭</Button>
      ];
    }
    return (
      <Modal
        wrapClassName={wrapClassNames}
        maskClosable={false}
        {...this.props}
        width={width}
        footer={footer}
      >
      {this.props.children}
    </Modal>
    );
  }
}
