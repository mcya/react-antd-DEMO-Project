import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as action from './action';
import { Row, Col, Form, Input, Button, message, Upload } from 'antd';
import styles from './style.css';
import headImg from '../../common/img/newHead.png';
import lrz from './lrz.bundle.js';
import { Get, Post } from '../../util/xFetch';
const FormItem = Form.Item;

function newPswCheck(val) {//新密码校验
  if (/\s/g.test(val)) {
    return {
      validateStatus: 'error',
      errorMsg: '请勿输入空格！'
    }
  } else if (val === '') {
    return {
      validateStatus: '',
      errorMsg: ''
    }
  }
  return {
    validateStatus: 'success',
    errorMsg: null
  }
}
function dbPswCheck(val, newpsw) {//重复新密码校验
  if (/\s/g.test(val)) {
    return {
      validateStatus: 'error',
      errorMsg: '请勿输入空格！'
    }
  } else if (val === '') {
    return {
      validateStatus: '',
      errorMsg: ''
    }
  } else if (val !== newpsw) {
    return {
      validateStatus: 'error',
      errorMsg: '两次密码输入不一致！！'
    }
  }
  return {
    validateStatus: 'success',
    errorMsg: null
  }
}

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class UserInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      newPsw: '',
      oldPswRules: { //旧密码
        validateStatus: '',
        errorMsg: null
      },
      newPswRules: { //新密码
        validateStatus: '',
        errorMsg: null
      },
      dbPswRules: { //重复新密码
        validateStatus: '',
        errorMsg: null
      },
      avatarUrl: headImg
    }
  }
  componentWillMount() {
    this.props.getPostByDeptid({ deptid: this.props.userInfo.deptid })
  }
  componentWillReceiveProps(nextProps) {

    //验证图片是否存在,如果存在则替换默认头像
    // const imgUrl = nextProps.servHost + '/system/user/getHeadImg.do';
    // const img = new Image();
    // const _self = this;
    // img.src = imgUrl;
    // img.onload = function() {
    //   // consol.log('loaded')
    //   _self.setState({
    //     avatarUrl: imgUrl
    //   })
    // }
    // img.onerror = function() {
    //   // console.log('user\'s avatar is error')
    // }

    // const oldPassword = this.props.form.getFieldValue('oldPassword');
    // if (/\s/g.test(oldPassword)) {
    //   this.setState({
    //     oldPswRules: {
    //       validateStatus: 'error',
    //       errorMsg: '请勿输入空格！'
    //     }
    //   })
    // }

    if (nextProps.validOldPswRes !== this.props.validOldPswRes && nextProps.validOldPswRes.success) {
      const data = nextProps.validOldPswRes.data;
      this.setState({
        oldPswRules: {
          validateStatus: data ? 'success' : 'error',
          errorMsg: data ? null : '密码不正确！'
        }
      })
    }
    if (nextProps.updatePswRes !== this.props.updatePswRes && nextProps.updatePswRes.success) {
      message.success(nextProps.updatePswRes.message);
      this.props.form.resetFields();
      this.setState({
        oldPswRules: { //旧密码
          validateStatus: '',
          errorMsg: null
        },
        newPswRules: { //新密码
          validateStatus: '',
          errorMsg: null
        },
        dbPswRules: { //重复新密码
          validateStatus: '',
          errorMsg: null
        }
      });
    }
  }
  handleChange = (info) => {
    // getBase64(info.file.originFileObj, avatarUrl => this.setState({ avatarUrl }));
  }
  upLoad = (file) => {
    const _self = this;
    lrz(file.file).then(function(rst){
      Promise.resolve(Post('/system/user/uploadHeadImg.do', { headImg: rst.base64}))
             .then(function(res) {
                message.success(res.jsonResult.message);
                _self.refs.avatarImg.src = rst.base64;
                _self.props.headImgChange(rst.base64);
                // to update avatar...
                //_self.props.updateAvatar(rst.base64)
             })
             .catch(function(err) {
                //console.log(err)
                message.error(err);
              })
    }).catch(function(err){
      console.log(err)
    }).always(function(){
      // console.log('lrz always')
    })
  }
  oldPswBlur = (e) => {
    const value = e.target.value;
    if (value !== '') {
      const params = {
        userid: this.props.userInfo.userid,
        password: e.target.value
      };
      this.props.oldPassword(params);
    } else {
      this.setState({
        oldPswRules: {
          validateStatus: '',
          errorMsg: null
        }
      })
    }
  }
  newPswBlur = (e) => {
    const value = e.target.value;
    this.setState({
      newPsw: value,
      newPswRules: {
        ...newPswCheck(value)
      }
    })
  }
  dbPswBlur = (e) => {
    const value = e.target.value;
    const { newPsw } = this.state;
    this.setState({
      dbPswRules: {
        ...dbPswCheck(value, newPsw)
      }
    })
  }
  handleOk = (e) => {
    const { newPsw } = this.state;
    const params = {
      userid: this.props.userInfo.userid,
      password: newPsw
    }
    this.props.updatePassword(params)
  }
  avatarLoaded = () => {
    // console.log('avatar loaded!')
  }
  avatarError = () => {
    // console.log('avatar error')
    this.refs.avatarImg.src = headImg;
  }
  render() {
    const defaultSrc = this.props.servHost ? this.props.servHost + '/system/user/getHeadImg.do' : headImg;
    const realSrc = this.props.headImgUrl ? this.props.headImgUrl : defaultSrc;
    const { getFieldDecorator } = this.props.form;
    const { oldPswRules, newPswRules, dbPswRules } = this.state;
    //保存按钮开关
    const saveLock = oldPswRules.validateStatus !== 'success' || newPswRules.validateStatus !== 'success' || dbPswRules.validateStatus !== 'success' ? true : false;
    return (
      <div className={styles['user-content']}>
        <div className={styles.title}>
          <h3>个人基本信息</h3>
        </div>
        <div className={styles.center}>
          <div className={styles.basicInfo}>
            <Row>
              <Col span={18}>
                <Row>
                  <Col span={8}>
                    <Row style={{ margin: '10px auto' }}>
                      <Col span={7} className={styles.key}>用户名：</Col>
                      <Col>{this.props.userInfo.username}</Col>
                    </Row>
                  </Col>
                  <Col span={8}>
                    <Row style={{ margin: '10px auto' }}>
                      <Col span={7} className={styles.key}>所属部门：</Col>
                      <Col>{this.props.getPostRes.data ? this.props.getPostRes.data.orgname : ''}</Col>
                    </Row>
                  </Col>
                  <Col span={8}>
                    <Row style={{ margin: '10px auto' }}>
                      <Col span={7} className={styles.key}>工号：</Col>
                      <Col>{this.props.userInfo.jobnumber}</Col>
                    </Row>
                  </Col>
                  <Col span={8}>
                    <Row style={{ margin: '10px auto' }}>
                      <Col span={7} className={styles.key}>手机号码：</Col>
                      <Col>{this.props.userInfo.mobilephone}</Col>
                    </Row>
                  </Col>
                  <Col span={8}>
                    <Row style={{ margin: '10px auto' }}>
                      <Col span={7} className={styles.key}>电子邮件：</Col>
                      <Col>{this.props.userInfo.email}</Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col span={6}>
                <Row style={{ textAlign: 'center' }}>
                  <img src={ realSrc } className={styles.headImg} ref='avatarImg' onLoad={this.avatarLoaded} onError={this.avatarError} />
                </Row>
                {/*<Row style={{ textAlign: 'center' }}>
                  <Button>修改头像</Button>
                </Row>*/}
                <div style={{ textAlign: 'center' }}>
                  <Upload
                    className="avatar-uploader"
                    name="headImg"
                    accept="image/*"
                    showUploadList={false}
                    onChange={this.handleChange}
                    action="/system/user/uploadHeadImg.do"
                    customRequest={this.upLoad}
                  >
                    <Button>修改头像</Button>
                  </Upload>
                </div>
              </Col>
            </Row>
          </div>
          <div>
            <h3 className={styles.changePsw}>修改密码</h3>
            <Form>
              <Row>
                <Col span={7}>
                  <FormItem label="旧密码" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}
                    hasFeedback
                    required
                    validateStatus={oldPswRules.validateStatus}
                    help={oldPswRules.errorMsg}
                  >
                    {getFieldDecorator('oldPassword')(
                      <Input size="large" type="password" onBlur={this.oldPswBlur} />
                    )}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem label="新密码" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}
                    hasFeedback
                    required
                    validateStatus={newPswRules.validateStatus}
                    help={newPswRules.errorMsg}
                  >
                    {getFieldDecorator('password')(
                      <Input size="large" type="password" onBlur={this.newPswBlur} />
                    )}
                  </FormItem>
                </Col>
                <Col span={7}>
                  <FormItem label="重复新密码" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}
                    hasFeedback
                    required
                    validateStatus={dbPswRules.validateStatus}
                    help={dbPswRules.errorMsg}
                  >
                    {getFieldDecorator('dbPassword')(
                      <Input size="large" type="password" onBlur={this.dbPswBlur} />
                    )}
                  </FormItem>
                </Col>
                <Col span={3}>
                  <Button type="primary" disabled={saveLock} style={{ marginLeft: 10 }} onClick={this.handleOk} loading={this.props.updPswLoading}>保存</Button>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    userInfo: state.getIn(['APP', 'userInfo']).user,
    getPostRes: state.getIn(['userCenter', 'userInfo', 'getPostRes']),
    validOldPswRes: state.getIn(['userCenter', 'userInfo', 'validOldPswRes']),
    updPswLoading: state.getIn(['userCenter', 'userInfo', 'updPswLoading']),
    updatePswRes: state.getIn(['userCenter', 'userInfo', 'updatePswRes']),
    servHost: state.getIn(['APP', 'servHost'])
  }
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(action, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(UserInfo));
