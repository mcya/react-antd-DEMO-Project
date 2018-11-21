import React from 'react'
import styles from './common.less'
export default (props) => (
    <div className={styles.dataHeader} style={props.style}>
      <label>{props.name}</label>
    </div>
)
