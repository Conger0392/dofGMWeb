import React, { Component } from 'react'
import { Form, Icon, Input, Button, message } from 'antd';
import { connect } from 'react-redux'
import axios from 'axios'
import { Redirect } from 'react-router-dom';

import { createSaveUserInfoAction } from '../../redux/actions/login_action'
import { reqLogin } from '../../api'
import logo from '../../static/imgs/logo.png'
import './css/login.less'

const { Item } = Form

@connect(
  state => ({isLogin:state.userInfo.isLogin}),
  {
    saveUserInfo: createSaveUserInfoAction,
  }
)
@Form.create()
class Login extends Component {

  //点击登录按钮的回调
  handleSubmit = (event) => {
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    event.preventDefault();//阻止默认事件--禁止form表单提交---通过ajax发送
    this.props.form.validateFields(async(err, values) => {
      let { username, password } = values
      if (!err) {
        let result = await reqLogin(username, password)
        // console.log(result);
        let {status,msg,data} = result

        if (0 === status) {
          this.props.saveUserInfo(data)  
          this.props.history.replace('/admin')

        }else{
          message.warning(msg,1)
        }
      }
    })
  }

  //密码的验证器---每当在密码输入框输入东西后，都会调用此函数去验证输入是否合法。自定义校验，即：自己写判断

  

  render() {
    const { getFieldDecorator } = this.props.form;
    const { isLogin } = this.props;
    if (isLogin) {
      return <Redirect to='/admin/home'/>
    }
    return (
      <div className="login">
        <header>
          <img src={logo} alt="logo" />
          <h1>GM工具</h1>
        </header>
        <section>
          <h1>用户登录</h1>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {getFieldDecorator('username', {
                rules: [
                  { required: true, message: '请输入用户名' },
                  { min: 4, message: '用户名最小为4位' },
                  { max: 12, message: '用户名最大为12位' },
                  { pattern: /^\w+$/, message: '用户名只能为字母数字下划线组合' },


                ],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />,
              )}

            </Item>
            <Item>

              {getFieldDecorator('password', {
                rules: [{
                  validator: (rule, value, callback) => {
                    if (!value) {
                      callback('请输入密码')
                    } else if (value.length > 12) {
                      callback('密码不能大于12位')
                    } else if (value.length < 4) {
                      callback('密码不能小于4位')
                    } else if (!(/^\w+$/).test(value)) {
                      callback('密码为字母数字下划线')
                    } else {
                      callback()
                    }
                  }
                }
                ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="密码" type='password'
                />,
              )}

            </Item>
            <Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Item>
          </Form>
        </section>
      </div>
    )
  }
}
export default Login
