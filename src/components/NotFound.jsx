import React from 'react';
import { Button } from 'antd';
import styles from './NotFound.less';

const NotFound = () => {
  return (
    <div className={styles.normal}>
      <div className={styles.container}>
        <h1 className={styles.title}>暂无页面信息</h1>
        <p className={styles.desc}>开发施工中...</p>
        <a href="/"><Button type="primary" style={{ marginTop: 5 }}>返回首页</Button></a>
      </div>
    </div>
  );
};

export default NotFound;
