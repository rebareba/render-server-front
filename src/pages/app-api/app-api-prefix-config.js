import React, {Component} from 'react'
import {action} from 'mobx'
import {observer} from 'mobx-react'
import {Table, Icon} from 'antd'
import {withRouter} from 'react-router'
import store from './service-detail-store'
import InfoBox from '../component-info-box'
import AppKeyAddModal from './modal-appkey-add'
import AppKeyBind from './appkey-bind'
import AppKeyBindList from './appkey-bindlist'

@observer
class AppApiPrefixConfig extends Component {
  constructor() {
    super()
    this.appKeyColumns = [
      {title: '调用方', dataIndex: 'appName', key: 'appName'},
      {title: 'AppKey', dataIndex: 'appKey', key: 'appKey'},
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: '20%',
        render: (text, record) => {
          return (
            <div>
              <button className="button-style" onClick={() => this.showAppKeyBindListFullScreen(record)}>
                查看
              </button>
              <button className="button-style" onClick={() => this.showAppKeyBindFullScreen(record)}>
                绑定
              </button>
            </div>
          )
        },
      },
    ]
  }

  @action.bound showAddAppKeyModal() {
    store.modalVisible.appKeyAdd = true
  }

  // 全屏进行绑定api操作
  @action.bound showAppKeyBindFullScreen(record) {
    store.currentAppKeyDetail = record
    store.showAppKeyBind = true
    store.getAppKeybindList()
  }

  // 全屏查看当前服务已经秘钥所绑定的api列表
  @action.bound showAppKeyBindListFullScreen(record) {
    store.currentAppKeyDetail = record
    store.showAppKeyBindList = true
    store.getAppKeybindList()
  }

  render() {
    const httpConfigProps = {
      columns: this.appKeyColumns,
      rowKey: 'appKey',
      bordered: true,
      pagination: false,
      dataSource: store.appKeyList,
      size: 'small',
    }

    return (
      <div>
        <InfoBox
          title="密钥绑定配置"
          extra={
            <button className="button-style-hover" onClick={this.showAddAppKeyModal}>
              <Icon type="plus" /> 添加
            </button>
          }
          type="table"
        >
          <Table {...httpConfigProps} />
        </InfoBox>
        <AppKeyAddModal />

        {store.showAppKeyBind ? <AppKeyBind /> : null}
        {store.showAppKeyBindList ? <AppKeyBindList /> : null}
      </div>
    )
  }
}

export default withRouter(AppApiPrefixConfig)
