import React from 'react'
import styles from './common.less'
export default (props) => {
  return (
    <span className='prefixColor'>
      <div className='prefix' />
      <label className={styles.mt10}>{props.name}</label>
    </span>
  )

}
