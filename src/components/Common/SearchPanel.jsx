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
      <ShowHide>
        <Tabs defaultActiveKey="1">
          <TabPane tab="普通查询" key="1">
            {baseSearch}
          </TabPane>
          <TabPane tab="高级查询" key="2">
            {advanceSearch}
          </TabPane>
        </Tabs>
      </ShowHide>
    </div>
  )
}
