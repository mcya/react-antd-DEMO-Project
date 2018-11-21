import React from 'react'
import { Button } from 'antd'
import SysIcon from 'SysIcon'

export default {
  Search: (props) => (
    <Button type="primary" {...props} >
      <SysIcon type="sousuo" />
      查找
    </Button>
  ),
  Add: (props) => (
    <Button type="ghost" {...props} >
      <SysIcon type="xinzeng" />
      新增
    </Button>
  ),
  Save: (props) => (
    <Button type="ghost" {...props} >
      <SysIcon type="baocun" />
      保存
    </Button>
  ),
  Print: (props) => (
    <Button type="ghost" {...props} >
      <SysIcon type="dayin" />
      打印
    </Button>
  ),
  Audit: (props) => (
    <Button type="ghost" {...props} >
      <SysIcon type="daishenhe" />
      审核
    </Button>
  ),
  Approve: (props) => (
    <Button type="ghost" {...props} >
      <SysIcon type="shenpi" />
      审批
    </Button>
  )
}
