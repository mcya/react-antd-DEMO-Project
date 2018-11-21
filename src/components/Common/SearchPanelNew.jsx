import React from 'react';
import { Row, Col, Tabs } from 'antd';
import ShowHide from '../ShowHide';
import styles from './common.less';

const TabPane = Tabs.TabPane;

export default (props) => {
  const [topArea, baseSearch = '', advanceSearch = ''] = props.children || [];
  return (
    <div className={styles.searchPanel}>
      <div classNames={styles['searchPanel-header']} >
        {topArea}
      </div>
      {/* <ShowHide> */}
        {baseSearch}
        {/* <ShowHide dropdown> */}
        {advanceSearch}
        {/* </ShowHide> */}
      {/* </ShowHide> */}
    </div>
  )
}
