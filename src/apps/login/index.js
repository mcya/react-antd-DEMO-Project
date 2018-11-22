import React from 'react';
import { Form, Input, Button, Icon, Message } from 'antd';
import style from './login.less';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getHzHost } from 'util';
// import * as action from './action'
//import * as Api from './api'
import * as AppAction from 'AppAction'

const FormItem = Form.Item;

class Login extends React.Component {

  constructor() {
    super();
    this.state = {
      iframeUrl: "",
      iframeDisplay: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.result.loginSuccess && nextProps.result.loginSuccess) {
      this.props.changeLocation('/');
    }
    // if (this.props.getHostsResult!==nextProps.getHostsResult && nextProps.getHostsResult.success) {
    //   console.log("nextProps.getHostsResult.data 0/1", nextProps.getHostsResult.data);
    //   // var _this = this, hostVal = nextProps.location.query.hostVal, salePath = nextProps.getHostsResult.data[1];
    //   var _this = this, hostVal = nextProps.getHostsResult.data[0], salePath = nextProps.getHostsResult.data[1];
    //   setTimeout(function () {
    //     const urlVal = hostVal + "/logout.jsp?salePath="+salePath+"";
    //     console.log("urlVal, hostVal", urlVal, hostVal);
    //     _this.refs.iframeRef.src = urlVal;
    //   }, 1000);
    // }
  }

  componentDidMount() {
    this.props.getHosts();
    console.log("this.props.location.query", this.props.location.query);
    // if (this.props.location.query && this.props.location.query.loginOut && this.props.location.query.loginOut=="yes") {
    //   this.setState({
    //     iframeDisplay: true
    //   })
    //   // var settime1 = setTimeout(function () {
    //   //   var hostVal = getHzHost()
    //   //   const urlVal = hostVal + "/logout.jsp?salePath="+hostVal+"";
    //   //   this.refs.iframeRef.src = urlVal;
    //   // }, 1000);
    // }
  }

  doLogin(e) {
    e.preventDefault();
    const params = this.props.form.getFieldsValue();
    this.props.doLogin(params);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const sameProps = {
      onPressEnter: this.doLogin
    }
      return (
         <div className={style.loginMain}>
         <div style={{ display: this.state.iframeDisplay?"block":"none", maxWidth: "2px", maxHeight:"2px",position: "absolute", top: 9999999, left: 9999999}}>
           <iframe ref="iframeRef" width="1px" height="1px" style={{ display: this.state.iframeDisplay?"block":"none", maxWidth: "1px", maxHeight:"1px",position: "absolute", top: 9999999, left: 9999999 }} src={this.state.iframeUrl}></iframe>
         </div>
             <div className={style.loginTop}>
              <i></i>
             </div>
             <div className={style.loginMiddel}>
               <div className={style.avator}></div>
               <Form onSubmit={::this.doLogin} inline>
                 <FormItem>
                 {
                   getFieldDecorator('username')(
                     <Input className={style.username} size="large" placeholder="请输入用户名" />
                   )
                 }
                 </FormItem>
                 <FormItem>
                 {
                   getFieldDecorator('password')(
                     <Input className={style.password} size="large" type="password" placeholder="请输入密码" />
                   )
                 }
                 </FormItem>
                 <Button
                   htmlType="submit"
                   icon="logout"
                   type="primary"
                   size="large"
                   loading={this.props.result.isLogging}
                 >
                   登录
                 </Button>
               </Form>
             </div>
             {/* <div className={style.loginBottom}>
               <span className={style.company}>
                  系统维护：亚信（广州）软件服务有限公司
               </span>
             </div> */}
         </div>
      )
    }
}

function mapStateToProps(state, ownProps) {
  return {
    //isLogging: state.getIn(['login', 'isLogging']),
    //message: state.getIn(['login', 'message']),
    //loginSuccess: state.getIn(['login', 'loginSuccess']),
    //resetLogin: state.getIn(['login', 'resetLogin']),
    //orgTree: state.getIn(['login', 'orgTree'])
    result: state.getIn(['APP', 'login']),
    getHostsResult: state.getIn(['APP', 'getHostsResult'])
    // reportServerRes: state.getIn(['login','reportServerRes'])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    // ...bindActionCreators(action, dispatch),
    ...bindActionCreators(AppAction, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Login))
