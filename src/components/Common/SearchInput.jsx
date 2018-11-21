import React from 'react'
import { Input, Button, Select } from 'antd';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty'
const InputGroup = Input.Group;
const Option = Select.Option;

class SearchInput extends React.Component {

  static defaultProps() {
    return {
      placeholder: '',
      options: [],
      value: ''
    };
  }

  constructor() {
    super();
    this.state = {
      value: '',
      options: [],
      focus: false
    }
    this.clickFlag = false
  }

  componentWillMount() {
    this.setState({
      value: this.props.value
    });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  setValue(value) {
    this.setState({ value });
  }

  handleInputChange(e) {
    this.setState({
      value: e.target.value
    });
  }

  handleChange(value) {
    let options;
    if (!value || isEmpty(this.props.options)) {
      options = [];
      this.setState({ options, value });
    } else if (!this.props.isSelect && !this.clickFlag) {
      options = this.props.options.filter((item) => {
        return item.value.includes(value);
      }).map((item) => {
        return <Option key={item.key}>{item.value}</Option>;
      });
      this.setState({ options, value });
    } else if (this.props.isSelect && !this.clickFlag) { //新增工作台下拉搜索功能
      options = this.props.options.map((item) => {
        const itemValue = `${item.value}-${value}`;
        return <Option key={item.key}>{itemValue}</Option>;
      })
      this.setState({ options, value });
    }
    this.clickFlag = false;
    !!this.props.onChange && this.props.onChange(value);
  }
  handleFocusBlur(e) {
    /*this.setState({
      focus: e.target === document.activeElement
    });*/
  }

  handleSearch() {
    if (this.props.onSearch) {
      this.props.onSearch(this.state.value, this);
    }
  }
  //下拉选择操作
  handleSelect(value, option) {
    const options = option.props.children;
    const textValue = this.props.isSelect ? options.substring(options.indexOf('-') + 1) : options;
    this.clickFlag = true;
    this.setState({ value: textValue });
    this.props.onSelect(value, textValue);
  }

  render() {
    const { style, size = 'large', placeholder, iDisabled, disabled } = this.props;
    const rootCls = classNames({
      'ant-search-input-wrapper': true,
      'search-input-default': true,
      [this.props.className]: true
    })
    const currentValue = String(this.state.value) || '';
    const btnCls = classNames({
      'ant-search-btn': true,
      'ant-search-btn-noempty': !!currentValue.trim(),
      'ant-search-btn-iDisabled': !this.props.disabled && !!this.props.iDisabled //输入框不可编辑，按钮可用样式
    });
    const searchCls = classNames({
      'ant-search-input': true,
      'ant-search-input-focus': this.state.focus,
      'ant-search-input-white': !this.props.disabled && !!this.props.iDisabled //覆盖iDisabled时输入框样式
    });
    return (
      <div className={rootCls} style={style}>
        <InputGroup className={searchCls}>
          <Select
            combobox
            filterOption={false}
            optionLabelProp="children"
            placeholder={placeholder}
            size={size}
            onSelect={::this.handleSelect}
            onChange={::this.handleChange}
            onFocus={::this.handleFocusBlur}
            onBlur={::this.handleFocusBlur}
            onPressEnter={::this.handleFocusBlur}
            disabled={disabled || iDisabled}
            defaultValue={this.props.defaultValue}
            value={this.state.value}
          >
            {this.state.options}
          </Select>
          <div className="ant-input-group-wrap">
            <Button icon="search"
              className={btnCls}
              size={size}
              onClick={::this.handleSearch}
              disabled={disabled}
            />
          </div>
        </InputGroup>
      </div>
    );
  }
}

export default SearchInput
