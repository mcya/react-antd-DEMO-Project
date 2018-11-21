import React from 'react';
import { Tag, Icon } from 'antd';
import styles from './common.less';

// 说明：options为对象数组 [{ id1: value1 }, { id2: value2 }];
// props参数必须有：
// doSearch 打开弹框
// tagClose tag标签关闭回调
// options 数据
class TagsSearch extends React.Component {
  afterClose = (value, key) => {
    this.props.tagClose(value, key);
  }
  render() {
    const options = this.props.options;
    const createDom = () => {
      const tags = [];
      options.map((item) => {
        const key = Object.keys(item)[0];
        const value = item[key];
        tags.push(<Tag closable key={key} className={styles['s-option-child']} afterClose={this.afterClose.bind(this, value, key)}>{value}</Tag>);
        return tags;
      });
      return tags;
    }
    return (
      <div className={styles['s-option-box']}>
        <div className={styles['s-option-wrap']}>
          <div className={styles['s-option-content']}>
            { createDom() }
          </div>
        </div>
        <span className={styles['s-option-btn']} onClick={this.props.doSearch}><Icon type="search" /></span>
      </div>
    )
  }
}

export default TagsSearch;
