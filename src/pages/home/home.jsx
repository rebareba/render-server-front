import React, {useEffect} from 'react'
import {List, Card, Input, Modal, Button} from 'antd'
import {observer, inject} from 'mobx-react'
import {Link} from 'react-router-dom'
import {toJS} from 'mobx'
import classNames from 'classnames'
import {log, message, config} from '@utils'

import {CodeBoxRead, CodeBoxEdit} from '@components/component-code-box'

import Deploy from './deploy'

import homeStore from './home-store'

const {Search} = Input

const Home = function Login({globalStore}) {
  const {appConfigList, value, isAdd, appConfig, filterWord, editVisible, title, readVisible} = homeStore
  const {userInfo} = globalStore
  useEffect(() => {
    homeStore.getList()
  }, [])
  // 查看
  const actionView = (key) => {
    const appConfig = appConfigList.find((config) => {
      return key === config.key
    })
    if (!appConfig) return message.error('配置未找到')
    homeStore.setValue('readVisible', true)
    homeStore.setValue('appConfig', appConfig)
  }
  const actionDelete = (key) => {
    const appConfig = appConfigList.find((config) => {
      return key === config.key
    })
    if (!appConfig) return message.error('配置未找到')
    if (!(appConfig.permission & 8)) return
    Modal.confirm({
      title: `删除配置 (${key})`,
      content: `确认删除该配置: ${appConfig.config.name}`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        homeStore.delete(appConfig.key)
      },
    })
  }
  /**
   *  // 复制 cope编辑 edit 新建 add
   * @param {string} type
   * @param key
   */
  const actionChange = (type = 'edit', key) => {
    console.log('type', type, key)
    if (type !== 'edit' && !(userInfo.permission & 2)) return
    let title = '新建'
    let appConfig = {
      config: {},
      key: '',
      permission: 0,
    }
    if (type !== 'add') {
      const conf = appConfigList.find((config) => {
        return key === config.key
      })
      if (!conf) return message.error('配置未找到')
      appConfig = conf
      if (type === 'edit' && !(appConfig.permission & 4)) return
    }
    let isAdd = true
    if (type === 'edit' && appConfig) {
      title = `编辑--${appConfig.config.name} (${key})`
      isAdd = false
    }
    homeStore.set({
      editVisible: true,
      appConfig,
      title,
      value: JSON.stringify(toJS(appConfig.config), null, 2),
      isAdd,
    })
  }
  // 处理编辑还是新建
  const handleSave = async () => {
    try {
      const newAppConfig = JSON.parse(value)
      log('home value', newAppConfig)
      if (!newAppConfig.name || !newAppConfig.description) {
        message.warn('配置填写不规范, 必须添加name、 description 等')
        return
      }
      let success
      if (isAdd) {
        success = await homeStore.add(newAppConfig)
      } else {
        success = await homeStore.edit(appConfig.key, newAppConfig)
      }
      if (success) {
        homeStore.setValue('editVisible', false)
      }
    } catch (e) {
      message.error(`配置填写不规范： ${e.message}`)
    }
  }
  const handleCancel = () => {
    homeStore.set({
      readVisible: false,
      editVisible: false,
    })
  }
  const handleGetAppConfig = (value) => {
    homeStore.set({
      value,
    })
  }
  return (
    <div className="home p10">
      <div style={{height: 32, marginBottom: 8, display: 'flex', alignItems: 'center'}}>
        <div style={{flex: 1}} />
        <Button
          type="primary"
          className="mr10"
          onClick={async () => {
            await homeStore.getList(true)
            message.success('操作成功！')
          }}
        >
          刷新
        </Button>
        <Button
          type="primary"
          className="mr10"
          onClick={() => {
            actionChange('add', '')
          }}
        >
          新建
        </Button>

        <Deploy
          rootPath="init"
          onUpload={(config) => {
            homeStore.add(config)
          }}
        >
          <Button className="mr10" type="primary">
            初始化资源
          </Button>
        </Deploy>

        <Search
          placeholder="请输入关键字"
          style={{width: 200}}
          size="middle"
          className="fr"
          value={filterWord}
          onChange={(value) => homeStore.setValue('filterWord', value)}
        />
      </div>
      <List
        grid={{
          gutter: 16,
          column: 4,
        }}
        dataSource={appConfigList}
        renderItem={(item) => (
          <List.Item>
            <Card
              title={
                item.config.pageIndex ? (
                  <a target="_blank" rel="noreferrer" href={item.config.pageIndex}>
                    {item.config.name}
                  </a>
                ) : (
                  item.config.name
                )
              }
              extra={
                <Deploy rootPath={item.key}>
                  <Button size="small" type="link">
                    上传资源
                  </Button>
                </Deploy>
              }
              actions={[
                <a key="view" onClick={() => actionView(item.key)}>
                  查看
                </a>,
                <a
                  key="cope"
                  onClick={() => actionChange('cope', item.key)}
                  className={classNames({actionDisable: !(userInfo.permission & 2)})}
                >
                  复制
                </a>,
                <a
                  key="edit"
                  onClick={() => actionChange('edit', item.key)}
                  className={classNames({actionDisable: !(item.permission & 4)})}
                >
                  编辑
                </a>,
                <span key="apis">
                  <Link to={`${config.pathPrefix}/app/${item.key}/apis/index`}>接口</Link>
                </span>,
                <a
                  key="delete"
                  onClick={() => actionDelete(item.key)}
                  className={classNames({actionDisable: !(item.permission & 8)})}
                >
                  删除
                </a>,
              ]}
            >
              <p>配置标识: {item.key}</p>
              <p>{item.config.description}</p>
            </Card>
          </List.Item>
        )}
      />
      <Modal visible={readVisible} onCancel={handleCancel} onOk={handleCancel} width={700}>
        {readVisible ? <CodeBoxRead value={JSON.stringify(toJS(appConfig.config), null, 2)} /> : ''}
      </Modal>
      <Modal
        title={title}
        visible={editVisible}
        onOk={handleSave}
        onCancel={handleCancel}
        maskClosable={false}
        width={700}
      >
        {editVisible ? <CodeBoxEdit value={value} onChange={handleGetAppConfig} /> : ''}
      </Modal>
    </div>
  )
}

export default inject('globalStore')(observer(Home))
