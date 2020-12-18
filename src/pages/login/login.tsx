import React, {Component} from 'react'
import {LockOutlined, UserOutlined} from '@ant-design/icons'
import {Form} from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import {Input, Button} from 'antd'
import {inject, observer} from 'mobx-react'
import {config, log} from '../../common/utils'
import './login.css'
const FormItem = Form.Item

@inject('globalStore')
@observer
class NormalLoginForm extends Component<any, any> {
  handleSubmit = (e: any) => {
    e.preventDefault()
    this.props.form.validateFields(async (err: any, values: any) => {
      if (!err) {
        log('Received values of form: ', values)
        log('this.props', this.props)
        const success = await this.props.globalStore.login(values.account, values.password)
        if (success) {
          this.props.history.push(`${config.pathPrefix}/home`)
        }
      } else {
        log(err)
      }
    })
  }

  render() {
    const {getFieldDecorator} = this.props.form
    return (
      <div className="page-login">
        <div className="container">
          <div className="login-main">
            <div style={{textAlign: 'center', fontSize: '16px', marginBottom: '20px'}}>前端渲染服务管理平台</div>
            <Form onSubmit={this.handleSubmit}>
              <FormItem>
                {getFieldDecorator('account', {
                  rules: [{required: true, message: '请输入账号'}],
                })(<Input prefix={<UserOutlined style={{color: 'rgba(0,0,0,.25)'}} />} placeholder="账号" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{required: true, message: '请输入密码'}],
                })(
                  <Input
                    prefix={<LockOutlined style={{color: 'rgba(0,0,0,.25)'}} />}
                    type="password"
                    placeholder="密码"
                  />,
                )}
              </FormItem>
              <FormItem>
                <Button type="primary" className="btn" htmlType="submit">
                  登录
                </Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}
const LoginForm = Form.create()(NormalLoginForm)
export default LoginForm
