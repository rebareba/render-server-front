import React, {useState} from 'react'
import {observer, inject} from 'mobx-react'
import './login.styl'

import bg from '@assets/image/bg.jpg'

const Login = ({globalStore}) => {
  // const [loginStore] = useState(new LoginStore())
  const {account, password, loading} = globalStore
  const [message, setMessage] = useState('')
  const handleSubmit = async (e) => {
    e.preventDefault()
    const {message} = await globalStore.login(account, password)
    setMessage(message)
  }
  return (
    <div className="loginMain" style={{backgroundImage: `url(${bg})`}}>
      <div className="formContainer cfb40">
        <div className="title mt30">登 录</div>
        <form className="mt30" onSubmit={handleSubmit}>
          <input
            name="account"
            type="text"
            value={account}
            placeholder="登陆账号"
            onChange={(e) => {
              e.preventDefault()
              setMessage('')
              globalStore.set('account', e.target.value)
            }}
          />
          <input
            name="password"
            type="password"
            value={password}
            placeholder="请输入密码"
            onChange={(e) => {
              e.preventDefault()
              setMessage('')
              globalStore.set('password', e.target.value)
            }}
          />
          <div className="mt20">
            <input className="submitButton" type="submit" value={loading ? '登录中...' : '登录'} />
          </div>
          <div className="errorMessage">{message}</div>
        </form>
      </div>
    </div>
  )
}

export default inject('globalStore')(observer(Login))
