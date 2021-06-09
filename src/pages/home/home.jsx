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
  const {
    appConfigList,
    modalData,
    // changeModalValue,
    handleSaveData,
    changeModalData,
    getList,
    filterWord,
  } = homeStore
  const {value} = modalData
  const {userInfo} = globalStore

  useEffect(() => {
    homeStore.getList()
  }, [])

  /**
   * 面板下的操作
   * @param {*} type view cope edit delete
   * @param {*} key
   */
  const doActions = (type, key) => {
    const appConfig = appConfigList.find((config) => {
      return key === config.key
    })
    if (!appConfig) return message.error('配置未找到')
    if (type === 'view') {
      return changeModalData({
        title: '',
        visible: true,
        type: 'read',
        loading: false,
        value: JSON.stringify(toJS(appConfig.config), null, 2),
      })
    }
    if (type === 'cope' && userInfo.permission & 2) {
      const value = toJS(appConfig.config)
      delete value.account
      value.key = ''
      return changeModalData({
        title: '新建',
        visible: true,
        type: 'add',
        loading: false,
        value: JSON.stringify(value, null, 2),
      })
    }
    if (type === 'edit' && appConfig.permission & 4) {
      return changeModalData({
        title: `编辑--${appConfig.config.name} (${key})`,
        visible: true,
        type: 'edit',
        loading: false,
        value: JSON.stringify(toJS(appConfig.config), null, 2),
        key: appConfig.key,
      })
    }
    if (type === 'delete' && appConfig.permission & 8) {
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
  }

  return (
    <div className="home p10">
      <div style={{height: 32, marginBottom: 8, display: 'flex', alignItems: 'center'}}>
        <div style={{flex: 1}} />
        <Button
          type="primary"
          className="mr10"
          onClick={async () => {
            await getList(true)
            message.success('操作成功！')
          }}
        >
          刷新
        </Button>
        {userInfo.permission & 2 && (
          <>
            <Button
              type="primary"
              className="mr10"
              onClick={() => {
                changeModalData({
                  visible: true,
                  type: 'add',
                  title: '新建',
                  loading: false,
                  value: '{}',
                })
              }}
            >
              新建
            </Button>
            <Deploy
              rootPath="init"
              // onUpload={(config) => {
              //   homeStore.add(config)
              // }}
            >
              <Button className="mr10" type="primary">
                初始化资源
              </Button>
            </Deploy>
          </>
        )}

        <Search
          placeholder="请输入关键字"
          style={{width: 200}}
          size="middle"
          className="fr"
          value={filterWord}
          onChange={(value) => homeStore.setValue('filterWord', value)}
        />
      </div>
      <div>
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
                  <a key="view" onClick={() => doActions('view', item.key)}>
                    查看
                  </a>,
                  <a
                    key="cope"
                    onClick={() => doActions('cope', item.key)}
                    className={classNames({actionDisable: !(userInfo.permission & 2)})}
                  >
                    复制
                  </a>,
                  <a
                    key="edit"
                    onClick={() => doActions('edit', item.key)}
                    className={classNames({actionDisable: !(item.permission & 4)})}
                  >
                    编辑
                  </a>,
                  <span key="apis">
                    <Link to={`${config.pathPrefix}/app/${item.key}/apis/index`}>接口</Link>
                  </span>,
                  <a
                    key="delete"
                    onClick={() => doActions('delete', item.key)}
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
      </div>
      <Modal
        title={modalData.title}
        visible={modalData.visible && modalData.type === 'read'}
        onOk={handleSaveData}
        onCancel={() => {
          changeModalData({visible: false})
        }}
        maskClosable
        width={700}
        footer={[
          <Button key="submit" type="primary" loading={modalData.loading} onClick={handleSaveData}>
            确定
          </Button>,
        ]}
      >
        <CodeBoxRead value={modalData.value} />
      </Modal>
      {/* // 两个查看编辑放一起会有显示问题 */}
      <Modal
        title={modalData.title}
        visible={modalData.visible && (modalData.type === 'add' || modalData.type === 'edit')}
        onOk={handleSaveData}
        onCancel={() => {
          changeModalData({visible: false})
        }}
        maskClosable={false}
        width={700}
      >
        <CodeBoxEdit
          value={modalData.value}
          onChange={(value) => {
            changeModalData({value})
          }}
        />
      </Modal>
    </div>
  )
}

export default inject('globalStore')(observer(Home))
