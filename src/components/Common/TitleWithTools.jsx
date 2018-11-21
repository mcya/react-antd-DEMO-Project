import React from 'react';
import SupLabel from '../Common/SupLabel';
import { Alert } from 'antd';

export default (props) => (
<div style={{ padding: '10px 0 10px 10px', backgroundColor: '#fff' }}>
  <div className="tableTop">
    <SupLabel name={props.name} />
    <div>
      {props.children}
      {/*<Alert style={{'display': (props.alertFalge&&props.alertFalge=='true')?'inline-block':'none'}} message={props.alertMessage} type="info" showIcon />*/}
    </div>
  </div>
    </div>
)
