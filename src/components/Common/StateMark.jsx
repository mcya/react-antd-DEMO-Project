import React from 'react';
export default (props) => {
  const bgColor = props.bgColor ? props.bgColor : '#fff';
  const colors = props.color ? props.color : '#000';
  const sborder = props.bgColor ? 'none' : '1px solid rgba(140, 133, 133, 0.28)'
  return (
    <span size="small"
      style={{ background: bgColor, color: colors, padding: '2px 8px', borderRadius: 2, border: sborder
        //boxShadow: '2px 2px 12px #cfcfcf'
      }}
    >
       {props.children}
    </span>
  )
}
