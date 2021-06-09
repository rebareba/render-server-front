import React, {useEffect, useState} from 'react'
import {DownOutlined} from '@ant-design/icons'
import {Layout, Menu, Spin, Dropdown} from 'antd'
import {observer, inject} from 'mobx-react'
import {Link, useLocation} from 'react-router-dom'
import {config} from '@utils'

import logo from '@assets/svg/logo.svg'

const {Header, Content, Footer} = Layout

const Frame = ({globalStore, children}) => {
  // const [collapsed, setCollapsed] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState(['home'])
  const location = useLocation()
  useEffect(() => {
    globalStore.loginInfo()
  }, [])
  useEffect(() => {
    setSelectedKeys([location.pathname.replace(config.pathPrefix, '').split('/')[1] || '/'])
  }, [location])
  const {userInfo} = globalStore
  if (userInfo) {
    return (
      <Layout className="frame">
        <Header className="fbh fbac" style={{background: '#fff', padding: 0}}>
          <div className="frame-logo p10">
            <img src={logo} className="w100 h100" />
          </div>

          <div className="fb1 fbh fbac fbjb">
            <div className="fs26 fw500">前端渲染服务管理</div>
            <Menu mode="horizontal" selectedKeys={selectedKeys} style={{lineHeight: '64px'}} className="fb1 ml10">
              <Menu.Item key="home">
                <Link to={`${config.pathPrefix}/home`}>首页</Link>
              </Menu.Item>
              <Menu.Item key="about">
                <Link to={`${config.pathPrefix}/about`}>说明</Link>
              </Menu.Item>
              <Menu.Item key="plugin">
                <Link to={`${config.pathPrefix}/plugin`}>插件</Link>
              </Menu.Item>
            </Menu>
          </div>
          <div>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item className="mt0 mb0 pt4 pb4" onClick={globalStore.logout}>
                    退出登录
                  </Menu.Item>
                </Menu>
              }
              trigger={['click']}
            >
              <div className="fbh fbac fbje pr20 hand">
                <div className="ml8">
                  {userInfo.nickname} <DownOutlined />
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="pt10">{children}</Content>
        <Footer style={{textAlign: 'center'}} />
      </Layout>
    )
  }
  return (
    <div style={{textAlign: 'center'}}>
      {' '}
      <Spin />
    </div>
  )
}

export default inject('globalStore')(observer(Frame))
