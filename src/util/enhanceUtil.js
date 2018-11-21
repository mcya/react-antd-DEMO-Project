import React from 'react'
import { Form } from 'antd'

// export const createForm = (statelessFunc) => {
//   return Form.create()(React.createClass({
//     render() {
//       return statelessFunc(this.props)
//     }
//   }));
// }
// 弃用react.createClass
export const createForm = (statelessFunc) => {
  class NewForm extends React.Component {
    render() {
      return statelessFunc(this.props);
    }
  }
  return Form.create()(NewForm);
};
