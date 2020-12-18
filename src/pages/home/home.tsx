import * as React from 'react'
import {List, Card, Input, Modal, Button, message, Dropdown, Menu} from 'antd'
import {observer, inject} from 'mobx-react'
import {Link} from 'react-router-dom'
import {toJS} from 'mobx'
import classNames from 'classnames'
import {log, warningTip, FrameProps, config, AppConfig} from '@src/common/utils'
const {Search} = Input
import {DownOutlined} from '@ant-design/icons'

import {CodeBoxRead, CodeBoxEdit} from '@src/components/component-code-box'

import Deploy from './deploy'

@inject('globalStore')
@observer
export default class Home extends React.Component<FrameProps, any> {
  state = {
    readVisible: false,
    editVisible: false,
    appConfig: {
      config: {},
      key: '',
      permission: 0,
    },
    value: '',
    title: '',
    add: false,
  }
  componentDidMount() {
    this.props.globalStore.getList()
  }
  actionView = (key: string) => {
    const {appConfigList} = this.props.globalStore
    const appConfig = appConfigList.find((config: any) => {
      return key === config.key
    })
    if (!appConfig) return warningTip('配置未找到')
    this.setState({
      readVisible: true,
      appConfig: appConfig,
    })
  }
  actionDelete = (key: string) => {
    log('actionDelete key', key)
    const {appConfigList} = this.props.globalStore
    const appConfig = appConfigList.find((config: any) => {
      return key === config.key
    })
    if (!appConfig) return warningTip('配置未找到')
    if (!(appConfig.permission & 8)) return
    Modal.confirm({
      title: `删除配置 (${key})`,
      content: `确认删除该配置: ${appConfig.config.name}`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props.globalStore.delete(appConfig.key)
      },
    })
  }
  /**
   *  // 复制 cope编辑 edit 新建 add
   * @param {string} type
   * @param key
   */
  actionChange = (type = 'edit', key: string): void | boolean => {
    const {userInfo} = this.props.globalStore
    if (type !== 'edit' && !(userInfo.permission & 2)) return
    const {appConfigList} = this.props.globalStore
    let title = '新建'
    let appConfig: AppConfig = {
      config: {},
      key: '',
      permission: 0,
    }
    if (type !== 'add') {
      const conf = appConfigList.find((config: any) => {
        return key === config.key
      })
      if (!conf) return warningTip('配置未找到')
      appConfig = conf
      if (type === 'edit' && !(appConfig.permission & 4)) return
    }
    let add = true
    if (type === 'edit' && appConfig) {
      title = `编辑--${appConfig.config.name} (${key})`
      add = false
    }
    this.setState({
      editVisible: true,
      appConfig: appConfig,
      title,
      value: JSON.stringify(toJS(appConfig.config), null, 2),
      add,
    })
  }
  handleSave = async (): void => {
    try {
      log('home this.value', this.state.value)
      const value = JSON.parse(this.state.value)
      log('home value', value)
      if (!value.name || !value.description) {
        warningTip('配置填写不规范')
        return
      }
      let success
      if (this.state.add) {
        success = await this.props.globalStore.add(value)
      } else {
        success = this.props.globalStore.edit(this.state.appConfig.key, value)
      }
      if (success) {
        this.setState({
          editVisible: false,
        })
      }
    } catch (e) {
      warningTip('配置填写不规范' + e.message)
    }
  }

  handleCancel = (): void => {
    this.setState({
      readVisible: false,
      editVisible: false,
    })
  }
  handleGetAppConfig = (value: any) => {
    this.setState({
      value: value,
    })
  }
  handleFiliter = (e: any) => {
    this.props.globalStore.setFilterWord(e.target.value)
  }

  render() {
    const {userInfo} = this.props.globalStore
    const {configList: appConfigList} = this.props.globalStore
    return (
      <div className="home p10">
        <div style={{height: 32, marginBottom: 8, display: 'flex', alignItems: 'center'}}>
          <div style={{flex: 1}}></div>
          <Button
            type="primary"
            className="mr10"
            onClick={async () => {
              await this.props.globalStore.getList(true)
              message.success('操作成功！')
            }}
          >
            刷新
          </Button>
          <Button
            type="primary"
            className="mr10"
            onClick={() => {
              this.actionChange('add', '')
            }}
          >
            新建
          </Button>

          <Deploy
            rootPath="init"
            onUpload={(config) => {
              this.props.globalStore.add(config)
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
            onChange={this.handleFiliter}
          />
        </div>
        <List
          grid={{
            gutter: 16,
            column: 4,
          }}
          dataSource={appConfigList}
          renderItem={(item: any) => (
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
                  <a key="view" onClick={() => this.actionView(item.key)}>
                    查看
                  </a>,
                  <a
                    key="cope"
                    onClick={() => this.actionChange('cope', item.key)}
                    className={classNames({actionDisable: !(userInfo.permission & 2)})}
                  >
                    复制
                  </a>,
                  <a
                    key="edit"
                    onClick={() => this.actionChange('edit', item.key)}
                    className={classNames({actionDisable: !(item.permission & 4)})}
                  >
                    编辑
                  </a>,
                  <a key="apis">
                    <Link to={`${config.pathPrefix}/app/${item.key}/apis/index`}>接口</Link>
                  </a>,
                  <a
                    key="delete"
                    onClick={() => this.actionDelete(item.key)}
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
        <Modal visible={this.state.readVisible} onCancel={this.handleCancel} onOk={this.handleCancel} width={700}>
          {this.state.readVisible ? (
            <CodeBoxRead value={JSON.stringify(toJS(this.state.appConfig.config), null, 2)} />
          ) : (
            ''
          )}
        </Modal>
        <Modal
          title={this.state.title}
          visible={this.state.editVisible}
          onOk={this.handleSave}
          onCancel={this.handleCancel}
          maskClosable={false}
          width={700}
        >
          {this.state.editVisible ? <CodeBoxEdit value={this.state.value} onChange={this.handleGetAppConfig} /> : ''}
        </Modal>
      </div>
    )
  }
}
