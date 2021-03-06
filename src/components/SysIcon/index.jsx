import React from 'react'
import classNames from 'classnames';
import omit from 'omit.js';

export default (props) => {
  const { type, className = '', spin } = props;
  const classString = classNames({
    aiiconfont: true,
    'anticon-spin': !!spin || type === 'loading',
    [`aiicon-${type}`]: true
  }, className);
  return <i {...omit(props, ['type', 'spin'])} className={classString} />;
}
